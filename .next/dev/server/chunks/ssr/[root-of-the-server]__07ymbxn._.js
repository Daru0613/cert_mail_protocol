module.exports = [
"[project]/src/lib/supabaseClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://fqjwaopamwhxjmwopwip.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxandhb3BhbXdoeGptd29wd2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MTA5ODQsImV4cCI6MjA5MTM4Njk4NH0.vXyvinQp2ynzcPOzrsb0mAv3rPN5RqpO90JScorCzCg");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl || '', supabaseAnonKey || '');
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/crypto/forgeClient.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSecureEnvelope",
    ()=>createSecureEnvelope,
    "generateRSAKeyPair",
    ()=>generateRSAKeyPair,
    "loadPrivateKey",
    ()=>loadPrivateKey,
    "openSecureEnvelope",
    ()=>openSecureEnvelope,
    "savePrivateKey",
    ()=>savePrivateKey,
    "signMessage",
    ()=>signMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-forge/lib/index.js [app-ssr] (ecmascript)");
;
function generateRSAKeyPair(bits = 2048) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.rsa.generateKeyPair(bits);
}
function savePrivateKey(privateKey, password) {
    const encryptedPem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.encryptRsaPrivateKey(privateKey, password);
    // 인증서 시스템 특성상 개인키 보관은 LocalStorage를 사용
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return encryptedPem;
}
function loadPrivateKey(password) {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
    const encryptedPem = undefined;
}
function signMessage(message, privateKey) {
    const md = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].md.sha1.create();
    md.update(message, 'utf8');
    const signatureBytes = privateKey.sign(md);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.bytesToHex(signatureBytes);
}
function createSecureEnvelope(messageString, myPrivateKey, receiverPublicKeyPem) {
    // 5.1 메시지에 전자서명 생성
    const md = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].md.sha1.create();
    md.update(messageString, 'utf8');
    const signatureHex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.bytesToHex(myPrivateKey.sign(md));
    const messageObject = JSON.stringify({
        msg: messageString,
        sigHex: signatureHex
    });
    // 5.2 AES 세션키 발급 (16 bytes = 128 bit)
    const keySize = 16;
    const ivSize = 16;
    const key = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].random.getBytesSync(keySize);
    const iv = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].random.getBytesSync(ivSize);
    // 5.3 AES로 메시지+서명 암호화
    const someBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.encodeUtf8(messageObject);
    const cipher = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].cipher.createCipher('AES-CBC', key);
    cipher.start({
        iv: iv
    });
    cipher.update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.createBuffer(someBytes));
    cipher.finish();
    const encryptedMessageHex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.bytesToHex(cipher.output.getBytes());
    // 5.4 수신자의 공개키로 세션키 묶음(AES Key, IV) 암호화
    const receiverPublicKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.publicKeyFromPem(receiverPublicKeyPem);
    const keyObjectString = JSON.stringify({
        key,
        iv
    });
    const encryptedSessionKeyHex = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.bytesToHex(receiverPublicKey.encrypt(keyObjectString, 'RSA-OAEP'));
    return {
        encryptedMessageHex,
        encryptedSessionKeyHex
    };
}
function openSecureEnvelope(encryptedMessageHex, encryptedSessionKeyHex, myPrivateKey, senderPublicKeyPem) {
    // 6.1 내 개인키로 세션키 복구
    let decryptedSessionKeyString;
    try {
        const encryptedSessionKeyBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.hexToBytes(encryptedSessionKeyHex);
        decryptedSessionKeyString = myPrivateKey.decrypt(encryptedSessionKeyBytes, 'RSA-OAEP');
    } catch (err) {
        throw new Error('세션키 복호화 실패(본인의 암호문이 아님)');
    }
    const { key, iv } = JSON.parse(decryptedSessionKeyString);
    // 6.2 복구된 세션키로 메시지 복호화
    const encryptedMessageBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.hexToBytes(encryptedMessageHex);
    const decipher = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].cipher.createDecipher('AES-CBC', key);
    decipher.start({
        iv: iv
    });
    decipher.update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.createBuffer(encryptedMessageBytes));
    const success = decipher.finish();
    if (!success) {
        throw new Error('메시지 데이터 복호화 실패');
    }
    const messageObjectString = decipher.output.getBytes();
    const decodedString = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.decodeUtf8(messageObjectString);
    const { msg, sigHex } = JSON.parse(decodedString);
    // 6.3 송신자 공개키로 서명 검증
    const senderPublicKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.publicKeyFromPem(senderPublicKeyPem);
    const signatureBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].util.hexToBytes(sigHex);
    const md = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].md.sha1.create();
    md.update(msg, 'utf8');
    const verified = senderPublicKey.verify(md.digest().bytes(), signatureBytes);
    return {
        verified,
        originalMessage: msg
    };
}
}),
"[project]/src/app/page.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Page
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabaseClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/crypto/forgeClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-forge/lib/index.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Page() {
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('dashboard');
    // PKI 상태
    const [userCert, setUserCert] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isSecureAuthenticated, setIsSecureAuthenticated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [certInfo, setCertInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // UI 상태
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [certPassword, setCertPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loginPassword, setLoginPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [draftMessage, setDraftMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [receiverIdStr, setReceiverIdStr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [openedMsg, setOpenedMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [copyStatus, setCopyStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('복사');
    // 1. 세션 초기화
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then(({ data: { session } })=>{
            setSession(session);
            if (session) fetchCertAndMessages(session.user.id);
        });
        const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((_event, session)=>{
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
        return ()=>subscription.unsubscribe();
    }, []);
    // 2. 초기 데이터 불러오기
    const fetchCertAndMessages = async (userId)=>{
        const { data: certData, error: certError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_pki_certs').select('*').eq('id', userId).single();
        if (certError) console.log('Cert Fetch Info:', certError.message);
        if (certData) {
            setUserCert(certData);
            try {
                const cert = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.certificateFromPem(certData.cert_pem);
                const fingerprint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].md.sha256.create().update(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].asn1.toDer(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.certificateToAsn1(cert)).getBytes()).digest().toHex();
                setCertInfo({
                    subject: cert.subject.getField('CN')?.value,
                    issuer: cert.issuer.getField('CN')?.value,
                    notAfter: cert.validity.notAfter.toLocaleDateString(),
                    fingerprint: fingerprint.match(/.{1,2}/g).join(':').toUpperCase()
                });
            } catch (e) {
                console.error('Cert Analysis Error:', e);
            }
        } else {
            setUserCert(null);
            setCertInfo(null);
        }
        const { data: msgData, error: msgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('secure_envelopes').select('*').or(`receiver_id.eq.${userId},sender_id.eq.${userId}`).order('created_at', {
            ascending: false
        });
        if (msgError) console.error('Message Fetch Error:', msgError.message);
        if (msgData) {
            console.log('Fetched Messages Count:', msgData.length);
            setMessages(msgData);
        }
    };
    const handleDeleteCert = async ()=>{
        if (!confirm("정말로 인증서를 삭제하시겠습니까? 삭제 후에는 기존에 받은 보안 메시지를 열람할 수 없게 됩니다.")) return;
        setLoading(true);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_pki_certs').delete().eq('id', session.user.id);
            if (error) throw new Error(error.message);
            alert("인증서가 삭제되었습니다.");
            setUserCert(null);
            setCertInfo(null);
            setIsSecureAuthenticated(false);
            localStorage.removeItem('pki_private_key');
        } catch (err) {
            alert("인증서 삭제 실패: " + err.message);
        } finally{
            setLoading(false);
        }
    };
    const handleGithubLogin = async ()=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithOAuth({
            provider: 'github'
        });
        if (error) console.error('Error logging in:', error.message);
    };
    const handleLogout = async ()=>{
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        if (error) console.error('Error logging out:', error.message);
    };
    const handleCopyId = ()=>{
        if (session) {
            navigator.clipboard.writeText(session.user.id);
            setCopyStatus('복사됨!');
            setTimeout(()=>setCopyStatus('복사'), 2000);
        }
    };
    const handleIssueCert = async ()=>{
        if (!certPassword) return alert("개인키 보호를 위한 비밀번호를 입력해주세요.");
        setLoading(true);
        try {
            const keypair = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateRSAKeyPair"])(2048);
            const publicPem = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].pki.publicKeyToPem(keypair.publicKey);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["savePrivateKey"])(keypair.privateKey, certPassword);
            const res = await fetch('/api/pki/issue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    publicKeyPem: publicPem,
                    username: session.user.user_metadata?.preferred_username || session.user.email
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            const { error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_pki_certs').upsert({
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
        } finally{
            setLoading(false);
        }
    };
    const handleSecureLogin = async ()=>{
        if (!loginPassword) return alert("개인키 비밀번호를 입력하세요.");
        setLoading(true);
        try {
            const privateKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadPrivateKey"])(loginPassword);
            const time = Date.now().toString();
            const messageToSign = `${session.user.id}_${time}`;
            const signatureHex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signMessage"])(messageToSign, privateKey);
            const res = await fetch('/api/pki/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    time,
                    signature: signatureHex,
                    userCertPem: userCert.cert_pem
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            alert("전자서명 인증 성공! 보안 세션이 열렸습니다.");
            setIsSecureAuthenticated(true);
            setLoginPassword('');
        } catch (err) {
            alert("인증 실패: " + err.message);
        } finally{
            setLoading(false);
        }
    };
    const handleSendEnvelope = async ()=>{
        const trimmedReceiverId = receiverIdStr.trim();
        if (!trimmedReceiverId || !draftMessage) return alert("수신자 ID와 메시지를 입력하세요.");
        setLoading(true);
        try {
            const privateKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadPrivateKey"])(prompt("서명 및 송신을 위해 개인키 비밀번호를 입력해주세요:"));
            const { data: receiverCert } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_pki_certs').select('public_key').eq('id', trimmedReceiverId).single();
            if (!receiverCert) throw new Error("수신자의 공개키를 찾을 수 없습니다.");
            const { encryptedMessageHex, encryptedSessionKeyHex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSecureEnvelope"])(draftMessage, privateKey, receiverCert.public_key);
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('secure_envelopes').insert({
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
        } finally{
            setLoading(false);
        }
    };
    const handleDeleteMessage = async (msgId)=>{
        if (!confirm("이 보안 메시지를 삭제하시겠습니까?")) return;
        setLoading(true);
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('secure_envelopes').delete().eq('id', msgId);
            if (error) throw new Error(error.message);
            setMessages((prev)=>prev.filter((m)=>m.id !== msgId));
            if (openedMsg?.id === msgId) setOpenedMsg(null);
        } catch (err) {
            alert("삭제 실패: " + err.message);
        } finally{
            setLoading(false);
        }
    };
    const handleReadEnvelope = async (msg)=>{
        try {
            const privateKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadPrivateKey"])(prompt("메시지 열람을 위해 개인키 비밀번호를 입력해주세요:"));
            const { data: senderCert } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabaseClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_pki_certs').select('public_key').eq('id', msg.sender_id).single();
            if (!senderCert) throw new Error("송신자의 공개키를 가져오지 못해 무결성을 검증할 수 없습니다.");
            const { verified, originalMessage } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["openSecureEnvelope"])(msg.encrypted_message_hex, msg.encrypted_session_key_hex, privateKey, senderCert.public_key);
            setOpenedMsg({
                id: msg.id,
                content: originalMessage,
                verified
            });
        } catch (err) {
            alert("메시지 열람 실패: " + err.message);
        }
    };
    // 스타일
    const S = {
        page: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg,#0f0c29 0%,#1c1b3a 50%,#0f0c29 100%)',
            fontFamily: "'Inter',system-ui,sans-serif",
            color: '#f8fafc'
        },
        glass: {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 20
        },
        glassBright: {
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(20px)',
            borderRadius: 14
        },
        inp: {
            width: '100%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '11px 14px',
            color: '#e2e8f0',
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box'
        },
        btn: (color)=>({
                background: color,
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 12,
                padding: '12px 0',
                width: '100%',
                transition: 'all .2s'
            }),
        label: {
            fontSize: 9,
            color: '#94a3b8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 4
        },
        stepNum: (done, color)=>({
                width: 28,
                height: 28,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
                background: done ? 'rgba(99,102,241,.15)' : color,
                color: '#fff'
            })
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: S.page,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;}
        input::placeholder,textarea::placeholder{color:#475569;}
        input:focus,textarea:focus{border-color:#6366f1!important;outline:none;}
        textarea{font-family:inherit;resize:none;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-thumb{background:#334155;border-radius:3px;}
        .hover-lift:hover:not(:disabled){transform:translateY(-1px);opacity:.88;}
        button:disabled{opacity:.4;cursor:not-allowed;}
      `
            }, void 0, false, {
                fileName: "[project]/src/app/page.jsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                style: {
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 50,
                    background: 'rgba(15,12,41,0.75)',
                    backdropFilter: 'blur(24px)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 32px',
                    height: 60
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    width: 34,
                                    height: 34,
                                    borderRadius: 10,
                                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 17
                                },
                                children: "🔐"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 278,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    fontWeight: 800,
                                    fontSize: 15,
                                    letterSpacing: '-0.3px'
                                },
                                children: "보안프로토콜"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            gap: 4,
                            background: 'rgba(255,255,255,0.04)',
                            padding: 4,
                            borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.08)'
                        },
                        children: [
                            [
                                'dashboard',
                                '대시보드'
                            ],
                            [
                                'profile',
                                '내 정보'
                            ]
                        ].map(([tab, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab),
                                className: "hover-lift",
                                style: {
                                    padding: '6px 18px',
                                    borderRadius: 9,
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    fontWeight: 600,
                                    transition: 'all .2s',
                                    background: activeTab === tab ? 'rgba(99,102,241,0.8)' : 'transparent',
                                    color: activeTab === tab ? '#fff' : '#64748b'
                                },
                                children: label
                            }, tab, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 282,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12
                        },
                        children: [
                            session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: 7,
                                            height: 7,
                                            borderRadius: '50%',
                                            background: isSecureAuthenticated ? '#10b981' : '#f59e0b',
                                            boxShadow: isSecureAuthenticated ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: 10,
                                            fontWeight: 700,
                                            color: '#64748b',
                                            letterSpacing: '0.05em'
                                        },
                                        children: isSecureAuthenticated ? 'SECURE' : 'STANDARD'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this),
                            session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: session.user.user_metadata?.avatar_url,
                                alt: "",
                                style: {
                                    width: 30,
                                    height: 30,
                                    borderRadius: '50%',
                                    border: '2px solid rgba(99,102,241,.4)'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 298,
                                columnNumber: 23
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 291,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.jsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            activeTab === 'dashboard' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: 1100,
                    margin: '0 auto',
                    padding: '76px 24px 60px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: 32,
                            paddingTop: 16
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: '0.15em',
                                    color: '#6366f1',
                                    marginBottom: 8,
                                    textTransform: 'uppercase'
                                },
                                children: "인증서 · 전자봉투"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: 30,
                                    fontWeight: 800,
                                    letterSpacing: '-0.5px',
                                    background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                },
                                children: "인증서 및 전자봉투 기반 보안 통신 웹 어플리케이션"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 307,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this),
                    !session ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '80px 20px',
                            borderRadius: 24,
                            border: '2px dashed rgba(255,255,255,0.07)',
                            background: 'rgba(255,255,255,0.02)',
                            gap: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: 52
                                },
                                children: "🔒"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 312,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                style: {
                                    fontSize: 20,
                                    fontWeight: 700
                                },
                                children: "로그인이 필요합니다"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 313,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    color: '#cbd5e1',
                                    fontSize: 13
                                },
                                children: "GitHub 계정으로 시작하세요"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleGithubLogin,
                                className: "hover-lift",
                                style: {
                                    ...S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)'),
                                    width: 'auto',
                                    padding: '12px 36px',
                                    fontSize: 14
                                },
                                children: "GitHub으로 계속하기"
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 315,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 311,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 14
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...S.glass,
                                            padding: 22,
                                            opacity: userCert ? 0.55 : 1,
                                            transition: 'opacity .3s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: 14
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 12
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: S.stepNum(!!userCert, 'linear-gradient(135deg,#6366f1,#8b5cf6)'),
                                                                children: userCert ? '✓' : '1'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 327,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                        style: {
                                                                            fontSize: 14,
                                                                            fontWeight: 700,
                                                                            marginBottom: 1
                                                                        },
                                                                        children: "인증서 발급 기능"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.jsx",
                                                                        lineNumber: 329,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: 10,
                                                                            color: '#94a3b8'
                                                                        },
                                                                        children: "Certificate Issuance"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.jsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 328,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 326,
                                                        columnNumber: 21
                                                    }, this),
                                                    userCert && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            background: 'rgba(99,102,241,.15)',
                                                            color: '#a5b4fc',
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            padding: '3px 9px',
                                                            borderRadius: 999,
                                                            border: '1px solid rgba(99,102,241,.3)'
                                                        },
                                                        children: "완료"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 333,
                                                        columnNumber: 34
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 325,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 12,
                                                    color: '#94a3b8',
                                                    lineHeight: 1.7,
                                                    marginBottom: 14
                                                },
                                                children: "클라이언트가 키쌍 생성, 인증서 발급 신청을 하고 서버가 인증서를 발급하여 DB에 저장하고 클라이언트에게 전송하는 기능"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 335,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                placeholder: "개인키 보호 비밀번호",
                                                value: certPassword,
                                                onChange: (e)=>setCertPassword(e.target.value),
                                                style: {
                                                    ...S.inp,
                                                    marginBottom: 10
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 336,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: loading || !!userCert,
                                                onClick: handleIssueCert,
                                                className: "hover-lift",
                                                style: S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)'),
                                                children: loading ? '처리 중...' : userCert ? '인증서 발급 완료됨' : '인증서 발급 신청'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 337,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 324,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...S.glass,
                                            padding: 22,
                                            opacity: !userCert ? 0.3 : isSecureAuthenticated ? 0.55 : 1,
                                            pointerEvents: !userCert ? 'none' : 'auto',
                                            transition: 'opacity .3s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    marginBottom: 14
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 12
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: S.stepNum(isSecureAuthenticated, 'linear-gradient(135deg,#059669,#10b981)'),
                                                                children: isSecureAuthenticated ? '✓' : '2'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 346,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                        style: {
                                                                            fontSize: 14,
                                                                            fontWeight: 700,
                                                                            marginBottom: 1
                                                                        },
                                                                        children: "전자서명 로그인"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.jsx",
                                                                        lineNumber: 348,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        style: {
                                                                            fontSize: 10,
                                                                            color: '#94a3b8'
                                                                        },
                                                                        children: "Digital Signature Auth"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/page.jsx",
                                                                        lineNumber: 349,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 347,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 345,
                                                        columnNumber: 21
                                                    }, this),
                                                    isSecureAuthenticated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            background: 'rgba(16,185,129,.12)',
                                                            color: '#6ee7b7',
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            padding: '3px 9px',
                                                            borderRadius: 999,
                                                            border: '1px solid rgba(16,185,129,.25)'
                                                        },
                                                        children: "인증됨"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 352,
                                                        columnNumber: 47
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 344,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 12,
                                                    color: '#94a3b8',
                                                    lineHeight: 1.7,
                                                    marginBottom: 14
                                                },
                                                children: "발급된 인증서에 해당되는 개인키를 이용하여 전자서명을 전송하고 이것으로 서버에 로그인 하는 기능"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 354,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "password",
                                                placeholder: "개인키 비밀번호",
                                                value: loginPassword,
                                                onChange: (e)=>setLoginPassword(e.target.value),
                                                style: {
                                                    ...S.inp,
                                                    marginBottom: 10
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 355,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: loading || !userCert || isSecureAuthenticated,
                                                onClick: handleSecureLogin,
                                                className: "hover-lift",
                                                style: S.btn('linear-gradient(135deg,#059669,#10b981)'),
                                                children: isSecureAuthenticated ? '전자서명 인증 완료' : '서명 전송 및 로그인'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 356,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 343,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            ...S.glass,
                                            padding: 22,
                                            opacity: !isSecureAuthenticated ? 0.3 : 1,
                                            pointerEvents: !isSecureAuthenticated ? 'none' : 'auto',
                                            transition: 'opacity .3s'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 12,
                                                    marginBottom: 14
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: S.stepNum(false, 'linear-gradient(135deg,#7c3aed,#a855f7)'),
                                                        children: "3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 364,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                style: {
                                                                    fontSize: 14,
                                                                    fontWeight: 700,
                                                                    marginBottom: 1
                                                                },
                                                                children: "전자봉투 기반 보안통신"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 366,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                style: {
                                                                    fontSize: 10,
                                                                    color: '#94a3b8'
                                                                },
                                                                children: "E2E Encrypted Envelope"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/page.jsx",
                                                                lineNumber: 367,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 365,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 363,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    fontSize: 12,
                                                    color: '#94a3b8',
                                                    lineHeight: 1.7,
                                                    marginBottom: 14
                                                },
                                                children: "송신자와 수신자가 모두 인증서를 발급받은 상태인 경우, 송신자가 서명하고 수신자의 공개키로 암호화된 전자봉투 메시지를 전송하는 기능"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 370,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "수신자 UUID",
                                                value: receiverIdStr,
                                                onChange: (e)=>setReceiverIdStr(e.target.value),
                                                style: {
                                                    ...S.inp,
                                                    fontFamily: 'monospace',
                                                    fontSize: 11,
                                                    marginBottom: 10
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 371,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                placeholder: "메시지 내용...",
                                                value: draftMessage,
                                                onChange: (e)=>setDraftMessage(e.target.value),
                                                style: {
                                                    ...S.inp,
                                                    height: 80,
                                                    marginBottom: 10
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 372,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                disabled: loading || !isSecureAuthenticated,
                                                onClick: handleSendEnvelope,
                                                className: "hover-lift",
                                                style: S.btn('linear-gradient(135deg,#7c3aed,#a855f7)'),
                                                children: "🔒 전자봉투 전송"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 373,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 362,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 322,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...S.glass,
                                    padding: 22,
                                    alignSelf: 'start',
                                    minHeight: 400
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 18
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        style: {
                                                            fontSize: 14,
                                                            fontWeight: 700
                                                        },
                                                        children: "보안 수신함"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 383,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            fontSize: 10,
                                                            color: '#94a3b8',
                                                            marginTop: 2
                                                        },
                                                        children: "Secure Envelope Inbox"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 384,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 382,
                                                columnNumber: 19
                                            }, this),
                                            messages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                style: {
                                                    background: 'rgba(99,102,241,.2)',
                                                    color: '#a5b4fc',
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: '2px 12px',
                                                    borderRadius: 999,
                                                    border: '1px solid rgba(99,102,241,.25)'
                                                },
                                                children: messages.length
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 387,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '60px 0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 40,
                                                    marginBottom: 10
                                                },
                                                children: "📭"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 392,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#64748b',
                                                    fontSize: 12
                                                },
                                                children: "수신된 전자봉투가 없습니다"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 393,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 391,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 10
                                        },
                                        children: messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: S.glassBright,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: '12px 14px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-start',
                                                                marginBottom: 8
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                fontSize: 9,
                                                                                color: msg.sender_id === session.user.id ? '#a5b4fc' : '#10b981',
                                                                                fontWeight: 700,
                                                                                textTransform: 'uppercase',
                                                                                letterSpacing: '0.05em'
                                                                            },
                                                                            children: msg.sender_id === session.user.id ? '📤 발신' : '📥 수신'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.jsx",
                                                                            lineNumber: 402,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            style: {
                                                                                fontSize: 10,
                                                                                fontFamily: 'monospace',
                                                                                color: '#64748b',
                                                                                marginTop: 2,
                                                                                maxWidth: 180,
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis',
                                                                                whiteSpace: 'nowrap'
                                                                            },
                                                                            children: msg.sender_id
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.jsx",
                                                                            lineNumber: 405,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.jsx",
                                                                    lineNumber: 401,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    style: {
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 8
                                                                    },
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            style: {
                                                                                fontSize: 9,
                                                                                color: '#334155'
                                                                            },
                                                                            children: new Date(msg.created_at).toLocaleTimeString()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.jsx",
                                                                            lineNumber: 408,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDeleteMessage(msg.id),
                                                                            style: {
                                                                                border: 'none',
                                                                                background: 'none',
                                                                                cursor: 'pointer',
                                                                                color: '#475569',
                                                                                fontSize: 14,
                                                                                lineHeight: 1,
                                                                                padding: '2px 4px',
                                                                                borderRadius: 6,
                                                                                transition: 'color .15s'
                                                                            },
                                                                            onMouseOver: (e)=>e.currentTarget.style.color = '#ef4444',
                                                                            onMouseOut: (e)=>e.currentTarget.style.color = '#475569',
                                                                            children: "✕"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/page.jsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/page.jsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.jsx",
                                                            lineNumber: 400,
                                                            columnNumber: 27
                                                        }, this),
                                                        openedMsg?.id === msg.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                background: 'rgba(0,0,0,.3)',
                                                                borderRadius: 10,
                                                                padding: '10px 12px',
                                                                marginTop: 4
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: 9,
                                                                        fontWeight: 700,
                                                                        letterSpacing: '0.05em',
                                                                        color: openedMsg.verified ? '#10b981' : '#ef4444'
                                                                    },
                                                                    children: openedMsg.verified ? '✓ 무결성 검증 완료' : '✗ 변조 의심'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.jsx",
                                                                    lineNumber: 417,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    style: {
                                                                        fontSize: 13,
                                                                        marginTop: 6,
                                                                        color: '#cbd5e1',
                                                                        lineHeight: 1.6
                                                                    },
                                                                    children: openedMsg.content
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/page.jsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/page.jsx",
                                                            lineNumber: 416,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleReadEnvelope(msg),
                                                            className: "hover-lift",
                                                            style: {
                                                                border: '1px solid rgba(99,102,241,.3)',
                                                                background: 'rgba(99,102,241,.1)',
                                                                color: '#a5b4fc',
                                                                borderRadius: 8,
                                                                padding: '5px 14px',
                                                                fontSize: 11,
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                                marginTop: 4,
                                                                transition: 'all .2s'
                                                            },
                                                            children: "🔓 전자봉투 열기"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.jsx",
                                                            lineNumber: 423,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/page.jsx",
                                                    lineNumber: 399,
                                                    columnNumber: 25
                                                }, this)
                                            }, msg.id, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 398,
                                                columnNumber: 23
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 396,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 380,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 320,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.jsx",
                lineNumber: 304,
                columnNumber: 9
            }, this),
            activeTab === 'profile' && session && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                style: {
                    maxWidth: 860,
                    margin: '0 auto',
                    padding: '76px 24px 60px'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: 'center',
                            paddingTop: 24,
                            marginBottom: 36,
                            paddingBottom: 36,
                            borderBottom: '1px solid rgba(255,255,255,0.06)'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative',
                                    display: 'inline-block',
                                    marginBottom: 14
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: session.user.user_metadata?.avatar_url,
                                        alt: "",
                                        style: {
                                            width: 84,
                                            height: 84,
                                            borderRadius: '50%',
                                            border: '3px solid rgba(99,102,241,.5)',
                                            boxShadow: '0 0 28px rgba(99,102,241,.3)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 444,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            bottom: 4,
                                            right: 4,
                                            width: 17,
                                            height: 17,
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            border: '2px solid #0f0c29',
                                            boxShadow: '0 0 8px #10b981'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 443,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: 22,
                                    fontWeight: 800,
                                    marginBottom: 4,
                                    background: 'linear-gradient(135deg,#e2e8f0,#94a3b8)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                },
                                children: session.user.user_metadata?.preferred_username || session.user.email
                            }, void 0, false, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 447,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: 12,
                                    color: '#94a3b8'
                                },
                                children: [
                                    "GitHub 인증 계정 · ",
                                    session.user.email
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 450,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 442,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: 18
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...S.glass,
                                    padding: 22
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: '0.12em',
                                            color: '#6366f1',
                                            textTransform: 'uppercase',
                                            marginBottom: 14
                                        },
                                        children: "내 통신 식별자"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: 'rgba(0,0,0,.3)',
                                            borderRadius: 12,
                                            padding: 14,
                                            marginBottom: 14,
                                            border: '1px solid rgba(255,255,255,0.04)'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    ...S.label,
                                                    marginBottom: 6
                                                },
                                                children: "UUID · 전자봉투 수신 주소"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 458,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                style: {
                                                    fontSize: 10,
                                                    fontFamily: 'monospace',
                                                    color: '#a5b4fc',
                                                    wordBreak: 'break-all',
                                                    lineHeight: 1.9
                                                },
                                                children: session.user.id
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 459,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleCopyId,
                                        className: "hover-lift",
                                        style: {
                                            ...S.btn('linear-gradient(135deg,#6366f1,#8b5cf6)'),
                                            marginBottom: 22
                                        },
                                        children: copyStatus === '복사됨!' ? '✓ 복사됨!' : '📋 ID 복사하기'
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: 1,
                                            background: 'rgba(255,255,255,0.05)',
                                            marginBottom: 18
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 464,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        style: {
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: '0.12em',
                                            color: '#94a3b8',
                                            textTransform: 'uppercase',
                                            marginBottom: 12
                                        },
                                        children: "계정 관리"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLogout,
                                        style: {
                                            width: '100%',
                                            border: '1px solid rgba(239,68,68,.3)',
                                            background: 'rgba(239,68,68,.07)',
                                            color: '#fca5a5',
                                            borderRadius: 12,
                                            padding: '11px 0',
                                            fontSize: 13,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'background .2s'
                                        },
                                        onMouseOver: (e)=>e.currentTarget.style.background = 'rgba(239,68,68,.15)',
                                        onMouseOut: (e)=>e.currentTarget.style.background = 'rgba(239,68,68,.07)',
                                        children: "로그아웃"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 466,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 455,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    ...S.glass,
                                    padding: 22
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 14
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                style: {
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    letterSpacing: '0.12em',
                                                    color: '#6366f1',
                                                    textTransform: 'uppercase'
                                                },
                                                children: "인증서 정보"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 477,
                                                columnNumber: 17
                                            }, this),
                                            userCert && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDeleteCert,
                                                style: {
                                                    border: '1px solid rgba(239,68,68,.3)',
                                                    background: 'rgba(239,68,68,.07)',
                                                    color: '#fca5a5',
                                                    borderRadius: 8,
                                                    padding: '4px 14px',
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    cursor: 'pointer'
                                                },
                                                children: "폐기/삭제"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 479,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 476,
                                        columnNumber: 15
                                    }, this),
                                    userCert && certInfo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 12
                                        },
                                        children: [
                                            [
                                                {
                                                    label: '발급 대상 (Subject)',
                                                    value: `CN=${certInfo.subject}`
                                                },
                                                {
                                                    label: '인증 기관 (Issuer)',
                                                    value: certInfo.issuer
                                                },
                                                {
                                                    label: '유효 기간 (Not After)',
                                                    value: certInfo.notAfter
                                                }
                                            ].map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        background: 'rgba(0,0,0,.22)',
                                                        borderRadius: 10,
                                                        padding: '10px 12px'
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: S.label,
                                                            children: row.label
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.jsx",
                                                            lineNumber: 493,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            style: {
                                                                fontSize: 12,
                                                                fontWeight: 600,
                                                                color: '#cbd5e1'
                                                            },
                                                            children: row.value
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/page.jsx",
                                                            lineNumber: 494,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, row.label, true, {
                                                    fileName: "[project]/src/app/page.jsx",
                                                    lineNumber: 492,
                                                    columnNumber: 21
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    background: 'rgba(0,0,0,.22)',
                                                    borderRadius: 10,
                                                    padding: '10px 12px'
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        style: S.label,
                                                        children: "SHA-256 Fingerprint"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 498,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                        style: {
                                                            fontSize: 9,
                                                            fontFamily: 'monospace',
                                                            color: '#6366f1',
                                                            lineHeight: 1.9,
                                                            wordBreak: 'break-all'
                                                        },
                                                        children: certInfo.fingerprint
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/page.jsx",
                                                        lineNumber: 499,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 497,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 486,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            padding: '50px 0',
                                            textAlign: 'center'
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: 36,
                                                    marginBottom: 10
                                                },
                                                children: "📄"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 504,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#64748b',
                                                    fontSize: 12
                                                },
                                                children: "발급된 인증서가 없습니다"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 505,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    color: '#475569',
                                                    fontSize: 11,
                                                    marginTop: 4
                                                },
                                                children: "대시보드에서 인증서를 발급하세요"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/page.jsx",
                                                lineNumber: 506,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/page.jsx",
                                        lineNumber: 503,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/page.jsx",
                                lineNumber: 475,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/page.jsx",
                        lineNumber: 453,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/page.jsx",
                lineNumber: 441,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                style: {
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    padding: '18px 32px',
                    textAlign: 'center',
                    marginTop: 16
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: 11,
                        color: '#94a3b8'
                    },
                    children: "© 92212764 김서진 · 보안프로토콜 과제"
                }, void 0, false, {
                    fileName: "[project]/src/app/page.jsx",
                    lineNumber: 515,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/page.jsx",
                lineNumber: 514,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.jsx",
        lineNumber: 263,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__07ymbxn._.js.map