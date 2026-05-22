'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Leaf,
} from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (!isLogin && !name) {
      setError('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/chat');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setSuccess('Account created! Check your email to confirm, then log in.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(160deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden md:flex"
      >
        {/* Subtle ambient shapes */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-60px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        {/* Top – Brand */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf style={{ width: '20px', height: '20px', color: '#a7f3d0' }} />
            </div>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              ZenBot
            </span>
          </div>
        </div>

        {/* Middle – Headline */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontSize: '40px',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '20px',
              maxWidth: '380px',
            }}
          >
            Your safe space
            <br />
            for mental
            <br />
            wellness.
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'rgba(167, 243, 208, 0.85)',
              lineHeight: 1.7,
              maxWidth: '340px',
            }}
          >
            A judgment-free AI companion designed for university students.
            Talk about stress, anxiety, or anything on your mind.
          </p>

          {/* Feature pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '28px' }}>
            {['Private & Secure', 'Available 24/7', 'No Judgment'].map((t) => (
              <span
                key={t}
                style={{
                  padding: '6px 14px',
                  borderRadius: '100px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '12px',
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom – Trust badge */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <Shield
            style={{
              width: '16px',
              height: '16px',
              color: 'rgba(167, 243, 208, 0.7)',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            End-to-end encrypted. Your conversations are never shared.
          </span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px 24px',
          background: '#fff',
          minHeight: '100vh',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile-only brand */}
          <div
            className="md:hidden"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e8f5ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf style={{ width: '18px', height: '18px', color: '#2d6a4f' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              ZenBot
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1a1a1a',
              letterSpacing: '-0.03em',
              marginBottom: '6px',
            }}
          >
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p style={{ fontSize: '14px', color: '#737373', marginBottom: '32px', lineHeight: 1.5 }}>
            {isLogin
              ? 'Sign in to continue your wellness journey.'
              : 'Start your journey to better mental health.'}
          </p>

          {/* Error / Success */}
          {error && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                color: '#16a34a',
                fontSize: '13px',
                fontWeight: 500,
                marginBottom: '20px',
                lineHeight: 1.5,
              }}
            >
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Name — sign up only */}
              {!isLogin && (
                <div>
                  <label
                    htmlFor="auth-name"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User
                      style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: '#9ca3af',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      id="auth-name"
                      type="text"
                      placeholder="Oguh Emmanuel"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 42px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '14px',
                        color: '#1a1a1a',
                        background: '#fafafa',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#2d6a4f';
                        e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.08)';
                        e.target.style.background = '#fff';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                        e.target.style.background = '#fafafa';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="auth-email"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#9ca3af',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 42px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      background: '#fafafa',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2d6a4f';
                      e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.08)';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#fafafa';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label
                    htmlFor="auth-password"
                    style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}
                  >
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() =>
                        setError(
                          'Password reset is handled via email. Contact support for help.'
                        )
                      }
                      style={{
                        fontSize: '12px',
                        color: '#2d6a4f',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '16px',
                      height: '16px',
                      color: '#9ca3af',
                      pointerEvents: 'none',
                    }}
                  />
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={isLogin ? '••••••••' : 'Min. 6 characters'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                    style={{
                      width: '100%',
                      padding: '11px 44px 11px 42px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '14px',
                      color: '#1a1a1a',
                      background: '#fafafa',
                      outline: 'none',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#2d6a4f';
                      e.target.style.boxShadow = '0 0 0 3px rgba(45,106,79,0.08)';
                      e.target.style.background = '#fff';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                      e.target.style.background = '#fafafa';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {showPassword ? (
                      <EyeOff style={{ width: '16px', height: '16px' }} />
                    ) : (
                      <Eye style={{ width: '16px', height: '16px' }} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '24px',
                padding: '12px',
                background: loading ? '#4a7c6a' : '#2d6a4f',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background 0.2s, transform 0.1s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.background = '#1b4332';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.background = '#2d6a4f';
              }}
              onMouseDown={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.transform = 'scale(0.99)';
              }}
              onMouseUp={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.transform = 'scale(1)';
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '28px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
            <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
              {isLogin ? 'New to ZenBot?' : 'Already have an account?'}
            </span>
            <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          </div>

          {/* Toggle auth mode */}
          <button
            type="button"
            onClick={switchMode}
            style={{
              width: '100%',
              padding: '11px',
              background: '#fff',
              color: '#2d6a4f',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s, border-color 0.2s',
              letterSpacing: '-0.01em',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.background = '#f0fdf4';
              (e.target as HTMLButtonElement).style.borderColor = '#bbf7d0';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.background = '#fff';
              (e.target as HTMLButtonElement).style.borderColor = '#e5e7eb';
            }}
          >
            {isLogin ? 'Create an Account' : 'Sign In Instead'}
          </button>

          {/* Footer */}
          <p
            style={{
              textAlign: 'center',
              marginTop: '32px',
              fontSize: '12px',
              color: '#9ca3af',
              lineHeight: 1.6,
            }}
          >
            Your conversations are private and encrypted.
            <br />
            ZenBot does not share your data with anyone.
          </p>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}