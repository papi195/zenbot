'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { Leaf, LogIn, Home, Heart, Compass } from 'lucide-react';
import Link from 'next/link';

export default function LogoutPage() {
  const [loading, setLoading] = useState(true);
  const [breatheText, setBreatheText] = useState('Inhale peace...');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // 1. Perform Supabase Sign Out client-side
    const performSignOut = async () => {
      try {
        await supabase.auth.signOut();
        router.refresh();
      } catch (err) {
        console.error('Error signing out from Supabase:', err);
      }
    };

    performSignOut();

    // 2. Calming breathing animation guide (2.5 seconds total)
    const textInterval = setTimeout(() => {
      setBreatheText('Exhale stress...');
    }, 1250);

    const completionTimeout = setTimeout(() => {
      setLoading(false);
    }, 2800);

    return () => {
      clearTimeout(textInterval);
      clearTimeout(completionTimeout);
    };
  }, [supabase]);

  // Quotes to leave the user with a peaceful state of mind
  const quotes = [
    "“Self-care is how you take your power back.” — Lalah Delia",
    "“Feelings are just waves, watch them come and go.” — Amit Ray",
    "“Quiet the mind and the soul will speak.” — Ma Jaya Sati Bhagavati",
    "“You don't have to control your thoughts. You just have to stop letting them control you.” — Dan Millman",
    "“Within you, there is a stillness and a sanctuary to which you can retreat at any time.” — Hermann Hesse"
  ];

  // Pick a random quote (stable index for this render session)
  const [selectedQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 60%, #40916c 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,243,208,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-10%',
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,243,208,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {loading ? (
          /* ── BREATHING / LOADING STATE ── */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Pulsing Breathing Ring */}
            <div
              style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              {/* Outer Breathing Circle */}
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(167, 243, 208, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  animation: 'breathe-ring 2.8s ease-in-out infinite',
                }}
              />
              {/* Inner Soft Circle */}
              <div
                style={{
                  position: 'absolute',
                  width: '80%',
                  height: '80%',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 0 20px rgba(255,255,255,0.1)',
                }}
              >
                <Leaf style={{ width: '32px', height: '32px', color: '#a7f3d0' }} />
              </div>
            </div>

            {/* Breathing Guidance Text */}
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: '#fff',
                marginBottom: '12px',
                letterSpacing: '-0.02em',
                transition: 'opacity 0.5s ease',
              }}
            >
              {breatheText}
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.6,
                maxWidth: '320px',
              }}
            >
              Taking a short pause to reset. You are signing out securely...
            </p>
          </div>
        ) : (
          /* ── SIGNED OUT CONFIRMATION STATE ── */
          <div
            style={{
              animation: 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Brand Logo Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Leaf style={{ width: '18px', height: '18px', color: '#a7f3d0' }} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>
                ZenBot
              </span>
            </div>

            {/* Thank you note */}
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#fff',
                marginBottom: '16px',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Securely Logged Out
            </h1>
            <p
              style={{
                fontSize: '15px',
                color: 'rgba(167, 243, 208, 0.9)',
                lineHeight: 1.7,
                marginBottom: '36px',
                maxWidth: '380px',
              }}
            >
              Thank you for dedicating time to your mental wellness today.
              Remember, a calm mind is your greatest strength. We are always here when you need us. 💚
            </p>

            {/* Inspiring Wellness Quote Card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '40px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                <Heart style={{ width: '20px', height: '20px', color: '#a7f3d0', opacity: 0.8 }} />
              </div>
              <p
                style={{
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {selectedQuote}
              </p>
            </div>

            {/* Dynamic Interactive Navigation Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
              }}
            >
              <a
                href="/auth"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#fff',
                  color: '#2d6a4f',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                  (e.target as HTMLAnchorElement).style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(0)';
                  (e.target as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                }}
              >
                <LogIn style={{ width: '16px', height: '16px' }} />
                Sign Back In
              </a>

              <a
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'background 0.2s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.15)';
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.1)';
                  (e.target as HTMLAnchorElement).style.transform = 'translateY(0)';
                }}
              >
                <Home style={{ width: '16px', height: '16px' }} />
                Return to Home
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Breathing ring & fade-in custom keyframes */}
      <style>{`
        @keyframes breathe-ring {
          0%, 100% {
            transform: scale(0.9);
            opacity: 0.4;
            background: rgba(167, 243, 208, 0.1);
          }
          50% {
            transform: scale(1.15);
            opacity: 0.9;
            background: rgba(167, 243, 208, 0.22);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
