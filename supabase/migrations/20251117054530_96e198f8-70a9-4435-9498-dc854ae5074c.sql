-- Créer une table pour les ebooks
CREATE TABLE IF NOT EXISTS public.ebooks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'PDF',
  file_size TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT,
  publish_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS sur la table ebooks
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;

-- Politique: Tout le monde peut voir les ebooks
CREATE POLICY "Anyone can view ebooks"
ON public.ebooks
FOR SELECT
USING (true);

-- Politique: Seuls les admins peuvent gérer les ebooks
CREATE POLICY "Admins can manage ebooks"
ON public.ebooks
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Créer le bucket storage pour les ebooks s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('ebooks', 'ebooks', false)
ON CONFLICT (id) DO NOTHING;

-- Politique: Seuls les utilisateurs authentifiés peuvent télécharger les ebooks
CREATE POLICY "Authenticated users can download ebooks"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'ebooks' AND
  auth.uid() IS NOT NULL
);

-- Politique: Les admins peuvent uploader des ebooks
CREATE POLICY "Admins can upload ebooks"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'ebooks' AND
  has_role(auth.uid(), 'admin')
);

-- Politique: Les admins peuvent mettre à jour les ebooks
CREATE POLICY "Admins can update ebooks"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'ebooks' AND
  has_role(auth.uid(), 'admin')
);

-- Politique: Les admins peuvent supprimer les ebooks
CREATE POLICY "Admins can delete ebooks"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'ebooks' AND
  has_role(auth.uid(), 'admin')
);