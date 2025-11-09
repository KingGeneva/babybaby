-- Add published_id column to track published articles in storage
ALTER TABLE public.auto_generated_articles 
ADD COLUMN published_id BIGINT;