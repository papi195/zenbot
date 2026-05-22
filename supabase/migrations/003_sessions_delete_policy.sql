-- Allow users to delete their own chat sessions
DROP POLICY IF EXISTS "Users can delete own sessions" ON chat_sessions;

CREATE POLICY "Users can delete own sessions"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id);
