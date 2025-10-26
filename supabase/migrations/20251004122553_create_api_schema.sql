/*
  # SalesMind API Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `full_name` (text)
      - `role` (text)
      - `company` (text)
      - `language_preference` (text, default 'en')
      - `onboarding_completed` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `skills`
      - `id` (text, primary key)
      - `name` (text)
      - `short_name` (text)
      - `description` (text)
      - `icon` (text)
      - `methodologies` (text[])
      - `category` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `user_skills`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `skill_id` (text, references skills)
      - `current_score` (integer, 0-100)
      - `initial_score` (integer, 0-100)
      - `last_updated` (timestamptz)
      - `created_at` (timestamptz)
    
    - `drills`
      - `id` (text, primary key)
      - `skill_id` (text, references skills)
      - `title` (text)
      - `description` (text)
      - `type` (text)
      - `component` (text)
      - `duration_minutes` (integer)
      - `difficulty_level` (text)
      - `is_active` (boolean, default true)
      - `created_at` (timestamptz)
    
    - `drill_completions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `drill_id` (text, references drills)
      - `skill_id` (text, references skills)
      - `completed_at` (timestamptz)
      - `duration_seconds` (integer)
      - `score` (integer, 0-100)
      - `completion_data` (jsonb)
    
    - `assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `completed_at` (timestamptz)
      - `total_questions` (integer)
      - `answers_data` (jsonb)
      - `calculated_scores` (jsonb)
      - `assessment_version` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for reading public skill and drill data

  3. Indexes
    - Add indexes for frequently queried columns
    - Composite indexes for user-specific queries
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text,
  company text,
  language_preference text DEFAULT 'en' CHECK (language_preference IN ('en', 'ru')),
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id text PRIMARY KEY,
  name text NOT NULL,
  short_name text NOT NULL,
  description text,
  icon text,
  methodologies text[],
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active skills"
  ON skills FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create user_skills table
CREATE TABLE IF NOT EXISTS user_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  current_score integer CHECK (current_score >= 0 AND current_score <= 100),
  initial_score integer CHECK (initial_score >= 0 AND initial_score <= 100),
  last_updated timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own skills"
  ON user_skills FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills"
  ON user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own skills"
  ON user_skills FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create drills table
CREATE TABLE IF NOT EXISTS drills (
  id text PRIMARY KEY,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('form', 'timer', 'interactive', 'tracking')),
  component text NOT NULL,
  duration_minutes integer,
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE drills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active drills"
  ON drills FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create drill_completions table
CREATE TABLE IF NOT EXISTS drill_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_id text NOT NULL REFERENCES drills(id) ON DELETE CASCADE,
  skill_id text NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  duration_seconds integer NOT NULL CHECK (duration_seconds >= 0),
  score integer CHECK (score >= 0 AND score <= 100),
  completion_data jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE drill_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own drill completions"
  ON drill_completions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drill completions"
  ON drill_completions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  total_questions integer,
  answers_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  calculated_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  assessment_version text DEFAULT '1.0'
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_drills_skill_id ON drills(skill_id);
CREATE INDEX IF NOT EXISTS idx_drill_completions_user_id ON drill_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_drill_completions_drill_id ON drill_completions(drill_id);
CREATE INDEX IF NOT EXISTS idx_drill_completions_completed_at ON drill_completions(completed_at);
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_completed_at ON assessments(completed_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at'
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
