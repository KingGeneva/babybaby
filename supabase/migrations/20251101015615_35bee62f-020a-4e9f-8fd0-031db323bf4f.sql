-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create child_profiles table
CREATE TABLE IF NOT EXISTS public.child_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  gender TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.child_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own children"
  ON public.child_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own children"
  ON public.child_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own children"
  ON public.child_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own children"
  ON public.child_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Create growth_measurements table
CREATE TABLE IF NOT EXISTS public.growth_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  measurement_date DATE NOT NULL,
  height_cm DECIMAL,
  weight_kg DECIMAL,
  head_cm DECIMAL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.growth_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view measurements for their children"
  ON public.growth_measurements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = growth_measurements.child_id
      AND child_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create measurements for their children"
  ON public.growth_measurements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = growth_measurements.child_id
      AND child_profiles.user_id = auth.uid()
    )
  );

-- Create milestones table
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.child_profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  age_months INTEGER NOT NULL,
  achieved BOOLEAN DEFAULT FALSE,
  achieved_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milestones for their children"
  ON public.milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = milestones.child_id
      AND child_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create milestones for their children"
  ON public.milestones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = milestones.child_id
      AND child_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update milestones for their children"
  ON public.milestones FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.child_profiles
      WHERE child_profiles.id = milestones.child_id
      AND child_profiles.user_id = auth.uid()
    )
  );

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (TRUE);

-- Create quiz_type enum
DO $$ BEGIN
  CREATE TYPE public.quiz_type AS ENUM (
    'personnalite',
    'connaissance',
    'developpement',
    'nutrition',
    'sommeil'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_type public.quiz_type NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON public.quiz_questions FOR SELECT
  USING (TRUE);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS public.quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quiz_type public.quiz_type NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER,
  detailed_results JSONB,
  recommendations JSONB,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz responses"
  ON public.quiz_responses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz responses"
  ON public.quiz_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create ebook_downloads table
CREATE TABLE IF NOT EXISTS public.ebook_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_title TEXT NOT NULL,
  email TEXT NOT NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.ebook_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record ebook downloads"
  ON public.ebook_downloads FOR INSERT
  WITH CHECK (TRUE);

-- Create ebooks storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for ebooks
CREATE POLICY "Anyone can view ebooks"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'ebooks');

CREATE POLICY "Authenticated users can upload ebooks"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'ebooks' AND auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_child_profiles_updated_at
  BEFORE UPDATE ON public.child_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();