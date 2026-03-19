CREATE TABLE public.innovation_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    problem_description TEXT NOT NULL,
    proposed_solution TEXT NOT NULL,
    implementation_details TEXT NOT NULL,
    perceived_results TEXT NOT NULL,
    evidence_url_or_desc TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.innovation_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own innovation_records" 
ON public.innovation_records FOR INSERT TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own or admins can view all innovation_records" 
ON public.innovation_records FOR SELECT TO authenticated 
USING (
    user_id = auth.uid() OR 
    public.is_admin_user(auth.uid()) OR 
    public.is_master_user(auth.uid())
);
