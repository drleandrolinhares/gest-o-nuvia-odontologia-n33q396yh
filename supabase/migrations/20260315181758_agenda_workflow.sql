-- Ensure the agenda table has the correct columns for the two-step workflow
ALTER TABLE public.agenda 
ADD COLUMN IF NOT EXISTS requester_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS received_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
