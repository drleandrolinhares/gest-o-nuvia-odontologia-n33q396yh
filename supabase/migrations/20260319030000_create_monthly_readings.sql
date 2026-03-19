CREATE TABLE public.monthly_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  submission_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reference_month TEXT NOT NULL,
  material_name TEXT NOT NULL,
  main_learning TEXT NOT NULL,
  practical_application TEXT NOT NULL,
  observations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.monthly_readings ADD CONSTRAINT monthly_readings_user_month_key UNIQUE (user_id, reference_month);

ALTER TABLE public.monthly_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own monthly_readings" ON public.monthly_readings
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own or admins can view all monthly_readings" ON public.monthly_readings
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR is_admin_user(auth.uid()) OR is_master_user(auth.uid())
  );
