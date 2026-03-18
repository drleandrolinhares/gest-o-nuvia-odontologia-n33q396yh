-- Add consumption_explanation column to inventory
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS consumption_explanation TEXT;

