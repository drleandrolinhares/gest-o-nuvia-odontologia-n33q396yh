ALTER TABLE public.app_settings
ADD COLUMN IF NOT EXISTS predicted_loss_percentage NUMERIC DEFAULT 20,
ADD COLUMN IF NOT EXISTS evaluation_factor_percentage NUMERIC DEFAULT 15;
