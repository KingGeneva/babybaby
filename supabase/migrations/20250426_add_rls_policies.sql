
-- Activer la RLS pour la table quiz_questions
ALTER TABLE IF EXISTS public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les questions de quiz
CREATE POLICY "Tout le monde peut lire les questions de quiz" 
ON public.quiz_questions 
FOR SELECT 
USING (true);

-- Politique pour permettre aux administrateurs d'insérer/modifier les questions de quiz
CREATE POLICY "Les administrateurs peuvent gérer les questions de quiz" 
ON public.quiz_questions 
FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@babybaby.app' OR email = 'admin@example.com'
  )
);

-- Activer la RLS pour la table quiz_responses
ALTER TABLE IF EXISTS public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre aux utilisateurs de voir leurs propres réponses
CREATE POLICY "Les utilisateurs peuvent voir leurs propres réponses" 
ON public.quiz_responses 
FOR SELECT 
USING (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs d'insérer leurs propres réponses
CREATE POLICY "Les utilisateurs peuvent ajouter leurs propres réponses" 
ON public.quiz_responses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Politique pour permettre aux utilisateurs connectés de créer des réponses
CREATE POLICY "Les utilisateurs peuvent créer des réponses"
ON public.quiz_responses
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre aux administrateurs de voir toutes les réponses
CREATE POLICY "Les administrateurs peuvent voir toutes les réponses" 
ON public.quiz_responses 
FOR SELECT 
USING (
  auth.role() = 'service_role' OR 
  auth.uid() IN (
    SELECT id FROM auth.users WHERE email = 'admin@babybaby.app' OR email = 'admin@example.com'
  )
);
