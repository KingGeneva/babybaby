
CREATE TYPE public.parent_turn_task AS ENUM ('night_wake','feeding','diaper','bath','bedtime','other');

CREATE TABLE public.parent_turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id uuid NOT NULL,
  parent_id uuid NOT NULL,
  task public.parent_turn_task NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_parent_turns_child_occurred ON public.parent_turns(child_id, occurred_at DESC);
CREATE INDEX idx_parent_turns_parent ON public.parent_turns(parent_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.parent_turns TO authenticated;
GRANT ALL ON public.parent_turns TO service_role;

ALTER TABLE public.parent_turns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view turns"
  ON public.parent_turns FOR SELECT TO authenticated
  USING (public.is_family_member(child_id, auth.uid()));

CREATE POLICY "Family can insert turns"
  ON public.parent_turns FOR INSERT TO authenticated
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND parent_id = auth.uid());

CREATE POLICY "Owner can update own turn"
  ON public.parent_turns FOR UPDATE TO authenticated
  USING (parent_id = auth.uid());

CREATE POLICY "Owner or child owner can delete turn"
  ON public.parent_turns FOR DELETE TO authenticated
  USING (parent_id = auth.uid() OR EXISTS (SELECT 1 FROM public.child_profiles c WHERE c.id = child_id AND c.user_id = auth.uid()));
