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

// .env.local에 기록
const envPath = '.env.local';
let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

// 멀티라인 문자열을 .env에 저장하기 위한 포맷
const escapedPrivKey = privateKeyPem.replace(/\n/g, '\\n');
const escapedCert = certPem.replace(/\n/g, '\\n');

if (!envContent.includes('ROOT_PRIVATE_KEY=')) {
  envContent += `\nROOT_PRIVATE_KEY="${escapedPrivKey}"\n`;
  envContent += `ROOT_CERT_PEM="${escapedCert}"\n`;
  fs.writeFileSync(envPath, envContent);
  console.log('.env.local updated with Root CA keys.');
} else {
  console.log('Root CA already exists in .env.local');
}
