-- Fix character varying length issues
ALTER TABLE public.reports 
ALTER COLUMN title TYPE TEXT,
ALTER COLUMN description TYPE TEXT,
ALTER COLUMN location TYPE TEXT,
ALTER COLUMN category TYPE TEXT,
ALTER COLUMN status TYPE TEXT;

ALTER TABLE public.missing_persons 
ALTER COLUMN name TYPE TEXT,
ALTER COLUMN location TYPE TEXT,
ALTER COLUMN description TYPE TEXT,
ALTER COLUMN status TYPE TEXT,
ALTER COLUMN reported_by TYPE TEXT,
ALTER COLUMN contact_phone TYPE TEXT,
ALTER COLUMN circumstances TYPE TEXT;

ALTER TABLE public.judicial_cases 
ALTER COLUMN title TYPE TEXT,
ALTER COLUMN description TYPE TEXT,
ALTER COLUMN court TYPE TEXT,
ALTER COLUMN judge_name TYPE TEXT,
ALTER COLUMN status TYPE TEXT,
ALTER COLUMN case_type TYPE TEXT,
ALTER COLUMN impact TYPE TEXT;

ALTER TABLE public.corruption_profiles 
ALTER COLUMN name TYPE TEXT,
ALTER COLUMN type TYPE TEXT,
ALTER COLUMN position TYPE TEXT,
ALTER COLUMN company_type TYPE TEXT,
ALTER COLUMN registration_number TYPE TEXT,
ALTER COLUMN county TYPE TEXT,
ALTER COLUMN status TYPE TEXT;

-- Add new table for protest casualties
CREATE TABLE IF NOT EXISTS public.protest_casualties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    status TEXT NOT NULL CHECK (status IN ('killed', 'abducted', 'missing', 'injured', 'found')),
    incident_date DATE NOT NULL,
    location TEXT NOT NULL,
    circumstances TEXT NOT NULL,
    protest_context TEXT, -- Finance Bill 2024, etc.
    family_contact TEXT,
    verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('verified', 'unverified', 'investigating')),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS and create policies
ALTER TABLE public.protest_casualties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.protest_casualties FOR SELECT USING (true);
CREATE POLICY "Allow anonymous inserts" ON public.protest_casualties FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_protest_casualties_status ON public.protest_casualties(status);
CREATE INDEX IF NOT EXISTS idx_protest_casualties_date ON public.protest_casualties(incident_date);
CREATE INDEX IF NOT EXISTS idx_protest_casualties_location ON public.protest_casualties(location);

-- Add update trigger
CREATE TRIGGER update_protest_casualties_updated_at 
BEFORE UPDATE ON public.protest_casualties 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
