"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  generateRSAKeyPair, 
  savePrivateKey, 
  loadPrivateKey, 
  signMessage, 
  createSecureEnvelope, 
  openSecureEnvelope 
} from '../lib/crypto/forgeClient';
import forge from 'node-forge';

export default function Page() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // PKI 상태
  const [userCert, setUserCert] = useState(null);
  const [isSecureAuthenticated, setIsSecureAuthenticated] = useState(false);
  const [messages, setMessages] = useState([]);
  const [certInfo, setCertInfo] = useState(null);
  
  // UI 상태
  const [loading, setLoading] = useState(false);
  const [certPassword, setCertPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [receiverIdStr, setReceiverIdStr] = useState('');
  const [openedMsg, setOpenedMsg] = useState(null);
  const [copyStatus, setCopyStatus] = useState('복사');

  // 1. 세션 초기화
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCertAndMessages(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchCertAndMessages(session.user.id);
      } else {
        setUserCert(null);
        setIsSecureAuthenticated(false);
        setMessages([]);
        setActiveTab('dashboard');
        setCertInfo(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // 2. 초기 데이터 불러오기
  const fetchCertAndMessages = async (userId) => {
    const { data: certData, error: certError } = await supabase
      .from('user_pki_certs')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (certError) console.log('Cert Fetch Info:', certError.message);

    if (certData) {
      setUserCert(certData);
      try {
        const cert = forge.pki.certificateFromPem(certData.cert_pem);
        const fingerprint = forge.md.sha256.create().update(forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).getBytes()).digest().toHex();
        setCertInfo({
          subject: cert.subject.getField('CN')?.value,
          issuer: cert.issuer.getField('CN')?.value,
          notAfter: cert.validity.notAfter.toLocaleDateString(),
          fingerprint: fingerprint.match(/.{1,2}/g).join(':').toUpperCase()
        });
      } catch (e) { console.error('Cert Analysis Error:', e); }
    } else {
      setUserCert(null);
      setCertInfo(null);
    }

    const { data: msgData, error: msgError } = await supabase
      .from('secure_envelopes')
      .select('*')
      .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (msgError) console.error('Message Fetch Error:', msgError.message);
    if (msgData) {
      console.log('Fetched Messages Count:', msgData.length);
      setMessages(msgData);
    }
  };

  const handleDeleteCert = async () => {
    if (!confirm("정말로 인증서를 삭제하시겠습니까? 삭제 후에는 기존에 받은 보안 메시지를 열람할 수 없게 됩니다.")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('user_pki_certs').delete().eq('id', session.user.id);
      if (error) throw new Error(error.message);
      alert("인증서가 삭제되었습니다.");
      setUserCert(null);
      setCertInfo(null);
      setIsSecureAuthenticated(false);
      localStorage.removeItem('pki_private_key');
    } catch (err) {
      alert("인증서 삭제 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const handleCopyId = () => {
    if (session) {
      navigator.clipboard.writeText(session.user.id);
      setCopyStatus('복사됨!');
      setTimeout(() => setCopyStatus('복사'), 2000);
    }
  };

  const handleIssueCert = async () => {
    if (!certPassword) return alert("개인키 보호를 위한 비밀번호를 입력해주세요.");
    setLoading(true);
    try {
      const keypair = generateRSAKeyPair(2048);
      const publicPem = forge.pki.publicKeyToPem(keypair.publicKey);
      savePrivateKey(keypair.privateKey, certPassword);

      const res = await fetch('/api/pki/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicKeyPem: publicPem, username: session.user.user_metadata?.preferred_username || session.user.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const { error: dbError } = await supabase.from('user_pki_certs').upsert({
        id: session.user.id,
        cert_pem: data.certPem,
        public_key: publicPem
      });

      if (dbError) throw new Error(dbError.message);
      alert("인증서 발급 완료");
      fetchCertAndMessages(session.user.id);
      setCertPassword('');
    } catch (err) {
      alert("인증서 발급 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSecureLogin = async () => {
    if (!loginPassword) return alert("개인키 비밀번호를 입력하세요.");
    setLoading(true);
    try {
      const privateKey = loadPrivateKey(loginPassword);
      const time = Date.now().toString();
      const messageToSign = `${session.user.id}_${time}`;
      const signatureHex = signMessage(messageToSign, privateKey);

      const res = await fetch('/api/pki/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id, time, signature: signatureHex, userCertPem: userCert.cert_pem })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      alert("전자서명 인증 성공! 보안 세션이 열렸습니다.");
      setIsSecureAuthenticated(true);
      setLoginPassword('');
    } catch (err) {
      alert("인증 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEnvelope = async () => {
    const trimmedReceiverId = receiverIdStr.trim();
    if (!trimmedReceiverId || !draftMessage) return alert("수신자 ID와 메시지를 입력하세요.");
    setLoading(true);
    try {
      const privateKey = loadPrivateKey(prompt("서명 및 송신을 위해 개인키 비밀번호를 입력해주세요:"));
      const { data: receiverCert } = await supabase.from('user_pki_certs').select('public_key').eq('id', trimmedReceiverId).single();
      if (!receiverCert) throw new Error("수신자의 공개키를 찾을 수 없습니다.");

      const { encryptedMessageHex, encryptedSessionKeyHex } = createSecureEnvelope(draftMessage, privateKey, receiverCert.public_key);

      const { error } = await supabase.from('secure_envelopes').insert({
        sender_id: session.user.id,
        receiver_id: trimmedReceiverId,
        encrypted_message_hex: encryptedMessageHex,
        encrypted_session_key_hex: encryptedSessionKeyHex
      });

      if (error) throw new Error(error.message);
      alert("보안 메시지 전송 완료!");
      setDraftMessage('');
      setReceiverIdStr('');
      await fetchCertAndMessages(session.user.id);
    } catch (err) {
      alert("메시지 전송 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!confirm("이 보안 메시지를 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('secure_envelopes').delete().eq('id', msgId);
      if (error) throw new Error(error.message);
      setMessages(prev => prev.filter(m => m.id !== msgId));
      if (openedMsg?.id === msgId) setOpenedMsg(null);
    } catch (err) {
      alert("삭제 실패: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReadEnvelope = async (msg) => {
    try {
      const privateKey = loadPrivateKey(prompt("메시지 열람을 위해 개인키 비밀번호를 입력해주세요:"));
      const { data: senderCert } = await supabase.from('user_pki_certs').select('public_key').eq('id', msg.sender_id).single();
      if (!senderCert) throw new Error("송신자의 공개키를 가져오지 못해 무결성을 검증할 수 없습니다.");

      const { verified, originalMessage } = openSecureEnvelope(
        msg.encrypted_message_hex, msg.encrypted_session_key_hex, privateKey, senderCert.public_key
      );

      setOpenedMsg({ id: msg.id, content: originalMessage, verified });
    } catch (err) {
      alert("메시지 열람 실패: " + err.message);
    }
  };

  // 스타일
  const S = {
    page: { minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#1c1b3a 50%,#0f0c29 100%)', fontFamily: "'Inter',system-ui,sans-serif", color: '#f8fafc' },
    glass: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)', borderRadius: 20 },
    glassBright: { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', borderRadius: 14 },
    inp: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '11px 14px', color: '#e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    btn: (color) => ({ background: color, border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 13, borderRadius: 12, padding: '12px 0', width: '100%', transition: 'all .2s' }),
    label: { fontSize: 9, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 },
    stepNum: (done, color) => ({ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, background: done ? 'rgba(99,102,241,.15)' : color, color: '#fff' }),
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}
        input::placeholder,textarea::placeholder{color:#475569;}
        input:focus,textarea:focus{border-color:#6366f1!important;outline:none;}
        textarea{font-family:inherit;resize:none;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
        .hover-lift:hover:not(:disabled){transform:translateY(-1px);opacity:.88;}
        button:disabled{opacity:.4;cursor:not-allowed;}
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, background: 'rgba(15,12,41,0.75)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px', height: 60 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>🔐</div>
          <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>보안프로토콜</span>
        </div>
        {session && (
          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', padding: 4, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
            {[['dashboard', '대시보드'], ['profile', '내 정보']].map(([tab, label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className="hover-lift"
                style={{ padding: '6px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all .2s', background: activeTab === tab ? 'rgba(99,102,241,0.8)' : 'transparent', color: activeTab === tab ? '#fff' : '#64748b' }}>
                {label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {session && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: isSecureAuthenticated ? '#10b981' : '#f59e0b', boxShadow: isSecureAuthenticated ? '0 0 8px #10b981' : '0 0 8px #f59e0b' }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>{isSecureAuthenticated ? 'SECURE' : 'STANDARD'}</span>
            </div>
          )}
          {session && <img src={session.user.user_metadata?.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(99,102,241,.4)' }} />}
        </div>
      </nav>

      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '76px 24px 60px' }}>
          <div style={{ marginBottom: 32, paddingTop: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: '#6366f1', marginBottom: 8, textTransform: 'uppercase' }}>인증서 · 전자봉투</p>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>인증서 및 전자봉투 기반 보안 통신 웹 어플리케이션</h1>
          </div>

          {!session ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', borderRadius: 24, border: '2px dashed rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', gap: 18 }}>
              <div style={{ fontSize: 52 }}>🔒</div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>로그인이 필요합니다</h2>
              <p style={{ color: '#cbd5e1', fontSize: 13 }}>GitHub 계정으로 시작하세요</p>
              <button onClick={handleGithubLogin} className="hover-lift" style={{ ...S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)'), width: 'auto', padding: '12px 36px', fontSize: 14 }}>
                GitHub으로 계속하기
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
              {/* LEFT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* 인증서 발급 */}
                <div style={{ ...S.glass, padding: 22, opacity: userCert ? 0.55 : 1, transition: 'opacity .3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={S.stepNum(!!userCert, 'linear-gradient(135deg,#6366f1,#8b5cf6)')}>{userCert ? '✓' : '1'}</div>
                      <div>
                        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>인증서 발급 기능</h2>
                        <p style={{ fontSize: 10, color: '#94a3b8' }}>Certificate Issuance</p>
                      </div>
                    </div>
                    {userCert && <span style={{ background: 'rgba(99,102,241,.15)', color: '#a5b4fc', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, border: '1px solid rgba(99,102,241,.3)' }}>완료</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 14 }}>클라이언트가 키쌍 생성, 인증서 발급 신청을 하고 서버가 인증서를 발급하여 DB에 저장하고 클라이언트에게 전송하는 기능</p>
                  <input type="password" placeholder="개인키 보호 비밀번호" value={certPassword} onChange={e => setCertPassword(e.target.value)} style={{ ...S.inp, marginBottom: 10 }} />
                  <button disabled={loading || !!userCert} onClick={handleIssueCert} className="hover-lift" style={S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)')}>
                    {loading ? '처리 중...' : userCert ? '인증서 발급 완료됨' : '인증서 발급 신청'}
                  </button>
                </div>

                {/* 전자서명 로그인 */}
                <div style={{ ...S.glass, padding: 22, opacity: !userCert ? 0.3 : isSecureAuthenticated ? 0.55 : 1, pointerEvents: !userCert ? 'none' : 'auto', transition: 'opacity .3s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={S.stepNum(isSecureAuthenticated, 'linear-gradient(135deg,#059669,#10b981)')}>{isSecureAuthenticated ? '✓' : '2'}</div>
                      <div>
                        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>전자서명 로그인</h2>
                        <p style={{ fontSize: 10, color: '#94a3b8' }}>Digital Signature Auth</p>
                      </div>
                    </div>
                    {isSecureAuthenticated && <span style={{ background: 'rgba(16,185,129,.12)', color: '#6ee7b7', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 999, border: '1px solid rgba(16,185,129,.25)' }}>인증됨</span>}
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 14 }}>발급된 인증서에 해당되는 개인키를 이용하여 전자서명을 전송하고 이것으로 서버에 로그인 하는 기능</p>
                  <input type="password" placeholder="개인키 비밀번호" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ ...S.inp, marginBottom: 10 }} />
                  <button disabled={loading || !userCert || isSecureAuthenticated} onClick={handleSecureLogin} className="hover-lift" style={S.btn('linear-gradient(135deg,#059669,#10b981)')}>
                    {isSecureAuthenticated ? '전자서명 인증 완료' : '서명 전송 및 로그인'}
                  </button>
                </div>

                {/* 전자봉투 기반 보안통신 */}
                <div style={{ ...S.glass, padding: 22, opacity: !isSecureAuthenticated ? 0.3 : 1, pointerEvents: !isSecureAuthenticated ? 'none' : 'auto', transition: 'opacity .3s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={S.stepNum(false, 'linear-gradient(135deg,#7c3aed,#a855f7)')}>3</div>
                    <div>
                      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 1 }}>전자봉투 기반 보안통신</h2>
                      <p style={{ fontSize: 10, color: '#94a3b8' }}>E2E Encrypted Envelope</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.7, marginBottom: 14 }}>송신자와 수신자가 모두 인증서를 발급받은 상태인 경우, 송신자가 서명하고 수신자의 공개키로 암호화된 전자봉투 메시지를 전송하는 기능</p>
                  <input type="text" placeholder="수신자 UUID" value={receiverIdStr} onChange={e => setReceiverIdStr(e.target.value)} style={{ ...S.inp, fontFamily: 'monospace', fontSize: 11, marginBottom: 10 }} />
                  <textarea placeholder="메시지 내용..." value={draftMessage} onChange={e => setDraftMessage(e.target.value)} style={{ ...S.inp, height: 80, marginBottom: 10 }} />
                  <button disabled={loading || !isSecureAuthenticated} onClick={handleSendEnvelope} className="hover-lift" style={S.btn('linear-gradient(135deg,#7c3aed,#a855f7)')}>
                    🔒 전자봉투 전송
                  </button>
                </div>
              </div>

              {/* 수신메일함 */}
              <div style={{ ...S.glass, padding: 22, alignSelf: 'start', minHeight: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <div>
                    <h2 style={{ fontSize: 14, fontWeight: 700 }}>보안 수신함</h2>
                    <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>Secure Envelope Inbox</p>
                  </div>
                  {messages.length > 0 && (
                    <span style={{ background: 'rgba(99,102,241,.2)', color: '#a5b4fc', fontSize: 11, fontWeight: 700, padding: '2px 12px', borderRadius: 999, border: '1px solid rgba(99,102,241,.25)' }}>{messages.length}</span>
                  )}
                </div>
                {messages.length === 0 ? (
                  <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                    <p style={{ color: '#64748b', fontSize: 12 }}>수신된 전자봉투가 없습니다</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {messages.map(msg => (
                      <div key={msg.id} style={S.glassBright}>
                        <div style={{ padding: '12px 14px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                              <span style={{ fontSize: 9, color: msg.sender_id === session.user.id ? '#a5b4fc' : '#10b981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {msg.sender_id === session.user.id ? '📤 발신' : '📥 수신'}
                              </span>
                              <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#64748b', marginTop: 2, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.sender_id}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 9, color: '#334155' }}>{new Date(msg.created_at).toLocaleTimeString()}</span>
                              <button onClick={() => handleDeleteMessage(msg.id)}
                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#475569', fontSize: 14, lineHeight: 1, padding: '2px 4px', borderRadius: 6, transition: 'color .15s' }}
                                onMouseOver={e => e.currentTarget.style.color = '#ef4444'}
                                onMouseOut={e => e.currentTarget.style.color = '#475569'}>✕</button>
                            </div>
                          </div>
                          {openedMsg?.id === msg.id ? (
                            <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 10, padding: '10px 12px', marginTop: 4 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.05em', color: openedMsg.verified ? '#10b981' : '#ef4444' }}>
                                {openedMsg.verified ? '✓ 무결성 검증 완료' : '✗ 변조 의심'}
                              </span>
                              <p style={{ fontSize: 13, marginTop: 6, color: '#cbd5e1', lineHeight: 1.6 }}>{openedMsg.content}</p>
                            </div>
                          ) : (
                            <button onClick={() => handleReadEnvelope(msg)} className="hover-lift"
                              style={{ border: '1px solid rgba(99,102,241,.3)', background: 'rgba(99,102,241,.1)', color: '#a5b4fc', borderRadius: 8, padding: '5px 14px', fontSize: 11, fontWeight: 600, cursor: 'pointer', marginTop: 4, transition: 'all .2s' }}>
                              🔓 전자봉투 열기
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {/* 프로필 */}
      {activeTab === 'profile' && session && (
        <main style={{ maxWidth: 860, margin: '0 auto', padding: '76px 24px 60px' }}>
          <div style={{ textAlign: 'center', paddingTop: 24, marginBottom: 36, paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
              <img src={session.user.user_metadata?.avatar_url} alt="" style={{ width: 84, height: 84, borderRadius: '50%', border: '3px solid rgba(99,102,241,.5)', boxShadow: '0 0 28px rgba(99,102,241,.3)' }} />
              <div style={{ position: 'absolute', bottom: 4, right: 4, width: 17, height: 17, borderRadius: '50%', background: '#10b981', border: '2px solid #0f0c29', boxShadow: '0 0 8px #10b981' }} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {session.user.user_metadata?.preferred_username || session.user.email}
            </h1>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>GitHub 인증 계정 · {session.user.email}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* ID 카드 */}
            <div style={{ ...S.glass, padding: 22 }}>
              <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#6366f1', textTransform: 'uppercase', marginBottom: 14 }}>내 통신 식별자</h3>
              <div style={{ background: 'rgba(0,0,0,.3)', borderRadius: 12, padding: 14, marginBottom: 14, border: '1px solid rgba(255,255,255,0.04)' }}>
                <p style={{ ...S.label, marginBottom: 6 }}>UUID · 전자봉투 수신 주소</p>
                <code style={{ fontSize: 10, fontFamily: 'monospace', color: '#a5b4fc', wordBreak: 'break-all', lineHeight: 1.9 }}>{session.user.id}</code>
              </div>
              <button onClick={handleCopyId} className="hover-lift" style={{ ...S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)'), marginBottom: 22 }}>
                {copyStatus === '복사됨!' ? '✓ 복사됨!' : '📋 ID 복사하기'}
              </button>
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', marginBottom: 18 }} />
              <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>계정 관리</h3>
              <button onClick={handleLogout}
                style={{ width: '100%', border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.07)', color: '#fca5a5', borderRadius: 12, padding: '11px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,.07)'}>
                로그아웃
              </button>
            </div>

            {/* 인증서 카드 */}
            <div style={{ ...S.glass, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#6366f1', textTransform: 'uppercase' }}>인증서 정보</h3>
                {userCert && (
                  <button onClick={handleDeleteCert}
                    style={{ border: '1px solid rgba(239,68,68,.3)', background: 'rgba(239,68,68,.07)', color: '#fca5a5', borderRadius: 8, padding: '4px 14px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
                    폐기/삭제
                  </button>
                )}
              </div>
              {userCert && certInfo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: '발급 대상 (Subject)', value: `CN=${certInfo.subject}` },
                    { label: '인증 기관 (Issuer)', value: certInfo.issuer },
                    { label: '유효 기간 (Not After)', value: certInfo.notAfter },
                  ].map(row => (
                    <div key={row.label} style={{ background: 'rgba(0,0,0,.22)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={S.label}>{row.label}</p>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{row.value}</p>
                    </div>
                  ))}
                  <div style={{ background: 'rgba(0,0,0,.22)', borderRadius: 10, padding: '10px 12px' }}>
                    <p style={S.label}>SHA-256 Fingerprint</p>
                    <code style={{ fontSize: 9, fontFamily: 'monospace', color: '#6366f1', lineHeight: 1.9, wordBreak: 'break-all' }}>{certInfo.fingerprint}</code>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '50px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
                  <p style={{ color: '#64748b', fontSize: 12 }}>발급된 인증서가 없습니다</p>
                  <p style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>대시보드에서 인증서를 발급하세요</p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '18px 32px', textAlign: 'center', marginTop: 16 }}>
        <p style={{ fontSize: 11, color: '#94a3b8' }}>© 92212764 김서진 · 보안프로토콜 과제</p>
      </footer>
    </div>
  );
}
