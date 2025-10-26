/*
  # SalesMind Database Schema

  1. New Tables
    - `user_profiles` - Extended user information and preferences
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `role` (text)
      - `company` (text)
      - `language_preference` (text, default 'en')
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `skills` - Mental skills and their definitions
      - `id` (text, primary key)
      - `name` (text)
      - `short_name` (text)
      - `description` (text)
      - `icon` (text)
      - `methodologies` (jsonb array)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `user_skills` - User's skill scores and progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `skill_id` (text, references skills)
      - `current_score` (integer, default 0)
      - `initial_score` (integer, default 0)
      - `last_updated` (timestamp)
    
    - `drills` - Training exercises and their metadata
      - `id` (text, primary key)
      - `skill_id` (text, references skills)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `component` (text)
      - `duration_minutes` (integer)
      - `difficulty_level` (text, default 'beginner')
      - `created_at` (timestamp)
    
    - `assessments` - Assessment sessions
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `completed_at` (timestamp)
      - `total_questions` (integer)
      - `answers_data` (jsonb)
      - `calculated_scores` (jsonb)
    
    - `drill_completions` - Individual drill completion records
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `drill_id` (text, references drills)
      - `skill_id` (text, references skills)
      - `completed_at` (timestamp)
      - `duration_seconds` (integer)
      - `score` (integer)
      - `completion_data` (jsonb)
    
    - `user_progress` - Daily/weekly progress tracking
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `date` (date)
      - `drills_completed` (integer, default 0)
      - `total_time_minutes` (integer, default 0)
      - `skills_practiced` (text array)
      - `streak_count` (integer, default 0)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for reading public skill and drill data

  3. Indexes
    - Add indexes for common query patterns
    - Optimize for user-specific data retrieval
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text DEFAULT 'Sales Representative',
  company text,
  language_preference text DEFAULT 'en' CHECK (language_preference IN ('en', 'ru')),
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '🧠',
  methodologies jsonb DEFAULT '[]'::jsonb,
  category text DEFAULT 'general',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  current_score integer DEFAULT 0 CHECK (current_score >= 0 AND current_score <= 100),
  initial_score integer DEFAULT 0 CHECK (initial_score >= 0 AND initial_score <= 100),
  last_updated timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

-- Create drills table
CREATE TABLE IF NOT EXISTS drills (
  id text PRIMARY KEY,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  type text DEFAULT 'form' CHECK (type IN ('form', 'timer', 'interactive', 'tracking')),
  component text NOT NULL,
  duration_minutes integer DEFAULT 5 CHECK (duration_minutes > 0),
  difficulty_level text DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  total_questions integer NOT NULL DEFAULT 0,
  answers_data jsonb DEFAULT '{}'::jsonb,
  calculated_scores jsonb DEFAULT '{}'::jsonb,
  assessment_version text DEFAULT '1.0'
);

-- Create drill_completions table
CREATE TABLE IF NOT EXISTS drill_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  drill_id text NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  duration_seconds integer DEFAULT 0 CHECK (duration_seconds >= 0),
  score integer CHECK (score >= 0 AND score <= 100),
  completion_data jsonb DEFAULT '{}'::jsonb
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  drills_completed integer DEFAULT 0 CHECK (drills_completed >= 0),
  total_time_minutes integer DEFAULT 0 CHECK (total_time_minutes >= 0),
  skills_practiced text[] DEFAULT '{}',
  streak_count integer DEFAULT 0 CHECK (streak_count >= 0),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- User Profiles: Users can read and update their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Skills: Public read access for all authenticated users
CREATE POLICY "Authenticated users can read skills"
  ON skills
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User Skills: Users can manage their own skill records
CREATE POLICY "Users can read own skills"
  ON user_skills
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drills: Public read access for all authenticated users
CREATE POLICY "Authenticated users can read drills"
  ON drills
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Assessments: Users can manage their own assessments
CREATE POLICY "Users can read own assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Drill Completions: Users can manage their own completions
CREATE POLICY "Users can read own drill completions"
  ON drill_completions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drill completions"
  ON drill_completions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Progress: Users can manage their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_drill_completions_user_id ON drill_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_drill_completions_completed_at ON drill_completions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_date ON user_progress(date DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, created_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    now()
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();