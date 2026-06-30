-- 1. Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  username text,
  created_at timestamptz DEFAULT now()
);

-- 2. Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- 3. Backfill existing users into user_profiles
INSERT INTO user_profiles (id, email, username, created_at)
SELECT id, email, raw_user_meta_data->>'username', created_at
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Set the provided email as admin
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = '2465315338@qq.com'
ON CONFLICT (user_id) DO NOTHING;

-- 5. Trigger for new user signups to populate user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, username, created_at)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'username', new.created_at);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. RLS Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read all profiles, users can read their own
DROP POLICY IF EXISTS profiles_admin_select ON user_profiles;
CREATE POLICY profiles_admin_select ON user_profiles FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM admin_users) OR auth.uid() = id
);
-- Admins can read the admin list, users can check if they are admin
DROP POLICY IF EXISTS admin_users_select ON admin_users;
CREATE POLICY admin_users_select ON admin_users FOR SELECT USING (true);

-- Update existing table policies to allow admin access
-- Works table
DROP POLICY IF EXISTS "Users can insert their own works" ON works;
DROP POLICY IF EXISTS "Users can view their own works" ON works;
DROP POLICY IF EXISTS "Users can update their own works" ON works;
DROP POLICY IF EXISTS "Users can delete their own works" ON works;
DROP POLICY IF EXISTS "Enable all actions for users based on user_id and admins" ON works;

CREATE POLICY "Enable all actions for users based on user_id and admins" ON works
FOR ALL USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admin_users)
);

-- Subscriptions table
DROP POLICY IF EXISTS sub_select ON subscriptions;
DROP POLICY IF EXISTS sub_insert ON subscriptions;
DROP POLICY IF EXISTS sub_update ON subscriptions;
DROP POLICY IF EXISTS "Enable all actions for users and admins on subscriptions" ON subscriptions;

CREATE POLICY "Enable all actions for users and admins on subscriptions" ON subscriptions
FOR ALL USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admin_users)
);

-- ai_usage table
DROP POLICY IF EXISTS usage_select ON ai_usage;
DROP POLICY IF EXISTS usage_insert ON ai_usage;
DROP POLICY IF EXISTS usage_update ON ai_usage;
DROP POLICY IF EXISTS "Enable all actions for users and admins on ai_usage" ON ai_usage;

CREATE POLICY "Enable all actions for users and admins on ai_usage" ON ai_usage
FOR ALL USING (
  auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM admin_users)
);
