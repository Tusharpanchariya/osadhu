-- SQL Schema for Osadho Records Bookings and Payments (Latest version with optional artist details)
-- Copy and run this in your Supabase SQL Editor (https://database.new)

CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    booking_type TEXT DEFAULT 'range' NOT NULL, -- 'single' or 'range'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    time_slot TEXT, -- For single-day bookings (e.g., '09:00 AM - 03:00 PM')
    total_days INTEGER DEFAULT 1 NOT NULL,
    payment_method TEXT DEFAULT 'pay_later' NOT NULL, -- 'razorpay', 'paypal', 'pay_later'
    payment_status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'paid'
    payment_id TEXT,
    booking_reference TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'confirmed' NOT NULL, -- 'confirmed', 'cancelled'
    
    -- Optional fields
    instagram_url TEXT,
    spotify_url TEXT,
    youtube_url TEXT,
    soundcloud_url TEXT,
    website_url TEXT,
    phone_number TEXT,
    project_artist_name TEXT,
    message_notes TEXT
);

CREATE TABLE IF NOT EXISTS public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    date DATE UNIQUE NOT NULL,
    reason TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies
CREATE POLICY "Allow public select bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select blocked_dates" ON public.blocked_dates FOR SELECT USING (true);
