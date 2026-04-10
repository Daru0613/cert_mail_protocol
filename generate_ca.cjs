const forge = require('node-forge');
const fs = require('fs');

console.log('Generating Root CA...');
// RSA 키 쌍 생성
const keypair = forge.pki.rsa.generateKeyPair(2048);
const publicKey = keypair.publicKey;
const privateKey = keypair.privateKey;

// 인증서 생성
const cert = forge.pki.createCertificate();
cert.publicKey = publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 10); // 10년 유효

const attrs = [
  { name: 'commonName', value: 'Sovereign Root CA' },
  { name: 'countryName', value: 'KR' },
  { name: 'organizationName', value: 'Sovereign Security Vault' }
];

cert.setSubject(attrs);
cert.setIssuer(attrs);

cert.setExtensions([{
  name: 'basicConstraints',
  cA: true
}, {
  name: 'keyUsage',
  keyCertSign: true,
  digitalSignature: true,
  nonRepudiation: true,
  keyEncipherment: true,
  dataEncipherment: true
}]);

// 서명
cert.sign(privateKey);

const privateKeyPem = forge.pki.privateKeyToPem(privateKey);
const certPem = forge.pki.certificateToPem(cert);

// .env.local에 기록 (멀티라인 지원 방식으로 직접 작성)
const envPath = '.env.local';
let envLines = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8').split('\n') : [];

// 기존 키 제거
envLines = envLines.filter(line => !line.startsWith('ROOT_PRIVATE_KEY=') && !line.startsWith('ROOT_CERT_PEM='));

// 새로운 키 주입 (따옴표 없이 멀티라인으로 저장하되, NextJS dotenv 지원을 위해 \n 대신 실제 줄바꿈 사용)
// 주의: .env 파일에서 실제 줄바꿈을 쓰려면 값을 "..." 로 감싸야 합니다.
const privKeyEnv = `ROOT_PRIVATE_KEY="${privateKeyPem.trim()}"`;
const certPemEnv = `ROOT_CERT_PEM="${certPem.trim()}"`;

envLines.push(privKeyEnv);
envLines.push(certPemEnv);

fs.writeFileSync(envPath, envLines.join('\n'));
console.log('.env.local has been updated with multiline PEM keys.');
console.log('Please restart your dev server (npm run dev) now.');
