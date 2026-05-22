import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Message = { role: 'user' | 'assistant'; content: string };

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi there 👋 I'm ZenBot, your mental health support companion. How are you feeling today? You can talk to me about anything — stress, anxiety, academic pressure, or just how your day went. 💚",
};

function normalizeMessages(input: unknown): Message[] {
  const coerceRole = (role: any): 'user' | 'assistant' => {
    if (role === 'user' || role === 'assistant') return role;
    return 'user';
  };

  const coerceContent = (content: any): string => {
    if (typeof content === 'string') return content;
    if (content == null) return '';
    return String(content);
  };

  if (input == null) return [WELCOME_MESSAGE];

  // If client sent JSON-stringified messages, parse them.
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      return normalizeMessages(parsed);
    } catch {
      console.warn('normalizeMessages(POST/PATCH): messages was string but not JSON:', input);
      return [WELCOME_MESSAGE];
    }
  }

  if (Array.isArray(input)) {
    const normalized = input
      .map((m: any) => {
        const role = coerceRole(m?.role);
        const content = coerceContent(m?.content);

        // Drop empty messages created by bad serialization
        if (!content.trim()) return null;

        return { role, content } as Message;
      })
      .filter(Boolean) as Message[];

    return normalized.length ? normalized : [WELCOME_MESSAGE];
  }

  console.warn('normalizeMessages(POST/PATCH): unexpected messages type:', typeof input);
  return [WELCOME_MESSAGE];
}

export async function GET() {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('GET sessions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: data });
}

export async function POST(req: NextRequest) {
  try {
    const { title, messages } = await req.json();
    console.log('Saving session with title:', title);
    console.log('POST incoming messages type:', typeof messages);

    const normalizedMessages = normalizeMessages(messages);

    console.log('POST normalized messages length:', normalizedMessages.length);
    console.log('POST normalized messages sample:', normalizedMessages[0]);

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ title, messages: normalizedMessages })
      .select()
      .single();

    if (error) {
      console.error('POST session error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Session saved successfully:', data.id);
    return NextResponse.json({ session: data });
  } catch (err) {
    console.error('Unexpected POST error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, messages, title } = await req.json();
    console.log('Updating session id:', id);
    console.log('PATCH incoming messages type:', typeof messages);

    const normalizedMessages = normalizeMessages(messages);

    console.log('PATCH normalized messages length:', normalizedMessages.length);
    console.log('PATCH normalized messages sample:', normalizedMessages[0]);

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({
        messages: normalizedMessages,
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('PATCH session error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (err) {
    console.error('Unexpected PATCH error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
