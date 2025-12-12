-- Create rate limiting table for contact form
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- No public access - only service role can read/write (used by edge function)
-- This is intentional - the table is only accessed by the edge function with service role key

-- Create index for efficient rate limit queries
CREATE INDEX idx_contact_rate_limits_ip_created 
ON public.contact_rate_limits (ip_address, created_at DESC);

-- Auto-cleanup old rate limit entries (older than 24 hours)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limits
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create newsletter rate limiting table
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create index for efficient rate limit queries
CREATE INDEX idx_newsletter_rate_limits_ip_created 
ON public.newsletter_rate_limits (ip_address, created_at DESC);

-- Update newsletter_subscribers policy to be more restrictive
-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- Create a more secure insert policy that still allows public subscription
-- but requires the email to match basic validation pattern
CREATE POLICY "Public can subscribe with valid email" 
ON public.newsletter_subscribers
FOR INSERT
WITH CHECK (
  email IS NOT NULL 
  AND email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'
  AND length(email) <= 255
);