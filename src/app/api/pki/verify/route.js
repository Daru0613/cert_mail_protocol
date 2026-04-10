import { NextResponse } from 'next/server';
import { verifySignature } from '../../../../lib/crypto/forgeServer';

export async function POST(req) {
  try {
    const { userId, time, signature, userCertPem } = await req.json();
    
    if (!time || !signature || !userCertPem) {
      return NextResponse.json({ error: 'Missing parameters for verification' }, { status: 400 });
    }

    const serverTime = Date.now();
    const clientTime = parseInt(time, 10);
    const timeDiffMs = Math.abs(serverTime - clientTime);
    
    if (timeDiffMs > 60000) {
      return NextResponse.json({ 
        error: `서명 시간이 만료되었습니다. (Time diff: ${timeDiffMs}ms > 60000ms)` 
      }, { status: 400 });
    }

    //message는 userId + time 의 문자열 형태로
    const message = `${userId}_${time}`;
    const isValid = verifySignature(message, signature, userCertPem);
    
    if (!isValid) {
      return NextResponse.json({ error: '서명이 유효하지 않습니다.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: '사용자 전자서명 검증 (2FA) 완료' });
  } catch (err) {
    console.error('Verify Cert Error:', err);
    return NextResponse.json({ error: err.message || '서명 검증 중 서버 에러 발생' }, { status: 500 });
  }
}
