-- Add no_system_access to employees if it doesn't exist
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS no_system_access BOOLEAN DEFAULT false;

-- Add must_change_password to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- Ensure RLS is enabled for profiles and employees
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

-- Create safe read policies for profiles and employees so ProtectedRoute doesn't fail
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'authenticated_select_profiles'
    ) THEN
        CREATE POLICY "authenticated_select_profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'authenticated_select_employees'
    ) THEN
        CREATE POLICY "authenticated_select_employees" ON public.employees FOR SELECT TO authenticated USING (true);
    END IF;
END
$$;
