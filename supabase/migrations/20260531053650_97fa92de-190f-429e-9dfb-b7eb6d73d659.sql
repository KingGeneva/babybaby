-- Phase 2: Engagement features

-- 1. Article favorites
CREATE TABLE public.article_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, article_id)
);
GRANT SELECT, INSERT, DELETE ON public.article_favorites TO authenticated;
GRANT ALL ON public.article_favorites TO service_role;
ALTER TABLE public.article_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own favorites" ON public.article_favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users add own favorites" ON public.article_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own favorites" ON public.article_favorites FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_article_favorites_user ON public.article_favorites(user_id);

-- 2. Article comments
CREATE TABLE public.article_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  article_id TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  parent_id UUID REFERENCES public.article_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);
GRANT SELECT ON public.article_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.article_comments TO authenticated;
GRANT ALL ON public.article_comments TO service_role;
ALTER TABLE public.article_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON public.article_comments FOR SELECT USING (true);
CREATE POLICY "Auth users can comment" ON public.article_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own comments" ON public.article_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users or admins delete comments" ON public.article_comments FOR DELETE TO authenticated USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_article_comments_article ON public.article_comments(article_id, created_at DESC);
CREATE TRIGGER trg_article_comments_updated BEFORE UPDATE ON public.article_comments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Newsletter segmentation: add baby age fields
ALTER TABLE public.newsletter_subscribers
  ADD COLUMN IF NOT EXISTS baby_birth_date DATE,
  ADD COLUMN IF NOT EXISTS expected_due_date DATE,
  ADD COLUMN IF NOT EXISTS age_segment TEXT;

-- 4. Quiz results
CREATE TABLE public.quiz_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT,
  quiz_slug TEXT NOT NULL,
  result_key TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quiz_results TO anon;
GRANT SELECT, INSERT ON public.quiz_results TO authenticated;
GRANT ALL ON public.quiz_results TO service_role;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit quiz" ON public.quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own quiz results" ON public.quiz_results FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all quiz" ON public.quiz_results FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_quiz_results_created ON public.quiz_results(created_at DESC);