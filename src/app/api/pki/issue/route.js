import { NextResponse } from 'next/server';
import { issueUserCertificate } from '../../../../lib/crypto/forgeServer';

export async function POST(req) {
  try {
    const { publicKeyPem, username } = await req.json();
    if (!publicKeyPem) {
      return NextResponse.json({ error: 'No public key provided' }, { status: 400 });
    }
    
    const certPem = issueUserCertificate(publicKeyPem, username || 'Sovereign User');
    
    return NextResponse.json({ certPem });
  } catch (err) {
    console.error('Issue Cert Error:', err);
    return NextResponse.json({ error: err.message || '인증서 발급 중 서버 에러 발생' }, { status: 500 });
  }
}
