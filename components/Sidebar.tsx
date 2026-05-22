'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Session } from './ChatWindow';
import { createClient } from '@/lib/supabase';
import { LogOut, Search, Pencil, Trash2, MoreVertical, Check, X } from 'lucide-react';
import DailyCheckIn from './DailyCheckIn';

type Props = {
  sessions: Session[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onRenameSession: (id: string, title: string) => void;
  onDeleteSession: (id: string) => void;
};

export default function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  searchQuery,
  onSearchQueryChange,
  onRenameSession,
  onDeleteSession,
}: Props) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? null);
        setUserName(user.user_metadata?.full_name ?? null);
      }
    });
  }, []);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
      }
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const getInitials = (val: string | null) => {
    if (!val) return 'U';
    const parts = val.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return val.slice(0, 2).toUpperCase();
  };

  const startRename = (session: Session) => {
    setEditingId(session.id);
    setEditTitle(session.title);
    setMenuId(null);
  };

  const saveRename = async () => {
    if (!editingId || !editTitle.trim()) return;
    await onRenameSession(editingId, editTitle.trim());
    setEditingId(null);
    setEditTitle('');
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = async (id: string, title: string) => {
    setMenuId(null);
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      await onDeleteSession(id);
    }
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
        overflow: 'hidden',
      }}
    >
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

      <Link href="/resources" style={linkStyle}>
        <span>📚</span>
        <span>Resource Library</span>
      </Link>

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p
          style={{
            fontSize: '10px',
            color: '#95b8a8',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '8px',
            marginTop: 0,
            flexShrink: 0,
          }}
        >
          Recent
        </p>

        <div style={{ position: 'relative', marginBottom: '8px' }}>
          <Search
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '12px',
              height: '12px',
              color: '#95b8a8',
              pointerEvents: 'none',
            }}
          />
          <input
            type="search"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '7px 8px 7px 26px',
              border: '1px solid #ddeee6',
              borderRadius: '8px',
              fontSize: '11px',
              background: '#f8fcfa',
              outline: 'none',
            }}
          />
        </div>

        {sessions.length === 0 && (
          <p style={{ fontSize: '11px', color: '#95b8a8', padding: '4px 8px', margin: 0 }}>
            {searchQuery.trim() ? 'No matching chats' : 'No chats yet'}
          </p>
        )}

        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              marginBottom: '2px',
              borderRadius: '8px',
              background: currentSessionId === session.id ? '#e8f5ee' : 'transparent',
              minWidth: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {editingId === session.id ? (
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 4px 4px 6px',
                  boxSizing: 'border-box',
                }}
              >
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  autoFocus
                  style={{
                    flex: 1,
                    minWidth: 0,
                    width: 0,
                    fontSize: '11px',
                    padding: '4px 6px',
                    border: '1px solid #2d6a4f',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={saveRename}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      flexShrink: 0,
                    }}
                    aria-label="Save"
                  >
                    <Check style={{ width: '14px', height: '14px', color: '#2d6a4f' }} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelRename}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      flexShrink: 0,
                    }}
                    aria-label="Cancel"
                  >
                    <X style={{ width: '14px', height: '14px', color: '#95b8a8' }} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  onClick={() => onSelectSession(session.id)}
                  style={{
                    flex: 1,
                    padding: '8px 6px 8px 10px',
                    fontSize: '12px',
                    color: currentSessionId === session.id ? '#2d6a4f' : '#4a7c6a',
                    fontWeight: currentSessionId === session.id ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: 0,
                  }}
                >
                  {session.title}
                </div>
                <div style={{ position: 'relative', flexShrink: 0 }} ref={menuId === session.id ? menuRef : undefined}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuId(menuId === session.id ? null : session.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '6px 4px',
                      color: '#95b8a8',
                      display: 'flex',
                    }}
                    aria-label="Chat options"
                  >
                    <MoreVertical style={{ width: '14px', height: '14px' }} />
                  </button>
                  {menuId === session.id && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        zIndex: 30,
                        background: '#fff',
                        border: '1px solid #ddeee6',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        minWidth: '120px',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(session);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '8px 10px',
                          border: 'none',
                          background: '#fff',
                          fontSize: '11px',
                          color: '#2d6a4f',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <Pencil style={{ width: '12px', height: '12px' }} />
                        Rename
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(session.id, session.title);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '8px 10px',
                          border: 'none',
                          background: '#fff',
                          fontSize: '11px',
                          color: '#b91c1c',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <Trash2 style={{ width: '12px', height: '12px' }} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <DailyCheckIn />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
        {(userName || userEmail) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 2px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#e8f5ee',
                color: '#2d6a4f',
                fontSize: '10px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {getInitials(userName ?? userEmail)}
            </div>
            <div style={{ minWidth: 0 }}>
              {userName && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#2d6a4f',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userName}
                </p>
              )}
              {userEmail && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '10px',
                    color: '#95b8a8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {userEmail}
                </p>
              )}
            </div>
          </div>
        )}
        <Link
          href="/logout"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 12px',
            background: '#fff',
            border: '1px solid #ddeee6',
            borderRadius: '10px',
            fontSize: '12px',
            color: '#5a8a78',
            textDecoration: 'none',
            fontWeight: 500,
            width: '100%',
          }}
        >
          <LogOut style={{ width: '14px', height: '14px' }} />
          Log out
        </Link>
        </div>
      </div>
    </div>
  );
}
