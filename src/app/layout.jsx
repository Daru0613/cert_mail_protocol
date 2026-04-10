import './globals.css';

export const metadata = {
  title: '보안프로토콜 인증서 기반 웹 플랫폼',
  description: '보안프로토콜 인증서 기반 웹 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className="bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}
