module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/crypto/forgeServer.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "issueUserCertificate",
    ()=>issueUserCertificate,
    "verifySignature",
    ()=>verifySignature
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/node-forge/lib/index.js [app-route] (ecmascript)");
;
/**
 * 환경 변수에서 ROOT 인증서 및 개인키 로드 (Lazy Initialize)
 */ let rootCaCert = null;
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
        rootCaCert = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.certificateFromPem(certPem);
        rootCaKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.privateKeyFromPem(keyPem);
        console.log('Server CA Keys loaded successfully.');
    } catch (err) {
        console.error('원본 형식이 올바른 PEM인지 확인하세요: ', err);
    }
}
function issueUserCertificate(userPublicKeyPem, userSubjectName) {
    loadCaKeys();
    if (!rootCaCert || !rootCaKey) throw new Error('CA 키셋팅에 문제가 생겼습니다.');
    const publicKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.publicKeyFromPem(userPublicKeyPem);
    const cert = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.createCertificate();
    cert.publicKey = publicKey;
    cert.serialNumber = Date.now().toString();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    const attrs = [
        {
            name: 'commonName',
            value: userSubjectName
        },
        {
            name: 'countryName',
            value: 'KR'
        },
        {
            name: 'organizationName',
            value: 'Sovereign Protocol Web'
        }
    ];
    cert.setSubject(attrs);
    // Issuer를 내가 가진 루트 인증서의 Subject로 똑같이 세팅
    cert.setIssuer(rootCaCert.subject.attributes);
    cert.setExtensions([
        {
            name: 'basicConstraints',
            cA: false
        },
        {
            name: 'keyUsage',
            keyCertSign: false,
            digitalSignature: true,
            nonRepudiation: true,
            keyEncipherment: true,
            dataEncipherment: true
        }
    ]);
    // Root 개인키로 서명
    cert.sign(rootCaKey);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.certificateToPem(cert);
}
function verifySignature(message, signatureHex, userCertPem) {
    loadCaKeys();
    if (!rootCaCert) throw new Error('Server Root CA is not initialized');
    let userCert;
    try {
        userCert = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].pki.certificateFromPem(userCertPem);
    } catch (e) {
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
    const signatureBytes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].util.hexToBytes(signatureHex);
    const md = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$node$2d$forge$2f$lib$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].md.sha1.create();
    md.update(message, 'utf8');
    return publicKey.verify(md.digest().bytes(), signatureBytes);
}
}),
"[project]/src/app/api/pki/verify/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/crypto/forgeServer.js [app-route] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { userId, time, signature, userCertPem } = await req.json();
        if (!time || !signature || !userCertPem) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing parameters for verification'
            }, {
                status: 400
            });
        }
        const serverTime = Date.now();
        const clientTime = parseInt(time, 10);
        const timeDiffMs = Math.abs(serverTime - clientTime);
        if (timeDiffMs > 60000) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `서명 시간이 만료되었습니다. (Time diff: ${timeDiffMs}ms > 60000ms)`
            }, {
                status: 400
            });
        }
        //message는 userId + time 의 문자열 형태로
        const message = `${userId}_${time}`;
        const isValid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$crypto$2f$forgeServer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySignature"])(message, signature, userCertPem);
        if (!isValid) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: '서명이 유효하지 않습니다.'
            }, {
                status: 401
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: '사용자 전자서명 검증 (2FA) 완료'
        });
    } catch (err) {
        console.error('Verify Cert Error:', err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: err.message || '서명 검증 중 서버 에러 발생'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__11xasmt._.js.map