-- Run this in Supabase SQL Editor to add the columns needed for the admin dashboard.
-- These columns track template selection, deployment status, and deployment settings.

-- Template selection
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS template TEXT;

-- Deployment tracking
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS deployed_url TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS formspree_id TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS ga_measurement_id TEXT;

-- Service areas for SEO (nearby cities)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS service_areas TEXT[];

-- Ensure status column exists with default
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

-- Update any existing rows without a status
UPDATE submissions SET status = 'new' WHERE status IS NULL;

-- Deployment automation tracking
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS vercel_project_id TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS vercel_deployment_id TEXT;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS deployed_at TIMESTAMPTZ;
