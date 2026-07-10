
CREATE TABLE public.contest_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  referral_code text NOT NULL UNIQUE,
  referred_by text,
  entries_count integer NOT NULL DEFAULT 1,
  contest_slug text NOT NULL DEFAULT 'panier-naissance-quebec-2026',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contest_entries TO service_role;
GRANT SELECT ON public.contest_entries TO authenticated;

ALTER TABLE public.contest_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view contest entries"
  ON public.contest_entries FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_contest_entries_referral_code ON public.contest_entries(referral_code);
CREATE INDEX idx_contest_entries_referred_by ON public.contest_entries(referred_by);
