'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import Sidebar from './Sidebar';
import VoiceInputButton from './VoiceInputButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

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

async function readChatStream(
  res: Response,
  onText: (text: string) => void
): Promise<{ fullText: string; isCrisis?: boolean; error?: string }> {
  const reader = res.body?.getReader();
  if (!reader) throw new Error('No response stream');

  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';
  let isCrisis = false;
  let error: string | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const payload = JSON.parse(line.slice(6)) as {
          text?: string;
          error?: string;
          isCrisis?: boolean;
          done?: boolean;
        };
        if (payload.error) error = payload.error;
        if (payload.isCrisis) isCrisis = true;
        if (payload.text) {
          fullText += payload.text;
          onText(fullText);
        }
      } catch {
        /* ignore malformed chunks */
      }
    }
  }

  return { fullText, isCrisis, error };
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const voiceBaseRef = useRef('');

  const onVoiceTranscript = useCallback((spoken: string, isFinal: boolean) => {
    const base = voiceBaseRef.current;
    const combined = base ? `${base} ${spoken}`.trim() : spoken;
    setInput(combined);
    if (isFinal) voiceBaseRef.current = combined;
  }, []);

  const { listening, supported, toggle: toggleVoice, stop: stopVoice } = useSpeechRecognition({
    onTranscript: onVoiceTranscript,
    onError: (msg) => setVoiceError(msg),
  });

  const handleVoiceToggle = () => {
    setVoiceError(null);
    if (listening) {
      stopVoice();
    } else {
      voiceBaseRef.current = input;
      toggleVoice();
    }
  };

  const fetchSessions = useCallback(async (query = searchQuery) => {
    try {
      const url = query.trim()
        ? `/api/sessions?q=${encodeURIComponent(query.trim())}`
        : '/api/sessions';
      const res = await fetch(url);
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSessions('');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchSessions(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery, fetchSessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, streaming]);

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

  const renameSession = async (id: string, title: string) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title }),
      });
      if (res.ok) await fetchSessions();
    } catch (err) {
      console.error('Error renaming session:', err);
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
      if (!res.ok) return;
      if (currentSessionId === id) startNewChat();
      await fetchSessions();
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const persistSession = async (
    finalMessages: Message[],
    userMessage: Message,
    sessionId: string | null
  ) => {
    const title =
      userMessage.content.slice(0, 40) + (userMessage.content.length > 40 ? '...' : '');

    if (!sessionId) {
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
        body: JSON.stringify({ id: sessionId, messages: finalMessages }),
      });
      await fetchSessions();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || streaming) return;

    if (listening) stopVoice();

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);
    setInput('');
    voiceBaseRef.current = '';
    setLoading(true);
    setStreaming(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        throw new Error('Chat request failed');
      }

      const { fullText, error } = await readChatStream(res, (text) => {
        setLoading(false);
        setStreaming(true);
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'assistant', content: text };
          return next;
        });
      });

      const reply =
        error ||
        fullText ||
        'I am having trouble responding right now. Please try again in a moment.';
      const finalMessages: Message[] = [
        ...updatedMessages,
        { role: 'assistant', content: reply },
      ];
      setMessages(finalMessages);
      await persistSession(finalMessages, userMessage, currentSessionId);
    } catch (err) {
      console.error('sendMessage error:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
      setStreaming(false);
    }
  };

  const sidebarProps = {
    sessions,
    currentSessionId,
    onNewChat: startNewChat,
    onSelectSession: loadSession,
    searchQuery,
    onSearchQueryChange: setSearchQuery,
    onRenameSession: renameSession,
    onDeleteSession: deleteSession,
  };

  const showTypingIndicator =
    loading && messages[messages.length - 1]?.content === '';

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#f0f7f4',
        fontFamily: 'system-ui, sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 10 }}
        />
      )}

      <div
        style={{
          position: 'fixed',
          left: sidebarOpen ? 0 : '-260px',
          top: 0,
          bottom: 0,
          zIndex: 20,
          transition: 'left 0.3s ease',
          display: 'block',
        }}
        className="mobile-sidebar"
      >
        <Sidebar {...sidebarProps} />
      </div>

      <div className="desktop-sidebar">
        <Sidebar {...sidebarProps} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <div
          style={{
            background: '#fff',
            borderBottom: '1px solid #ddeee6',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
            <span style={{ width: '20px', height: '2px', background: '#2d6a4f', borderRadius: '2px', display: 'block' }} />
          </button>

          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#e8f5ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            🌿
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2d6a4f' }}>ZenBot</p>
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                color: '#74b49b',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: streaming ? '#f0b429' : '#52b788',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              {streaming ? 'Typing...' : 'Online and ready to listen'}
            </p>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {messages.map((msg, i) => {
            if (msg.role === 'assistant' && msg.content === '' && i === messages.length - 1) {
              return null;
            }
            return <MessageBubble key={i} role={msg.role} content={msg.content} />;
          })}

          {showTypingIndicator && (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: '#e8f5ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  flexShrink: 0,
                }}
              >
                🌿
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #ddeee6',
                  borderRadius: '18px',
                  borderBottomLeftRadius: '4px',
                  padding: '12px 16px',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {[0, 150, 300].map((delay, i) => (
                  <span
                    key={i}
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#74b49b',
                      display: 'inline-block',
                      animation: `bounce 1.2s ${delay}ms infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: '10px',
            color: '#95b8a8',
            padding: '6px 16px',
            margin: 0,
            background: '#fff',
            borderTop: '1px solid #ddeee6',
          }}
        >
          ZenBot is not a licensed therapist. In crisis? Call 0800-1000-6464
        </p>

        <div style={{ background: '#fff', borderTop: '1px solid #ddeee6' }}>
          {voiceError && (
            <p
              style={{
                margin: 0,
                padding: '6px 12px 0',
                fontSize: '10px',
                color: '#b91c1c',
                lineHeight: 1.4,
              }}
            >
              {voiceError}
            </p>
          )}
          {listening && (
            <p
              style={{
                margin: 0,
                padding: '6px 12px 0',
                fontSize: '10px',
                color: '#2d6a4f',
                fontWeight: 500,
              }}
            >
              Listening… speak now, then tap stop or send
            </p>
          )}
          <div
            style={{
              padding: '10px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
          <VoiceInputButton
            listening={listening}
            supported={supported}
            disabled={loading || streaming}
            onClick={handleVoiceToggle}
          />
          <input
            type="text"
            style={{
              flex: 1,
              background: listening ? '#fff' : '#f0f7f4',
              border: `1px solid ${listening ? '#74b49b' : '#c8e6d8'}`,
              borderRadius: '24px',
              padding: '10px 16px',
              fontSize: '13px',
              color: '#2c3e35',
              outline: 'none',
              fontFamily: 'system-ui, sans-serif',
              minWidth: 0,
            }}
            placeholder={listening ? 'Listening…' : "Type or tap mic to talk…"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading || streaming}
          />
          <button
            onClick={sendMessage}
            disabled={loading || streaming || !input.trim()}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#2d6a4f',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              opacity: loading || streaming || !input.trim() ? 0.4 : 1,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes pulse-mic {
          0%, 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.35); }
          50% { box-shadow: 0 0 0 6px rgba(231, 76, 60, 0); }
        }
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-sidebar { display: none !important; }
          .hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-sidebar { display: none !important; }
          .mobile-sidebar { display: block !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
