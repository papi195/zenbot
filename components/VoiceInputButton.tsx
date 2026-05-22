'use client';

import { Mic, Square } from 'lucide-react';

type Props = {
  listening: boolean;
  supported: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export default function VoiceInputButton({ listening, supported, disabled, onClick }: Props) {
  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={listening ? 'Stop listening' : 'Talk to type'}
      aria-label={listening ? 'Stop voice input' : 'Start voice input'}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: `1.5px solid ${listening ? '#e74c3c' : '#c8e6d8'}`,
        background: listening ? '#fef2f2' : '#f0f7f4',
        color: listening ? '#e74c3c' : '#2d6a4f',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        animation: listening ? 'pulse-mic 1.2s ease-in-out infinite' : 'none',
      }}
    >
      {listening ? (
        <Square style={{ width: '14px', height: '14px', fill: 'currentColor' }} />
      ) : (
        <Mic style={{ width: '18px', height: '18px' }} />
      )}
    </button>
  );
}
