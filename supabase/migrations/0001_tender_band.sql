/*
  # Initial Schema Setup for OptiFlow

  1. New Tables
    - `profiles`
      - Stores user profile information
      - Links to Supabase auth.users
    - `companies`
      - Stores company information
    - `workflows`
      - Stores workflow data and analysis
    - `benchmarks`
      - Stores industry benchmarks
    - `recommendations`
      - Stores AI-generated recommendations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'team_member')),
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create companies table
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NOT NULL,
  size text NOT NULL,
  country text NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workflows table
CREATE TABLE workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'archived')),
  data jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create benchmarks table
CREATE TABLE benchmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  industry text NOT NULL,
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  company_size text NOT NULL,
  country text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status text NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own company data"
  ON companies
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own company data"
  ON companies
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own company data"
  ON companies
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read workflows for their company"
  ON workflows
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM companies
    WHERE companies.id = workflows.company_id
    AND companies.user_id = auth.uid()
  ));

CREATE POLICY "Users can read benchmarks"
  ON benchmarks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read recommendations for their workflows"
  ON recommendations
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workflows
    JOIN companies ON companies.id = workflows.company_id
    WHERE workflows.id = recommendations.workflow_id
    AND companies.user_id = auth.uid()
  ));