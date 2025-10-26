-- Create Assessment Results Table
--
-- This migration creates a table to store user assessment results with category-based scoring.
--
-- 1. New Tables
--    - assessment_results
--      - id (uuid, primary key) - Unique identifier for the assessment
--      - user_id (uuid, foreign key) - References auth.users
--      - completed_at (timestamptz) - When the assessment was completed
--      - categories (jsonb) - Category scores and feedback
--      - answers (jsonb) - Raw assessment answers
--      - created_at (timestamptz) - When the record was created
--      - updated_at (timestamptz) - When the record was last updated
--
-- 2. Security
--    - Enable RLS on assessment_results table
--    - Add policies for authenticated users to manage their own results
--
-- 3. Indexes
--    - Add index on user_id for faster queries
--    - Add index on completed_at for sorting

-- Create the assessment_results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL,
  categories jsonb NOT NULL DEFAULT '{}'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_completed_at ON assessment_results(completed_at DESC);

-- Enable Row Level Security
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own assessment results"
  ON assessment_results
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessment results"
  ON assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessment results"
  ON assessment_results
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assessment results"
  ON assessment_results
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
