'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Session } from './ChatWindow';
import { createClient } from '@/lib/supabase';
import { LogOut } from 'lucide-react';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

type Props = {
  sessions: Session[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
};

export default function Sidebar({ sessions, currentSessionId, onNewChat, onSelectSession }: Props) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? null);
        setUserName(user.user_metadata?.full_name ?? null);
      }
    });
  }, []);

  const getInitials = (val: string | null) => {
    if (!val) return 'U';
    const parts = val.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return val.slice(0, 2).toUpperCase();
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    background: '#f0f7f4',
    border: '1px solid #ddeee6',
    borderRadius: '10px',
    fontSize: '12px',
    color: '#2d6a4f',
    textDecoration: 'none',
    fontWeight: 500,
  };

  return (
    <div
      style={{
        width: '220px',
        background: '#fff',
        borderRight: '1px solid #ddeee6',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '12px',
        flexShrink: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '16px',
          borderBottom: '1px solid #ddeee6',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#e8f5ee',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
          }}
        >
          🌿
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#2d6a4f', margin: 0 }}>ZenBot</p>
          <p style={{ fontSize: '10px', color: '#74b49b', margin: 0 }}>Mental wellness support</p>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        style={{
          background: '#2d6a4f',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '100%',
        }}
      >
        ＋ New conversation
      </button>

      {/* Resource Library Link */}
      <Link href="/resources" style={linkStyle}>
        <span>📚</span>
        <span>Resource Library</span>
      </Link>

      {/* Recent Sessions */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <p
          style={{
            fontSize: '10px',
            color: '#95b8a8',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '8px',
            marginTop: 0,
          }}
        >
          Recent
        </p>
        {sessions.length === 0 && (
          <p style={{ fontSize: '11px', color: '#95b8a8', padding: '4px 8px', margin: 0 }}>
            No chats yet
          </p>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              fontSize: '12px',
              color: currentSessionId === session.id ? '#2d6a4f' : '#4a7c6a',
              background: currentSessionId === session.id ? '#e8f5ee' : 'transparent',
              fontWeight: currentSessionId === session.id ? 600 : 400,
              cursor: 'pointer',
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {session.title}
          </div>
        ))}
      </div>

      {/* Mood Tracker */}
      <div
        style={{
          background: '#fef9f0',
          border: '1px solid #f4d9a0',
          borderRadius: '12px',
          padding: '12px',
          flexShrink: 0,
        }}
      >
        <p style={{ fontSize: '11px', color: '#b8860b', fontWeight: 500, marginBottom: '10px', marginTop: 0 }}>
          How are you feeling today?
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {moodEmojis.map((emoji, i) => (
            <button
              key={i}
              onClick={() => setSelectedMood(i)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1.5px solid ${selectedMood === i ? '#f0b429' : '#f4d9a0'}`,
                background: selectedMood === i ? '#fef0c7' : 'transparent',
                cursor: 'pointer',
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}