-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  mood SMALLINT NOT NULL CHECK (mood >= 0 AND mood <= 4),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS daily_checkins_user_id_idx ON daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS daily_checkins_user_date_idx ON daily_checkins(user_id, checkin_date DESC);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own checkins" ON daily_checkins;
DROP POLICY IF EXISTS "Users can insert own checkins" ON daily_checkins;
DROP POLICY IF EXISTS "Users can update own checkins" ON daily_checkins;

CREATE POLICY "Users can view own checkins"
  ON daily_checkins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins"
  ON daily_checkins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins"
  ON daily_checkins FOR UPDATE
  USING (auth.uid() = user_id);
