import forge from 'node-forge';
/**
 * 1. RSA 키 쌍 생성 (클라이언트 전용)
 */
export function generateRSAKeyPair(bits = 2048) {
  return forge.pki.rsa.generateKeyPair(bits);
}

/**
 * 2. 개인키 패스워드 바탕 암호화 및 로컬 스토리지 저장
 */
export function savePrivateKey(privateKey, password) {
  const encryptedPem = forge.pki.encryptRsaPrivateKey(privateKey, password);
  // 인증서 시스템 특성상 개인키 보관은 LocalStorage를 사용
  if (typeof window !== 'undefined') {
    localStorage.setItem('encryptedPrivateKey', encryptedPem);
  }
  return encryptedPem;
}

/**
 * 3. 로컬 스토리지에서 패스워드 확인 및 복호화
 */
export function loadPrivateKey(password) {
  if (typeof window === 'undefined') return null;
  const encryptedPem = localStorage.getItem('encryptedPrivateKey');
  if (!encryptedPem) throw new Error('저장된 개인키를 찾을 수 없습니다.');
  
  try {
    const rawPrivateKey = forge.pki.decryptRsaPrivateKey(encryptedPem, password);
    if (!rawPrivateKey) throw new Error('비밀번호가 일치하지 않습니다.');
    return rawPrivateKey;
  } catch (err) {
    throw new Error('비밀번호가 일치하지 않거나 복호화에 실패했습니다.');
  }
}

/**
 * 4. 개인키로 메시지 전자서명 (서명 로그인 등 활용)
 */
export function signMessage(message, privateKey) {
  const md = forge.md.sha1.create();
  md.update(message, 'utf8');
  const signatureBytes = privateKey.sign(md);
  return forge.util.bytesToHex(signatureBytes);
}

/**
 * 5. 전자봉투 암호화 (송신자 A가 수신자 B에게)
 */
export function createSecureEnvelope(messageString, myPrivateKey, receiverPublicKeyPem) {
  // 5.1 메시지에 전자서명 생성
  const md = forge.md.sha1.create();
  md.update(messageString, 'utf8');
  const signatureHex = forge.util.bytesToHex(myPrivateKey.sign(md));

  const messageObject = JSON.stringify({
    msg: messageString,
    sigHex: signatureHex
  });

  // 5.2 AES 세션키 발급 (16 bytes = 128 bit)
  const keySize = 16;
  const ivSize = 16;
  const key = forge.random.getBytesSync(keySize);
  const iv = forge.random.getBytesSync(ivSize);

  // 5.3 AES로 메시지+서명 암호화
  const someBytes = forge.util.encodeUtf8(messageObject);
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(someBytes));
  cipher.finish();
  const encryptedMessageHex = forge.util.bytesToHex(cipher.output.getBytes());

  // 5.4 수신자의 공개키로 세션키 묶음(AES Key, IV) 암호화
  const receiverPublicKey = forge.pki.publicKeyFromPem(receiverPublicKeyPem);
  const keyObjectString = JSON.stringify({ key, iv });
  const encryptedSessionKeyHex = forge.util.bytesToHex(
    receiverPublicKey.encrypt(keyObjectString, 'RSA-OAEP')
  );

  return { encryptedMessageHex, encryptedSessionKeyHex };
}

/**
 * 6. 전자봉투 복호화 (수신자 B)
 */
export function openSecureEnvelope(encryptedMessageHex, encryptedSessionKeyHex, myPrivateKey, senderPublicKeyPem) {
  // 6.1 내 개인키로 세션키 복구
  let decryptedSessionKeyString;
  try {
    const encryptedSessionKeyBytes = forge.util.hexToBytes(encryptedSessionKeyHex);
    decryptedSessionKeyString = myPrivateKey.decrypt(encryptedSessionKeyBytes, 'RSA-OAEP');
  } catch (err) {
    throw new Error('세션키 복호화 실패(본인의 암호문이 아님)');
  }
  
  const { key, iv } = JSON.parse(decryptedSessionKeyString);

  // 6.2 복구된 세션키로 메시지 복호화
  const encryptedMessageBytes = forge.util.hexToBytes(encryptedMessageHex);
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(encryptedMessageBytes));
  const success = decipher.finish();
  
  if (!success) {
    throw new Error('메시지 데이터 복호화 실패');
  }

  const messageObjectString = decipher.output.getBytes();
  const decodedString = forge.util.decodeUtf8(messageObjectString);
  const { msg, sigHex } = JSON.parse(decodedString);

  // 6.3 송신자 공개키로 서명 검증
  const senderPublicKey = forge.pki.publicKeyFromPem(senderPublicKeyPem);
  const signatureBytes = forge.util.hexToBytes(sigHex);
  
  const md = forge.md.sha1.create();
  md.update(msg, 'utf8');
  const verified = senderPublicKey.verify(md.digest().bytes(), signatureBytes);

  return {
    verified,
    originalMessage: msg
  };
}
