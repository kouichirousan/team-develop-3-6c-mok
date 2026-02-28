-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('General', 'Manager', 'Executive')),
  work_style TEXT CHECK (work_style IN ('集中モード', '雑談OK', '相談のります')),
  hobby_tags TEXT[] DEFAULT '{}',
  checkin_count INTEGER DEFAULT 0,
  early_bird_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins Table
CREATE TABLE IF NOT EXISTS checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  is_early_bird BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lunch Logs Table
CREATE TABLE IF NOT EXISTS lunch_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  lunch_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, partner_id, lunch_date)
);

-- Badges Table
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  is_displayed BOOLEAN DEFAULT FALSE
);

-- Weekly Rankings Table
CREATE TABLE IF NOT EXISTS weekly_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_date ON checkins(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_lunch_logs_requester ON lunch_logs(requester_id);
CREATE INDEX IF NOT EXISTS idx_lunch_logs_partner ON lunch_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_lunch_logs_date ON lunch_logs(lunch_date);
CREATE INDEX IF NOT EXISTS idx_badges_user_id ON badges(user_id);
CREATE INDEX IF NOT EXISTS idx_badges_type ON badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_weekly_rankings_week ON weekly_rankings(week_start);
CREATE INDEX IF NOT EXISTS idx_weekly_rankings_user ON weekly_rankings(user_id);

-- Function to update user stats on check-in
CREATE OR REPLACE FUNCTION update_user_checkin_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_profiles
  SET 
    checkin_count = checkin_count + 1,
    early_bird_points = CASE 
      WHEN NEW.is_early_bird THEN early_bird_points + 1 
      ELSE early_bird_points 
    END,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for check-in stats
DROP TRIGGER IF EXISTS trigger_update_checkin_stats ON checkins;
CREATE TRIGGER trigger_update_checkin_stats
AFTER INSERT ON checkins
FOR EACH ROW
EXECUTE FUNCTION update_user_checkin_stats();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles updated_at
DROP TRIGGER IF EXISTS trigger_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trigger_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE lunch_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_rankings ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for checkins
CREATE POLICY "Users can view all check-ins" ON checkins
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own check-ins" ON checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins" ON checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for lunch_logs
CREATE POLICY "Users can view lunch logs they're involved in" ON lunch_logs
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create lunch invitations" ON lunch_logs
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update lunch logs they're involved in" ON lunch_logs
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = partner_id);

-- Policies for badges
CREATE POLICY "Users can view all badges" ON badges
  FOR SELECT USING (true);

CREATE POLICY "Users can update own badges" ON badges
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for weekly_rankings
CREATE POLICY "Users can view all rankings" ON weekly_rankings
  FOR SELECT USING (true);

-- Insert sample data for demo
INSERT INTO user_profiles (id, name, department, role, work_style, hobby_tags, checkin_count, early_bird_points)
VALUES
  ('00000000-0000-0000-0000-000000000001', '田中太郎', '開発部', 'General', '集中モード', ARRAY['サウナ', '筋トレ', '投資'], 45, 12),
  ('00000000-0000-0000-0000-000000000002', '佐藤花子', 'デザイン部', 'Manager', '雑談OK', ARRAY['サウナ', 'アニメ', 'キャンプ'], 38, 8),
  ('00000000-0000-0000-0000-000000000003', '鈴木一郎', '営業部', 'General', '相談のります', ARRAY['激辛', '投資'], 32, 5),
  ('00000000-0000-0000-0000-000000000004', '高橋美咲', 'マーケティング部', 'General', '雑談OK', ARRAY['キャンプ', 'アニメ'], 28, 3),
  ('00000000-0000-0000-0000-000000000005', '山田健太', '開発部', 'Executive', '相談のります', ARRAY['筋トレ', '投資', 'サウナ'], 50, 20)
ON CONFLICT (id) DO NOTHING;
