'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import Sidebar from './Sidebar';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type Session = {
  id: string;
  title: string;
  created_at: string;
};

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi there 👋 I'm ZenBot, your mental health support companion. How are you feeling today? You can talk to me about anything — stress, anxiety, academic pressure, or just how your day went. 💚",
};

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const startNewChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setCurrentSessionId(null);
    setInput('');
    setSidebarOpen(false);
  };

  const loadSession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const data = await res.json();
      if (data.session) {
        setMessages(data.session.messages);
        setCurrentSessionId(sessionId);
        setSidebarOpen(false);
      }
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const botMessage: Message = { role: 'assistant', content: data.reply };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      const title =
        userMessage.content.slice(0, 40) +
        (userMessage.content.length > 40 ? '...' : '');

      if (!currentSessionId) {
        const sessionRes = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, messages: finalMessages }),
        });
        const sessionData = await sessionRes.json();
        if (sessionData.session) {
          setCurrentSessionId(sessionData.session.id);
          await fetchSessions();
        }
      } else {
        await fetch('/api/sessions', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: currentSessionId,
            messages: finalMessages,
            title,
          }),
        });
        await fetchSessions();
      }
    } catch (err) {
      console.error('sendMessage error:', err);
      setMessages([
        ...messages,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f0f7f4', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Mobile overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10 }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed' ,
        left: sidebarOpen ? 0 : '-260px',
        top: 0, bottom: 0,
        zIndex: 20,
        transition: 'left 0.3s ease',
        display: 'block',
      }}
        className="mobile-sidebar"
      >
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={startNewChat}
          onSelectSession={loadSession}
        />
      </div>

      {/* Desktop sidebar — always visible */}
      <div className="desktop-sidebar">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onNewChat={startNewChat}
          onSelectSession={loadSession}
        />
      </div>

      {/* Main chat area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>

        {/* Header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #ddeee6', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}
          >
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
          </button>

          <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
            🌿
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2d6a4f' }}>ZenBot</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#74b49b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#52b788', display: 'inline-block', flexShrink: 0 }}></span>
              Online and ready to listen
            </p>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} content={msg.content} />
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e8f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                🌿
              </div>
              <div style={{ background: '#fff', border: '1px solid #ddeee6', borderRadius: '18px', borderBottomLeftRadius: '4px', padding: '12px 16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 150, 300].map((delay, i) => (
                  <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#74b49b', display: 'inline-block', animation: `bounce 1.2s ${delay}ms infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#95b8a8', padding: '6px 16px', margin: 0, background: '#fff', borderTop: '1px solid #ddeee6' }}>
          ZenBot is not a licensed therapist. In crisis? Call 0800-1000-6464
        </p>

        {/* Input */}
        <div style={{ background: '#fff', borderTop: '1px solid #ddeee6', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            style={{ flex: 1, background: '#f0f7f4', border: '1px solid #c8e6d8', borderRadius: '24px', padding: '10px 16px', fontSize: '13px', color: '#2c3e35', outline: 'none', fontFamily: 'system-ui, sans-serif', minWidth: 0 }}
            placeholder="Type how you're feeling..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2d6a4f', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: loading || !input.trim() ? 0.4 : 1 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }

        /* Desktop: show sidebar inline, hide hamburger */
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-sidebar { display: none !important; }
          .hamburger { display: none !important; }
        }

        /* Mobile: hide desktop sidebar, show hamburger */
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: block !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}