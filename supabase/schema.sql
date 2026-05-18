-- Coin World / Mundo Moneda — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('adult', 'tutor')),
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NOT NULL,
  gender char(1) NOT NULL CHECK (gender IN ('M', 'F')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id uuid REFERENCES users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date NOT NULL,
  gender char(1) NOT NULL CHECK (gender IN ('M', 'F')),
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  lesson_id integer NOT NULL,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE buildings_unlocked (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid REFERENCES children(id) ON DELETE CASCADE,
  building_id text NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings_unlocked ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only read/write their own rows
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Children: tutors can CRUD their own children
CREATE POLICY "Tutors can view their children"
  ON children FOR SELECT USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can insert children"
  ON children FOR INSERT WITH CHECK (auth.uid() = tutor_id);

CREATE POLICY "Tutors can update their children"
  ON children FOR UPDATE USING (auth.uid() = tutor_id);

CREATE POLICY "Tutors can delete their children"
  ON children FOR DELETE USING (auth.uid() = tutor_id);

-- Progress: accessible via child's tutor
CREATE POLICY "Tutors can view child progress"
  ON progress FOR SELECT
  USING (EXISTS (SELECT 1 FROM children WHERE children.id = progress.child_id AND children.tutor_id = auth.uid()));

CREATE POLICY "Tutors can insert child progress"
  ON progress FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM children WHERE children.id = progress.child_id AND children.tutor_id = auth.uid()));

CREATE POLICY "Tutors can update child progress"
  ON progress FOR UPDATE
  USING (EXISTS (SELECT 1 FROM children WHERE children.id = progress.child_id AND children.tutor_id = auth.uid()));

-- Buildings: accessible via child's tutor
CREATE POLICY "Tutors can view child buildings"
  ON buildings_unlocked FOR SELECT
  USING (EXISTS (SELECT 1 FROM children WHERE children.id = buildings_unlocked.child_id AND children.tutor_id = auth.uid()));

CREATE POLICY "Tutors can insert child buildings"
  ON buildings_unlocked FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM children WHERE children.id = buildings_unlocked.child_id AND children.tutor_id = auth.uid()));
