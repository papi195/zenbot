import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { User } from '@supabase/supabase-js';

export async function requireUser(): Promise<
  | { supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>; user: User }
  | { response: NextResponse }
> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return { supabase, user };
}
