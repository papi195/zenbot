import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/require-user';

type Message = { role: 'user' | 'assistant'; content: string };

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi there 👋 I'm ZenBot, your mental health support companion. How are you feeling today? You can talk to me about anything — stress, anxiety, academic pressure, or just how your day went. 💚",
};

function normalizeMessages(input: unknown): Message[] {
  const coerceRole = (role: unknown): 'user' | 'assistant' => {
    if (role === 'user' || role === 'assistant') return role;
    return 'user';
  };

  const coerceContent = (content: unknown): string => {
    if (typeof content === 'string') return content;
    if (content == null) return '';
    return String(content);
  };

  if (input == null) return [WELCOME_MESSAGE];

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
      .map((m: { role?: unknown; content?: unknown }) => {
        const role = coerceRole(m?.role);
        const content = coerceContent(m?.content);
        if (!content.trim()) return null;
        return { role, content } as Message;
      })
      .filter(Boolean) as Message[];

    return normalized.length ? normalized : [WELCOME_MESSAGE];
  }

  console.warn('normalizeMessages(POST/PATCH): unexpected messages type:', typeof input);
  return [WELCOME_MESSAGE];
}

function sessionMatchesQuery(
  session: { title?: string | null; messages?: unknown },
  q: string
): boolean {
  if (session.title?.toLowerCase().includes(q)) return true;
  const msgs = Array.isArray(session.messages) ? session.messages : [];
  return msgs.some(
    (m: { content?: string }) =>
      typeof m?.content === 'string' && m.content.toLowerCase().includes(q)
  );
}

export async function GET(req: NextRequest) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;
  const q = req.nextUrl.searchParams.get('q')?.trim().toLowerCase() ?? '';

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('id, title, created_at, messages')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('GET sessions error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sessions = data ?? [];
  if (q) {
    sessions = sessions.filter((s) => sessionMatchesQuery(s, q));
  }

  const list = sessions.map(({ id, title, created_at }) => ({ id, title, created_at }));
  return NextResponse.json({ sessions: list });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;

  try {
    const { title, messages } = await req.json();
    const normalizedMessages = normalizeMessages(messages);

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ title, messages: normalizedMessages, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('POST session error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (err) {
    console.error('Unexpected POST error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;

  try {
    const { id, messages, title } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Session id required' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (title !== undefined) {
      const trimmed = String(title).trim();
      if (!trimmed) {
        return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
      }
      updates.title = trimmed.slice(0, 120);
    }

    if (messages !== undefined) {
      updates.messages = normalizeMessages(messages);
    }

    if (updates.title === undefined && updates.messages === undefined) {
      return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('chat_sessions')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
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
