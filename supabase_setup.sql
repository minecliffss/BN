-- ================================================================
-- BN MEDIA HUB — COMPLETE SUPABASE SETUP
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================


-- ════════════════════════════════════════════════════════════════
-- STEP 1: CREATE ADMIN USER (Auth)
-- ════════════════════════════════════════════════════════════════
-- Change the email and password below before running.
-- ⚠️  If the user already exists, the ON CONFLICT clause skips silently.

-- Required extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'admin@bnmediahub.com';   -- ← change this
  admin_pass  TEXT := 'BN@Studio2024';           -- ← change this
BEGIN
  -- Only insert if this email doesn't already exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN

    -- 1. Insert into auth.users
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password,
      email_confirmed_at, last_sign_in_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      admin_email,
      crypt(admin_pass, gen_salt('bf')),
      NOW(), NOW(),
      '{"provider":"email","providers":["email"]}', '{}',
      NOW(), NOW(),
      '', '', '', ''
    );

    -- 2. Insert into auth.identities (required for email/password login)
    INSERT INTO auth.identities (
      id, user_id, provider_id,
      identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(),
      new_user_id,
      admin_email,
      json_build_object('sub', new_user_id::text, 'email', admin_email),
      'email',
      NOW(), NOW(), NOW()
    );

    RAISE NOTICE 'Admin user created: %', admin_email;
  ELSE
    RAISE NOTICE 'User already exists, skipping: %', admin_email;
  END IF;
END $$;

-- ✅ Login credentials:
--    Email   : admin@bnmediahub.com
--    Password: BN@Studio2024


-- ════════════════════════════════════════════════════════════════
-- STEP 2: CREATE / PATCH TABLES
-- ════════════════════════════════════════════════════════════════

-- Portfolio Works (powers "Selected Works" section on website)
CREATE TABLE IF NOT EXISTS public.portfolio_works (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL DEFAULT 'Weddings',
  location    TEXT,
  photos      INTEGER     DEFAULT 0,
  status      TEXT        DEFAULT 'Delivered',
  img_url     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Patch: add/fix any columns that may differ from old script versions
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS location   TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS photos     INTEGER     DEFAULT 0;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS status     TEXT        DEFAULT 'Delivered';
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS img_url    TEXT;
ALTER TABLE public.portfolio_works ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
-- Drop NOT NULL if it was accidentally set on img_url
ALTER TABLE public.portfolio_works ALTER COLUMN img_url DROP NOT NULL;

-- Reviews (powers the scrolling testimonials on website)
CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL,
  type        TEXT,
  avatar      TEXT,
  text        TEXT        NOT NULL,
  rating      INTEGER     DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Patch: add any columns that may be missing
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS type       TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS avatar     TEXT;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS rating     INTEGER DEFAULT 5;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Hero Settings (singleton row — controls the hero section on the website)
CREATE TABLE IF NOT EXISTS public.hero_settings (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  headline     TEXT        DEFAULT 'Capturing Moments That Last Forever',
  subtitle     TEXT        DEFAULT 'Professional Wedding & Event Photography based in Kerala.',
  rating_text  TEXT        DEFAULT '5.0 Rating • 88 Happy Clients',
  whatsapp_url TEXT        DEFAULT '#',
  main_image   TEXT,
  image_2      TEXT,
  image_3      TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Patch for existing installs
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS headline     TEXT DEFAULT 'Capturing Moments That Last Forever';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS subtitle     TEXT;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS rating_text  TEXT DEFAULT '5.0 Rating • 88 Happy Clients';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS whatsapp_url TEXT DEFAULT '#';
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS main_image   TEXT;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS image_2      TEXT;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS image_3      TEXT;
ALTER TABLE public.hero_settings ADD COLUMN IF NOT EXISTS updated_at   TIMESTAMPTZ DEFAULT NOW();


-- ════════════════════════════════════════════════════════════════
-- STEP 3: ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════

-- Enable RLS on both tables
ALTER TABLE public.portfolio_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;

-- Drop any old policies (safe to re-run)
DROP POLICY IF EXISTS "Public read portfolio_works"          ON public.portfolio_works;
DROP POLICY IF EXISTS "Authenticated insert portfolio_works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Authenticated update portfolio_works" ON public.portfolio_works;
DROP POLICY IF EXISTS "Authenticated delete portfolio_works" ON public.portfolio_works;

DROP POLICY IF EXISTS "Public read reviews"          ON public.reviews;
DROP POLICY IF EXISTS "Authenticated insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated update reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated delete reviews" ON public.reviews;

-- ── portfolio_works policies ──
CREATE POLICY "Public read portfolio_works"
  ON public.portfolio_works FOR SELECT
  USING (true);                          -- anyone can read (website displays them)

CREATE POLICY "Authenticated insert portfolio_works"
  ON public.portfolio_works FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);   -- must be logged in

CREATE POLICY "Authenticated update portfolio_works"
  ON public.portfolio_works FOR UPDATE
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated delete portfolio_works"
  ON public.portfolio_works FOR DELETE
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ── reviews policies ──
CREATE POLICY "Public read reviews"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert reviews"
  ON public.reviews FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated update reviews"
  ON public.reviews FOR UPDATE
  USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated delete reviews"
  ON public.reviews FOR DELETE
  USING ((SELECT auth.uid()) IS NOT NULL);

-- ── hero_settings policies ──
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hero_settings"          ON public.hero_settings;
DROP POLICY IF EXISTS "Authenticated update hero_settings" ON public.hero_settings;
DROP POLICY IF EXISTS "Authenticated insert hero_settings" ON public.hero_settings;

CREATE POLICY "Public read hero_settings"
  ON public.hero_settings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated insert hero_settings"
  ON public.hero_settings FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated update hero_settings"
  ON public.hero_settings FOR UPDATE
  USING ((SELECT auth.uid()) IS NOT NULL);


-- ════════════════════════════════════════════════════════════════
-- STEP 4: STORAGE BUCKET FOR IMAGE UPLOADS
-- ════════════════════════════════════════════════════════════════

-- Create the bucket (public = images are accessible via URL without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-images',
  'portfolio-images',
  true,
  5242880,                                          -- 5 MB max per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public              = true,
  file_size_limit     = 5242880,
  allowed_mime_types  = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Storage RLS policies
DROP POLICY IF EXISTS "Public read portfolio-images"    ON storage.objects;
DROP POLICY IF EXISTS "Auth upload portfolio-images"    ON storage.objects;
DROP POLICY IF EXISTS "Auth update portfolio-images"    ON storage.objects;
DROP POLICY IF EXISTS "Auth delete portfolio-images"    ON storage.objects;

-- Anyone can VIEW images (needed for website display)
CREATE POLICY "Public read portfolio-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

-- Only logged-in admin can UPLOAD
CREATE POLICY "Auth upload portfolio-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images' AND (SELECT auth.uid()) IS NOT NULL);

-- Only logged-in admin can UPDATE (overwrite)
CREATE POLICY "Auth update portfolio-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images' AND (SELECT auth.uid()) IS NOT NULL);

-- Only logged-in admin can DELETE
CREATE POLICY "Auth delete portfolio-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images' AND (SELECT auth.uid()) IS NOT NULL);


-- ════════════════════════════════════════════════════════════════
-- STEP 5: SEED INITIAL DATA (only if tables are empty)
-- ════════════════════════════════════════════════════════════════

INSERT INTO public.portfolio_works (title, category, location, photos, status, img_url)
SELECT v.title, v.category, v.location, v.photos, v.status, v.img_url
FROM (VALUES
  ('Classic Wedding',   'Weddings',  'Kerala, India', 342, 'Delivered', 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2940&auto=format&fit=crop'),
  ('Beach Engagement',  'Events',    'Thrissur',      128, 'In Edit',   'https://images.unsplash.com/photo-1544078755-9a845116bb6e?q=80&w=2940&auto=format&fit=crop'),
  ('Bridal Portrait',   'Portraits', 'Studio',         56, 'Delivered', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2940&auto=format&fit=crop'),
  ('Cinematic Moments', 'Events',    'Outdoor Event', 215, 'Review',    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2940&auto=format&fit=crop'),
  ('Modern Rituals',    'Weddings',  'Kochi',         180, 'Delivered', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop')
) AS v(title, category, location, photos, status, img_url)
WHERE NOT EXISTS (SELECT 1 FROM public.portfolio_works LIMIT 1);

INSERT INTO public.reviews (name, type, avatar, text, rating)
SELECT v.name, v.type, v.avatar, v.text, v.rating
FROM (VALUES
  ('Anjali Menon',   'Wedding Client',    'A', '"Great photographer and fantastic photos. The team was incredibly patient and captured every single detail of our wedding perfectly. Highly recommended!"', 5),
  ('Rahul Nair',     'Pre-Wedding Shoot', 'R', '"Friendly and professional team. They made us feel so comfortable during our pre-wedding shoot. The cinematic video was beyond our expectations."',    5),
  ('Sneha & Family', 'Family Portraits',  'S', '"Amazing experience with BN MEDIA HUB. Very punctual, premium quality prints, and an eye for the perfect shot. Will definitely hire them again."',     5)
) AS v(name, type, avatar, text, rating)
WHERE NOT EXISTS (SELECT 1 FROM public.reviews LIMIT 1);


-- ════════════════════════════════════════════════════════════════
-- ✅ SETUP COMPLETE
-- Login at: http://localhost:5173/login
-- Email   : admin@bnmediahub.com
-- Password: BN@Studio2024
-- ════════════════════════════════════════════════════════════════
