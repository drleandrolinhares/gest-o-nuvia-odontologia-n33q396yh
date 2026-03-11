CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'name', 'Colaborador'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'Ativo',
  hire_date TIMESTAMPTZ,
  salary TEXT,
  vacation_days_taken INTEGER DEFAULT 0,
  vacation_days_total INTEGER DEFAULT 30,
  vacation_due_date TIMESTAMPTZ,
  email TEXT,
  phone TEXT,
  agenda_access TEXT DEFAULT 'VIEW_ONLY',
  permissions JSONB DEFAULT '["dashboard"]'::jsonb,
  access_level TEXT DEFAULT 'OPERACIONAL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  package_cost NUMERIC DEFAULT 0,
  storage_location TEXT,
  package_type TEXT,
  items_per_box INTEGER DEFAULT 1,
  min_stock INTEGER DEFAULT 0,
  quantity INTEGER DEFAULT 0,
  specialty TEXT,
  entry_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,
  brand TEXT,
  last_brand TEXT,
  last_value NUMERIC DEFAULT 0,
  notes TEXT,
  barcode TEXT,
  purchase_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  assigned_to TEXT,
  involves_third_party BOOLEAN DEFAULT false,
  third_party_details TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.acessos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  login TEXT NOT NULL,
  pass TEXT NOT NULL,
  instructions TEXT,
  access_level TEXT DEFAULT 'OPERACIONAL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  cnpj TEXT NOT NULL DEFAULT '',
  website TEXT,
  has_special_negotiation BOOLEAN DEFAULT false,
  negotiation_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  tasks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@nuvia.com',
    crypt('admin123', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin Souza Filho"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '',
    NULL, '', '', ''
  );

  INSERT INTO public.employees (user_id, name, role, department, access_level, permissions)
  VALUES (admin_id, 'DR. SOUZA FILHO (ADMIN)', 'Administrador', 'Diretoria', 'ADMINISTRATIVO', '["dashboard", "agenda", "acessos", "rh", "estoque", "configuracoes", "auditoria"]'::jsonb);
END $$;
