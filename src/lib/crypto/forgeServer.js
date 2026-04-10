import forge from 'node-forge';

/**
 * 환경 변수에서 ROOT 인증서 및 개인키 로드 (Lazy Initialize)
 */
let rootCaCert = null;
let rootCaKey = null;

function loadCaKeys() {
  if (rootCaCert && rootCaKey) return;
  
  // env에서 값을 가져오고 양끝 공백 및 따옴표 제거(수신자 미식별로 인한 조치..)
  let certPem = (process.env.ROOT_CERT_PEM || '').trim();
  let keyPem = (process.env.ROOT_PRIVATE_KEY || '').trim();

  // 따옴표로 감싸져 있는 경우 제거
  if (certPem.startsWith('"') && certPem.endsWith('"')) certPem = certPem.slice(1, -1);
  if (keyPem.startsWith('"') && keyPem.endsWith('"')) keyPem = keyPem.slice(1, -1);

  // \n 문자(문자열 형태)를 실제 줄바꿈으로 변환
  certPem = certPem.replace(/\\n/g, '\n');
  keyPem = keyPem.replace(/\\n/g, '\n');

  if (!certPem || !keyPem) {
    console.warn('인증서 또는 비밀번호가 로드되지않았을 수 있습니다.');
    return;
  }

  try {
    rootCaCert = forge.pki.certificateFromPem(certPem);
    rootCaKey = forge.pki.privateKeyFromPem(keyPem);
    console.log('Server CA Keys loaded successfully.');
  } catch (err) {
    console.error('원본 형식이 올바른 PEM인지 확인하세요: ', err);
  }
}

/**
 * 클라이언트 공개키에 CA 서명을 부여하여 인증서 발급
 * @param {string} userPublicKeyPem 사용자 공개키
 * @param {string} userSubjectName 사용자 표기명 (GitHub Username 등)
 * @returns {string} 발급된 인증서 PEM
 */
export function issueUserCertificate(userPublicKeyPem, userSubjectName) {
  loadCaKeys();
  if (!rootCaCert || !rootCaKey) throw new Error('CA 키셋팅에 문제가 생겼습니다.');

  const publicKey = forge.pki.publicKeyFromPem(userPublicKeyPem);
  const cert = forge.pki.createCertificate();
  
  cert.publicKey = publicKey;
  cert.serialNumber = Date.now().toString();
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  const attrs = [
    { name: 'commonName', value: userSubjectName },
    { name: 'countryName', value: 'KR' },
    { name: 'organizationName', value: 'Sovereign Protocol Web' }
  ];
  cert.setSubject(attrs);
  
  // Issuer를 내가 가진 루트 인증서의 Subject로 똑같이 세팅
  cert.setIssuer(rootCaCert.subject.attributes);
  
  cert.setExtensions([{
    name: 'basicConstraints',
    cA: false
  }, {
    name: 'keyUsage',
    keyCertSign: false,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
  }]);

  // Root 개인키로 서명
  cert.sign(rootCaKey);
  
  return forge.pki.certificateToPem(cert);
}

/**
 * 로그인 등을 위한 서명 유효성 검증
 * 서버는 사용자의 인증서가 유효한 우리 CA발급인지 확인한 후 -> 본문의 전자서명 확인
 * @param {string} message 서명 원문
 * @param {string} signatureHex 전자서명 (Hex)
 * @param {string} userCertPem 사용자 인증서
 * @returns {boolean} 검증 여부
 */
export function verifySignature(message, signatureHex, userCertPem) {
  loadCaKeys();
  if (!rootCaCert) throw new Error('Server Root CA is not initialized');

  let userCert;
  try {
    userCert = forge.pki.certificateFromPem(userCertPem);
  } catch(e) {
    throw new Error('Invalid user certificate PEM');
  }

  // 1. 유효성 검사
  const isCertsValid = rootCaCert.verify(userCert);
  if (!isCertsValid) {
    throw new Error('Untrusted Certificate Authority');
  }

  // 2. 인증서 유효기간 체크
  const now = new Date();
  if (now < userCert.validity.notBefore || now > userCert.validity.notAfter) {
    throw new Error('Certificate expired');
  }

  // 3. 서명 검증
  const publicKey = userCert.publicKey;
  const signatureBytes = forge.util.hexToBytes(signatureHex);
  const md = forge.md.sha1.create();
  md.update(message, 'utf8');

  return publicKey.verify(md.digest().bytes(), signatureBytes);
}
