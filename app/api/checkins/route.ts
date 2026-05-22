import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/require-user';
import { computeStreaks, lastNDays } from '@/lib/streaks';

export type CheckinRow = {
  checkin_date: string;
  mood: number;
  note: string | null;
};

function todayLocal(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function GET() {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;

  const { data: allCheckins, error: allError } = await supabase
    .from('daily_checkins')
    .select('checkin_date, mood, note')
    .eq('user_id', user.id)
    .order('checkin_date', { ascending: false });

  if (allError) {
    console.error('GET checkins error:', allError);
    return NextResponse.json({ error: allError.message }, { status: 500 });
  }

  const rows = (allCheckins ?? []) as CheckinRow[];
  const dates = rows.map((r) => r.checkin_date);
  const { current, best } = computeStreaks(dates);

  const weekDates = lastNDays(7);
  const byDate = new Map(rows.map((r) => [r.checkin_date, r]));
  const recent = weekDates.map((date) => {
    const row = byDate.get(date);
    return row ? { date, mood: row.mood, note: row.note } : { date, mood: null, note: null };
  });

  const today = todayLocal();
  const todayRow = byDate.get(today) ?? null;

  return NextResponse.json({
    today: todayRow
      ? { date: today, mood: todayRow.mood, note: todayRow.note }
      : null,
    streak: current,
    bestStreak: best,
    recent,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireUser();
  if ('response' in auth) return auth.response;

  const { supabase, user } = auth;

  try {
    const body = await req.json();
    const mood = body.mood;
    const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : null;

    if (typeof mood !== 'number' || mood < 0 || mood > 4 || !Number.isInteger(mood)) {
      return NextResponse.json({ error: 'Mood must be 0–4' }, { status: 400 });
    }

    const checkin_date = todayLocal();

    const { data, error } = await supabase
      .from('daily_checkins')
      .upsert(
        {
          user_id: user.id,
          checkin_date,
          mood,
          note: note || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,checkin_date' }
      )
      .select('checkin_date, mood, note')
      .single();

    if (error) {
      console.error('POST checkin error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: allCheckins } = await supabase
      .from('daily_checkins')
      .select('checkin_date')
      .eq('user_id', user.id);

    const dates = (allCheckins ?? []).map((r: { checkin_date: string }) => r.checkin_date);
    const { current, best } = computeStreaks(dates);

    return NextResponse.json({
      today: data,
      streak: current,
      bestStreak: best,
    });
  } catch (err) {
    console.error('Unexpected checkin POST error:', err);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
