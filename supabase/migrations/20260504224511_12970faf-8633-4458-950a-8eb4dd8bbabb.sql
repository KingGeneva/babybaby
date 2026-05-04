-- Enable cron + http extensions for scheduled auto-publishing
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Drop the obsolete validation queue table (auto-publish goes straight to storage now)
DROP TABLE IF EXISTS public.auto_generated_articles CASCADE;