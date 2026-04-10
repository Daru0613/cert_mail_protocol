-- Supabase PKI Tables SQL Schema Configuration

-- 1. 사용자 인증서 저장 테이블
create table public.user_pki_certs (
  id uuid references auth.users on delete cascade not null primary key,
  cert_pem text not null,
  public_key text not null,
  created_at timestamp with time zone default now()
);

-- 2. 전자봉투(암호화된 보안 메시지) 저장 테이블
create table public.secure_envelopes (
  id uuid default gen_random_uuid() primary key,
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete cascade not null,
  encrypted_message_hex text not null,
  encrypted_session_key_hex text not null,
  created_at timestamp with time zone default now()
);

-- 3. Row Level Security 설정
alter table public.user_pki_certs enable row level security;
alter table public.secure_envelopes enable row level security;

-- 4. Policies (접근 권한 정책)
-- 인증서 조회: 로그인 된 모든 사용자
create policy "Certs are viewable by authenticated users" 
on public.user_pki_certs as permissive for select 
to authenticated using (true);

-- 인증서 삽입: 본인 것만 가능
create policy "Users can insert their own cert" 
on public.user_pki_certs as permissive for insert
to authenticated with check (auth.uid() = id);

-- 메일 조회: 발신자이거나 수신자인 경우만
create policy "Users can read their own envelopes"
on public.secure_envelopes as permissive for select
to authenticated using (auth.uid() = receiver_id or auth.uid() = sender_id);

-- 메일 전송: 본인이 발신자인 메시지만 생성
create policy "Users can send envelopes"
on public.secure_envelopes as permissive for insert
to authenticated with check (auth.uid() = sender_id);
