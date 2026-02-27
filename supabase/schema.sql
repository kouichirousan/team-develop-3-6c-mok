-- User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Check-ins
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at TIMESTAMPTZ,
  is_early_bird BOOLEAN DEFAULT FALSE,
  points_earned INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lunch Logs
CREATE TABLE lunch_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  lunch_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, partner_id, lunch_date)
);

-- Badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  is_displayed BOOLEAN DEFAULT FALSE
);

-- Weekly Rankings (materialized view)
CREATE TABLE weekly_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start)
);

-- Indexes
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_date ON checkins(checked_in_at);
CREATE INDEX idx_lunch_logs_requester ON lunch_logs(requester_id);
CREATE INDEX idx_lunch_logs_partner ON lunch_logs(partner_id);
CREATE INDEX idx_badges_user_id ON badges(user_id);
CREATE INDEX idx_weekly_rankings_week ON weekly_rankings(week_start);

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

CREATE TRIGGER trigger_update_checkin_stats
AFTER INSERT ON checkins
FOR EACH ROW
EXECUTE FUNCTION update_user_checkin_stats();
