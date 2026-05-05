
-- Make 'articles' bucket public and allow public read on all article files & images
UPDATE storage.buckets SET public = true WHERE id = 'articles';

DROP POLICY IF EXISTS "Public can view article images" ON storage.objects;
DROP POLICY IF EXISTS "Public can read articles bucket" ON storage.objects;

CREATE POLICY "Public can read articles bucket"
ON storage.objects
FOR SELECT
USING (bucket_id = 'articles');
