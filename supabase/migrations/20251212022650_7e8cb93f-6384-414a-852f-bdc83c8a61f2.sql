-- Drop the insecure open INSERT policy
DROP POLICY IF EXISTS "System can insert auto-generated articles" ON public.auto_generated_articles;

-- Create a secure INSERT policy that restricts to admin users only
CREATE POLICY "Admins can insert auto-generated articles" 
ON public.auto_generated_articles
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));