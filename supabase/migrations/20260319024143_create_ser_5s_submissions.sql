-- Create ser_5s_submissions table
CREATE TABLE public.ser_5s_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reference_week TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ser_5s_unique_week UNIQUE (user_id, reference_week)
);

-- Enable RLS
ALTER TABLE public.ser_5s_submissions ENABLE ROW LEVEL SECURITY;

-- Policies for table
CREATE POLICY "Users can view their own or admins can view all" 
ON public.ser_5s_submissions FOR SELECT TO authenticated
USING (
    user_id = auth.uid() OR 
    public.is_admin_user(auth.uid()) OR 
    public.is_master_user(auth.uid())
);

CREATE POLICY "Users can insert their own" 
ON public.ser_5s_submissions FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- Add bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ser-5s', 'ser-5s', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policies for bucket
CREATE POLICY "Ser 5s photos are public"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'ser-5s');

CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'ser-5s');
