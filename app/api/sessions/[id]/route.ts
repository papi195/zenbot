import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/require-user';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;
  const { id } = await params;

  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('GET session by id error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ session: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;
  const { id } = await params;

  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('DELETE session error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
