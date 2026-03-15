CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Allow all authenticated users to read roles" ON public.roles;
    DROP POLICY IF EXISTS "Master users can insert roles" ON public.roles;
    DROP POLICY IF EXISTS "Master users can update roles" ON public.roles;
    DROP POLICY IF EXISTS "Master users can delete roles" ON public.roles;
END $$;

CREATE POLICY "Allow all authenticated users to read roles" ON public.roles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Master users can insert roles" ON public.roles FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND is_master_user(auth.uid()));
CREATE POLICY "Master users can update roles" ON public.roles FOR UPDATE USING (auth.role() = 'authenticated' AND is_master_user(auth.uid()));
CREATE POLICY "Master users can delete roles" ON public.roles FOR DELETE USING (auth.role() = 'authenticated' AND is_master_user(auth.uid()));

DO $$
BEGIN
    INSERT INTO public.roles (name)
    SELECT DISTINCT role FROM (
        SELECT role FROM public.employees WHERE role IS NOT NULL AND role != ''
        UNION
        SELECT role FROM public.role_permissions WHERE role IS NOT NULL AND role != ''
        UNION
        SELECT unnest(ARRAY['SÓCIO', 'RECEPCIONISTA', 'TÉCNICO LAB', 'DENTISTA PARCEIRO'])
    ) r
    WHERE role IS NOT NULL AND role != ''
    ON CONFLICT (name) DO NOTHING;
END $$;

ALTER TABLE public.role_permissions
DROP CONSTRAINT IF EXISTS fk_role_permissions_role;

ALTER TABLE public.role_permissions
ADD CONSTRAINT fk_role_permissions_role FOREIGN KEY (role) REFERENCES public.roles(name) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE public.employees
DROP CONSTRAINT IF EXISTS fk_employees_role;

ALTER TABLE public.employees
ADD CONSTRAINT fk_employees_role FOREIGN KEY (role) REFERENCES public.roles(name) ON UPDATE CASCADE ON DELETE RESTRICT;
