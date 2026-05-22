'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getSpeechRecognition } from '@/lib/speech-recognition';

type Options = {
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
};

export function useSpeechRecognition({ onTranscript, onError }: Options) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const callbacksRef = useRef({ onTranscript, onError });

  callbacksRef.current = { onTranscript, onError };

  useEffect(() => {
    const Ctor = getSpeechRecognition();
    setSupported(!!Ctor);
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) isFinal = true;
      }
      const text = transcript.trim();
      if (text) {
        callbacksRef.current.onTranscript(text, isFinal);
      }
    };

    recognition.onend = () => setListening(false);

    recognition.onerror = (event) => {
      setListening(false);
      const msg =
        event.error === 'not-allowed'
          ? 'Microphone access was denied. Allow the mic in your browser settings.'
          : event.error === 'no-speech'
            ? 'No speech detected. Try again.'
            : event.error === 'aborted'
              ? ''
              : `Voice input error: ${event.error}`;
      if (msg) callbacksRef.current.onError?.(msg);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      callbacksRef.current.onError?.(
        'Voice input is not supported in this browser. Try Chrome or Edge.'
      );
      return;
    }
    try {
      recognition.start();
      setListening(true);
    } catch {
      callbacksRef.current.onError?.('Could not start voice input. Try again.');
    }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, supported, start, stop, toggle };
}
