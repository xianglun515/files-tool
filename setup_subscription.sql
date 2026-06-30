CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan text DEFAULT 'free' NOT NULL CHECK (plan IN ('free', 'pro')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS ai_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used_date date DEFAULT CURRENT_DATE NOT NULL,
  count int DEFAULT 0 NOT NULL,
  UNIQUE(user_id, used_date)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY sub_select ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY sub_insert ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY sub_update ON subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY usage_select ON ai_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY usage_insert ON ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY usage_update ON ai_usage FOR UPDATE USING (auth.uid() = user_id);
