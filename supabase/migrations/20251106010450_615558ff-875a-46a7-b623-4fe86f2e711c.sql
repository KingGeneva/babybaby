-- Create table for auto-generated articles with approval workflow
CREATE TABLE IF NOT EXISTS public.auto_generated_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  reading_time INTEGER NOT NULL DEFAULT 5,
  source_trend TEXT, -- The trend that triggered this article
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by uuid REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  image_url TEXT,
  author TEXT NOT NULL DEFAULT 'IA Assistant',
  CONSTRAINT valid_reading_time CHECK (reading_time > 0)
);

-- Enable RLS
ALTER TABLE public.auto_generated_articles ENABLE ROW LEVEL SECURITY;

-- Admins can view all auto-generated articles
CREATE POLICY "Admins can view all auto-generated articles"
ON public.auto_generated_articles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update auto-generated articles (approve/reject/publish)
CREATE POLICY "Admins can update auto-generated articles"
ON public.auto_generated_articles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert auto-generated articles (via edge function)
CREATE POLICY "System can insert auto-generated articles"
ON public.auto_generated_articles
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Admins can delete auto-generated articles
CREATE POLICY "Admins can delete auto-generated articles"
ON public.auto_generated_articles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for efficient querying by status
CREATE INDEX idx_auto_articles_status ON public.auto_generated_articles(status);
CREATE INDEX idx_auto_articles_created_at ON public.auto_generated_articles(created_at DESC);