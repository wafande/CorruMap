-- Enable Row Level Security
ALTER TABLE IF EXISTS public.reports ENABLE ROW LEVEL SECURITY;

-- Create missing_persons table
CREATE TABLE IF NOT EXISTS public.missing_persons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    last_seen DATE NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'found', 'investigating')),
    reported_by TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    circumstances TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create judicial_cases table
CREATE TABLE IF NOT EXISTS public.judicial_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    court TEXT NOT NULL,
    judge_name TEXT,
    amount BIGINT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'verified', 'dismissed')),
    case_type TEXT NOT NULL CHECK (case_type IN ('bribery', 'systematic_corruption', 'extortion', 'influence_peddling')),
    evidence TEXT[] DEFAULT '{}',
    impact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create corruption_profiles table
CREATE TABLE IF NOT EXISTS public.corruption_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('individual', 'company')),
    position TEXT,
    company_type TEXT,
    registration_number TEXT,
    county TEXT,
    cases_count INTEGER DEFAULT 1,
    total_amount BIGINT DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('under_investigation', 'convicted', 'blacklisted', 'cleared')),
    charges TEXT[] DEFAULT '{}',
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create finance_bills table
CREATE TABLE IF NOT EXISTS public.finance_bills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'proposed', 'passed', 'rejected')),
    key_provisions TEXT[] DEFAULT '{}',
    public_participation_status TEXT,
    controversy_level TEXT CHECK (controversy_level IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create constitutional_violations table
CREATE TABLE IF NOT EXISTS public.constitutional_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    article_violated TEXT NOT NULL,
    institution_involved TEXT,
    violation_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('reported', 'investigating', 'resolved', 'dismissed')),
    impact_level TEXT CHECK (impact_level IN ('low', 'medium', 'high', 'critical')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.missing_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judicial_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corruption_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finance_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.constitutional_violations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON public.missing_persons FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.judicial_cases FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.corruption_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.finance_bills FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.constitutional_violations FOR SELECT USING (true);

-- Create policies for anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON public.missing_persons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.judicial_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.corruption_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.finance_bills FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.constitutional_violations FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_missing_persons_status ON public.missing_persons(status);
CREATE INDEX IF NOT EXISTS idx_missing_persons_created_at ON public.missing_persons(created_at);
CREATE INDEX IF NOT EXISTS idx_judicial_cases_status ON public.judicial_cases(status);
CREATE INDEX IF NOT EXISTS idx_judicial_cases_case_type ON public.judicial_cases(case_type);
CREATE INDEX IF NOT EXISTS idx_corruption_profiles_type ON public.corruption_profiles(type);
CREATE INDEX IF NOT EXISTS idx_corruption_profiles_status ON public.corruption_profiles(status);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_missing_persons_updated_at BEFORE UPDATE ON public.missing_persons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_judicial_cases_updated_at BEFORE UPDATE ON public.judicial_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_corruption_profiles_updated_at BEFORE UPDATE ON public.corruption_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_finance_bills_updated_at BEFORE UPDATE ON public.finance_bills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_constitutional_violations_updated_at BEFORE UPDATE ON public.constitutional_violations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
