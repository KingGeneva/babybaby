-- Create articles storage bucket for admin article management
INSERT INTO storage.buckets (id, name, public) 
VALUES ('articles', 'articles', false)
ON CONFLICT (id) DO NOTHING;

-- Allow admins to manage articles bucket
CREATE POLICY "Admins can upload to articles bucket"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'articles' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update articles bucket"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'articles' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete from articles bucket"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'articles' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can read from articles bucket"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'articles' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow public read access to published article images
CREATE POLICY "Public can view article images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'articles' 
  AND (storage.foldername(name))[1] = 'images'
);