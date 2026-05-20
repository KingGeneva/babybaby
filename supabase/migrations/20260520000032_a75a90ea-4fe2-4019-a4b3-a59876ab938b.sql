
-- =========================================================
-- Phase 0: BabyBaby foundations
-- =========================================================

-- ENUMs
CREATE TYPE public.family_role AS ENUM ('parent', 'caregiver', 'grandparent');
CREATE TYPE public.feeding_type AS ENUM ('breast_left', 'breast_right', 'bottle_formula', 'bottle_breastmilk', 'solid');
CREATE TYPE public.diaper_type AS ENUM ('wet', 'dirty', 'mixed', 'dry');
CREATE TYPE public.sleep_quality AS ENUM ('great', 'ok', 'restless', 'bad');
CREATE TYPE public.baby_event_type AS ENUM ('milestone', 'photo', 'note', 'voice', 'measurement', 'first', 'memory');
CREATE TYPE public.parent_mood AS ENUM ('great', 'ok', 'tired', 'stressed', 'overwhelmed');

-- =========================================================
-- family_members: who can access which child
-- =========================================================
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role public.family_role NOT NULL DEFAULT 'parent',
  invited_by UUID,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (child_id, user_id)
);
CREATE INDEX idx_family_members_user ON public.family_members(user_id);
CREATE INDEX idx_family_members_child ON public.family_members(child_id);

-- Security definer helper to avoid recursive RLS
CREATE OR REPLACE FUNCTION public.is_family_member(_child_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members
    WHERE child_id = _child_id AND user_id = _user_id
  )
  OR EXISTS (
    SELECT 1 FROM public.child_profiles
    WHERE id = _child_id AND user_id = _user_id
  );
$$;

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view family"
  ON public.family_members FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));

CREATE POLICY "Child owners can add members"
  ON public.family_members FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.child_profiles
    WHERE id = child_id AND user_id = auth.uid()
  ));

CREATE POLICY "Child owners can remove members"
  ON public.family_members FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.child_profiles
    WHERE id = child_id AND user_id = auth.uid()
  ));

-- =========================================================
-- feedings
-- =========================================================
CREATE TABLE public.feedings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  logged_by UUID NOT NULL,
  type public.feeding_type NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  amount_ml NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_feedings_child_started ON public.feedings(child_id, started_at DESC);
ALTER TABLE public.feedings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view feedings" ON public.feedings FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can insert feedings" ON public.feedings FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND logged_by = auth.uid());
CREATE POLICY "Family can update feedings" ON public.feedings FOR UPDATE
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can delete feedings" ON public.feedings FOR DELETE
  USING (public.is_family_member(child_id, auth.uid()));

-- =========================================================
-- diapers
-- =========================================================
CREATE TABLE public.diapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  logged_by UUID NOT NULL,
  type public.diaper_type NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_diapers_child_occurred ON public.diapers(child_id, occurred_at DESC);
ALTER TABLE public.diapers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view diapers" ON public.diapers FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can insert diapers" ON public.diapers FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND logged_by = auth.uid());
CREATE POLICY "Family can update diapers" ON public.diapers FOR UPDATE
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can delete diapers" ON public.diapers FOR DELETE
  USING (public.is_family_member(child_id, auth.uid()));

-- =========================================================
-- sleeps
-- =========================================================
CREATE TABLE public.sleeps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  logged_by UUID NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ,
  quality public.sleep_quality,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_sleeps_child_started ON public.sleeps(child_id, started_at DESC);
ALTER TABLE public.sleeps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view sleeps" ON public.sleeps FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can insert sleeps" ON public.sleeps FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND logged_by = auth.uid());
CREATE POLICY "Family can update sleeps" ON public.sleeps FOR UPDATE
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can delete sleeps" ON public.sleeps FOR DELETE
  USING (public.is_family_member(child_id, auth.uid()));

-- =========================================================
-- baby_events: unified timeline
-- =========================================================
CREATE TABLE public.baby_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  created_by UUID NOT NULL,
  type public.baby_event_type NOT NULL,
  title TEXT,
  body TEXT,
  media_url TEXT,
  media_type TEXT,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_baby_events_child_occurred ON public.baby_events(child_id, occurred_at DESC);
ALTER TABLE public.baby_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view events" ON public.baby_events FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can insert events" ON public.baby_events FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Family can update events" ON public.baby_events FOR UPDATE
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can delete events" ON public.baby_events FOR DELETE
  USING (public.is_family_member(child_id, auth.uid()));

-- =========================================================
-- parent_wellness
-- =========================================================
CREATE TABLE public.parent_wellness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sleep_hours NUMERIC,
  hydration_glasses INTEGER,
  mood public.parent_mood,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_parent_wellness_user_logged ON public.parent_wellness(user_id, logged_at DESC);
ALTER TABLE public.parent_wellness ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own wellness" ON public.parent_wellness FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================================================
-- memory_capsules
-- =========================================================
CREATE TABLE public.memory_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  media_url TEXT,
  unlock_at DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_memory_capsules_child ON public.memory_capsules(child_id);
ALTER TABLE public.memory_capsules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family can view unlocked capsules" ON public.memory_capsules FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()) AND unlock_at <= CURRENT_DATE);
CREATE POLICY "Creator can always view own capsules" ON public.memory_capsules FOR SELECT
  USING (created_by = auth.uid());
CREATE POLICY "Family can create capsules" ON public.memory_capsules FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()) AND created_by = auth.uid());
CREATE POLICY "Creator can delete capsules" ON public.memory_capsules FOR DELETE
  USING (created_by = auth.uid());

-- =========================================================
-- Triggers
-- =========================================================
CREATE TRIGGER trg_feedings_updated_at BEFORE UPDATE ON public.feedings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_sleeps_updated_at BEFORE UPDATE ON public.sleeps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_baby_events_updated_at BEFORE UPDATE ON public.baby_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create family_members entry when a child profile is created
CREATE OR REPLACE FUNCTION public.add_owner_as_family_member()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.family_members (child_id, user_id, role, invited_by)
  VALUES (NEW.id, NEW.user_id, 'parent', NEW.user_id)
  ON CONFLICT (child_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_child_profile_owner_membership
  AFTER INSERT ON public.child_profiles
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_family_member();

-- Backfill existing children
INSERT INTO public.family_members (child_id, user_id, role, invited_by)
SELECT id, user_id, 'parent'::public.family_role, user_id
FROM public.child_profiles
ON CONFLICT (child_id, user_id) DO NOTHING;

-- =========================================================
-- Extend existing tables' RLS to allow family members
-- =========================================================
CREATE POLICY "Family can view child profile" ON public.child_profiles FOR SELECT
  USING (public.is_family_member(id, auth.uid()));

CREATE POLICY "Family can view measurements" ON public.growth_measurements FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can insert measurements" ON public.growth_measurements FOR INSERT
  WITH CHECK (public.is_family_member(child_id, auth.uid()));

CREATE POLICY "Family can view milestones" ON public.milestones FOR SELECT
  USING (public.is_family_member(child_id, auth.uid()));
CREATE POLICY "Family can update milestones" ON public.milestones FOR UPDATE
  USING (public.is_family_member(child_id, auth.uid()));

-- =========================================================
-- Realtime
-- =========================================================
ALTER TABLE public.feedings REPLICA IDENTITY FULL;
ALTER TABLE public.diapers REPLICA IDENTITY FULL;
ALTER TABLE public.sleeps REPLICA IDENTITY FULL;
ALTER TABLE public.baby_events REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.feedings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diapers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sleeps;
ALTER PUBLICATION supabase_realtime ADD TABLE public.baby_events;

-- =========================================================
-- Storage bucket for memories (photos, voice notes)
-- =========================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('memories', 'memories', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Family can view memory files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'memories'
    AND public.is_family_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
CREATE POLICY "Family can upload memory files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'memories'
    AND public.is_family_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
CREATE POLICY "Family can delete memory files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'memories'
    AND public.is_family_member(((storage.foldername(name))[1])::uuid, auth.uid())
  );
