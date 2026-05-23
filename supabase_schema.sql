-- =============================================
-- Mehndi Mahal - Supabase Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── USERS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ── MEHENDI DESIGNS ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.mehendi_designs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  category       TEXT NOT NULL CHECK (category IN ('Bridal','Arabic','Festival','Engagement','Traditional','Modern','Minimal')),
  description    TEXT,
  image_url      TEXT,
  price_per_head NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration       TEXT,
  rating         NUMERIC(3,2) DEFAULT 4.5 CHECK (rating >= 0 AND rating <= 5),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mehendi_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view designs" ON public.mehendi_designs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage designs" ON public.mehendi_designs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ── BOOKINGS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.users(id) ON DELETE SET NULL,
  design_id       UUID REFERENCES public.mehendi_designs(id) ON DELETE SET NULL,
  customer_name   TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT NOT NULL,
  address         TEXT NOT NULL,
  booking_date    DATE NOT NULL,
  booking_time    TIME NOT NULL,
  customer_count  INTEGER NOT NULL DEFAULT 1 CHECK (customer_count > 0),
  total_price     NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected','completed')),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all bookings" ON public.bookings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ── SEED DATA ────────────────────────────────────
INSERT INTO public.mehendi_designs (title, category, description, image_url, price_per_head, duration, rating) VALUES
('Royal Bridal Full Hand', 'Bridal', 'Opulent full-hand bridal patterns with intricate peacock and lotus motifs. Perfect for your special wedding day.', 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=800&q=80', 3500, '4-6 hrs', 4.9),
('Arabic Floral', 'Arabic', 'Flowing Arabic floral patterns with bold lines for a modern look', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', 1200, '1-2 hrs', 4.8),
('Festival Special', 'Festival', 'Vibrant festival-ready mehendi patterns for Eid, Diwali, Navratri', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', 800, '45-60 min', 4.7),
('Engagement Glam', 'Engagement', 'Elegant engagement mehendi with heart motifs and hidden initials', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80', 2200, '2-3 hrs', 4.8),
('Traditional Rajasthani', 'Traditional', 'Authentic Rajasthani patterns with heavy coverage and fine details', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', 1800, '3-4 hrs', 4.9),
('Modern Minimalist', 'Modern', 'Clean geometric patterns with contemporary design sensibility', 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=800&q=80', 600, '20-30 min', 4.6),
('Minimal Finger Art', 'Minimal', 'Delicate finger and tip mehendi for a subtle, chic look', 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=800&q=80', 400, '15-20 min', 4.5),
('Dulhan Special Package', 'Bridal', 'Complete bridal package — both hands and feet with hidden groom name', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', 5000, '6-8 hrs', 5.0);
