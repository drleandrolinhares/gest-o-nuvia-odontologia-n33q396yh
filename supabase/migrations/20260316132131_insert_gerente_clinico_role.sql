DO $$
BEGIN
    INSERT INTO public.roles (name)
    VALUES ('GERENTE CLÍNICO')
    ON CONFLICT (name) DO NOTHING;
END $$;
