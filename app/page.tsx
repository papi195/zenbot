import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh', background: '#f0f7f4',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', background: '#e8f5ee',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px', margin: '0 auto 24px'
        }}>
          🌿
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#2d6a4f', marginBottom: '12px' }}>ZenBot</h1>
        <p style={{ color: '#74b49b', marginBottom: '32px', lineHeight: '1.6', fontSize: '14px' }}>
          A safe, judgment-free space for university students to talk about
          mental health, stress, and emotional wellbeing.
        </p>
        <Link href="/chat" style={{
          background: '#2d6a4f', color: '#fff', padding: '12px 32px',
          borderRadius: '999px', fontSize: '14px', fontWeight: 500,
          textDecoration: 'none', display: 'inline-block'
        }}>
          Start Talking
        </Link>
      </div>
    </main>
  );
}