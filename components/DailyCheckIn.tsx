'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const moodEmojis = ['😔', '😕', '😐', '🙂', '😊'];

type RecentDay = { date: string; mood: number | null; note: string | null };

type CheckinState = {
  today: { date: string; mood: number; note: string | null } | null;
  streak: number;
  bestStreak: number;
  recent: RecentDay[];
};

export default function DailyCheckIn() {
  const [data, setData] = useState<CheckinState | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/checkins');
      if (!res.ok) return;
      const json = await res.json();
      setData(json);
      if (json.today) {
        setSelectedMood(json.today.mood);
        setNote(json.today.note ?? '');
      }
    } catch {
      /* table may not exist yet */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveCheckin = async (mood: number, collapseAfter = false) => {
    setSelectedMood(mood);
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, note: note.trim() || null }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Could not save check-in');
        return;
      }
      await load();
      if (collapseAfter) setExpanded(false);
    } catch {
      setError('Could not save check-in');
    } finally {
      setSaving(false);
    }
  };

  const streak = data?.streak ?? 0;
  const best = data?.bestStreak ?? 0;
  const checkedInToday = Boolean(data?.today);
  const todayEmoji = selectedMood != null ? moodEmojis[selectedMood] : null;

  return (
    <div
      style={{
        borderTop: '1px solid #ddeee6',
        paddingTop: '10px',
        flexShrink: 0,
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 10px',
          background: checkedInToday ? '#f0fdf4' : '#fef9f0',
          border: `1px solid ${checkedInToday ? '#bbf7d0' : '#f4d9a0'}`,
          borderRadius: '10px',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#2d6a4f', flex: 1, textAlign: 'left' }}>
          Daily check-in
        </span>
        {streak > 0 && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#b8860b',
              background: '#fef0c7',
              padding: '1px 6px',
              borderRadius: '10px',
            }}
            title={best > 0 ? `Best: ${best} days` : undefined}
          >
            🔥 {streak}
          </span>
        )}
        {todayEmoji && <span style={{ fontSize: '14px' }}>{todayEmoji}</span>}
        {checkedInToday && (
          <span style={{ fontSize: '9px', color: '#2d6a4f', fontWeight: 600 }}>✓</span>
        )}
        {expanded ? (
          <ChevronUp style={{ width: '14px', height: '14px', color: '#95b8a8', flexShrink: 0 }} />
        ) : (
          <ChevronDown style={{ width: '14px', height: '14px', color: '#95b8a8', flexShrink: 0 }} />
        )}
      </button>

      {expanded && (
        <div
          style={{
            marginTop: '8px',
            padding: '10px',
            background: '#fef9f0',
            border: '1px solid #f4d9a0',
            borderRadius: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', gap: '2px' }}>
            {data?.recent?.map((day) => (
              <div
                key={day.date}
                title={day.date}
                style={{
                  flex: 1,
                  height: '18px',
                  borderRadius: '3px',
                  background: day.mood != null ? '#fef0c7' : '#f5f0e6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                }}
              >
                {day.mood != null ? moodEmojis[day.mood] : '·'}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '8px' }}>
            {moodEmojis.map((emoji, i) => (
              <button
                key={i}
                type="button"
                disabled={saving}
                onClick={() => saveCheckin(i, true)}
                style={{
                  flex: 1,
                  height: '32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  border: `1.5px solid ${selectedMood === i ? '#2d6a4f' : '#f4d9a0'}`,
                  background: selectedMood === i ? '#e8f5ee' : '#fff',
                  cursor: saving ? 'wait' : 'pointer',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note..."
            maxLength={500}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: '1px solid #f4d9a0',
              borderRadius: '8px',
              padding: '6px 8px',
              fontSize: '11px',
              marginBottom: '6px',
              fontFamily: 'inherit',
            }}
          />

          {selectedMood != null && note.trim() && (
            <button
              type="button"
              disabled={saving}
              onClick={() => saveCheckin(selectedMood, true)}
              style={{
                width: '100%',
                padding: '6px',
                background: '#2d6a4f',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
              }}
            >
              {saving ? 'Saving...' : 'Save note'}
            </button>
          )}

          {error && (
            <p style={{ fontSize: '10px', color: '#b91c1c', margin: '6px 0 0' }}>{error}</p>
          )}
        </div>
      )}
    </div>
  );
}
