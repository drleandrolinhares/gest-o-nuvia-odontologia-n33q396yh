-- Add points_earned column to ser_5s_submissions table
ALTER TABLE public.ser_5s_submissions 
ADD COLUMN points_earned INTEGER NOT NULL DEFAULT 0;
