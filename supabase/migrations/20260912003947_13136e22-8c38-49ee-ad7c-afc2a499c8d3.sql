CREATE TABLE public.rebuild_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT 'article_published',
  source TEXT NOT NULL DEFAULT 'auto-publish-article',
  article_id BIGINT,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  http_status INTEGER,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_rebuild_requests_created_at ON public.rebuild_requests (created_at DESC);

GRANT SELECT ON public.rebuild_requests TO authenticated;
GRANT ALL ON public.rebuild_requests TO service_role;

ALTER TABLE public.rebuild_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view rebuild requests"
ON public.rebuild_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));