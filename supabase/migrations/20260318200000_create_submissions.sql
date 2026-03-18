-- Submissions table — stores all agency onboarding form data
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Agency info
  agency_name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_state TEXT NOT NULL,
  address_zip TEXT NOT NULL,
  office_hours TEXT,
  years_in_business INT DEFAULT 0,

  -- Branding
  color_primary TEXT DEFAULT '#1A3A5C',
  color_secondary TEXT DEFAULT '#2E75B6',
  color_accent TEXT DEFAULT '#C9963B',
  logo_url TEXT,
  hero_image_url TEXT,

  -- Content
  about_text TEXT,
  highlights TEXT[],
  services TEXT[],
  carriers TEXT,
  team_members JSONB DEFAULT '[]'::jsonb,

  -- Social
  social_facebook TEXT,
  social_google TEXT,
  social_instagram TEXT,
  social_linkedin TEXT,
  social_yelp TEXT,
  google_maps_url TEXT,

  -- Domain
  domain_preferred TEXT,
  domain_owned BOOLEAN DEFAULT false,

  -- Notes
  notes TEXT,

  -- Admin / deployment
  status TEXT DEFAULT 'new',
  template TEXT,
  deployed_url TEXT,
  formspree_id TEXT,
  ga_measurement_id TEXT,
  service_areas TEXT[]
);

-- Storage bucket for onboarding uploads (logos, hero images, team photos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('onboarding', 'onboarding', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to the onboarding bucket
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'onboarding');

-- Allow public reads from the onboarding bucket
CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'onboarding');

-- Allow anonymous inserts to submissions (the onboarding form is public)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON submissions
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous reads (for the admin page — in production, lock this down)
CREATE POLICY "Allow anonymous reads" ON submissions
  FOR SELECT TO anon
  USING (true);

-- Allow anonymous updates (for admin status/template changes — lock down in production)
CREATE POLICY "Allow anonymous updates" ON submissions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);
