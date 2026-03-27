-- 1. Create cargos
CREATE TABLE IF NOT EXISTS public.cargos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create departamentos
CREATE TABLE IF NOT EXISTS public.departamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create menus_sistema
CREATE TABLE IF NOT EXISTS public.menus_sistema (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  rota TEXT,
  icone TEXT,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create permissoes_cargo
CREATE TABLE IF NOT EXISTS public.permissoes_cargo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cargo_id UUID NOT NULL REFERENCES public.cargos(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES public.menus_sistema(id) ON DELETE CASCADE,
  pode_ver BOOLEAN NOT NULL DEFAULT false,
  pode_editar BOOLEAN NOT NULL DEFAULT false,
  pode_deletar BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT permissoes_cargo_cargo_menu_key UNIQUE(cargo_id, menu_id)
);

-- 5. Create permissoes_usuario
CREATE TABLE IF NOT EXISTS public.permissoes_usuario (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  menu_id UUID NOT NULL REFERENCES public.menus_sistema(id) ON DELETE CASCADE,
  pode_ver BOOLEAN NOT NULL DEFAULT false,
  pode_editar BOOLEAN NOT NULL DEFAULT false,
  pode_deletar BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT permissoes_usuario_user_menu_key UNIQUE(user_id, menu_id)
);

-- 6. Create profiles instead of altering auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  nome TEXT,
  cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL,
  departamento_id UUID REFERENCES public.departamentos(id) ON DELETE SET NULL,
  cpf TEXT UNIQUE,
  telefone TEXT,
  data_nascimento DATE,
  pix_tipo TEXT,
  pix_numero TEXT,
  pix_banco TEXT,
  data_admissao DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_permissoes_cargo_cargo_id ON public.permissoes_cargo(cargo_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_cargo_menu_id ON public.permissoes_cargo(menu_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_user_id ON public.permissoes_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_menu_id ON public.permissoes_usuario(menu_id);
CREATE INDEX IF NOT EXISTS idx_profiles_cargo_id ON public.profiles(cargo_id);
CREATE INDEX IF NOT EXISTS idx_profiles_departamento_id ON public.profiles(departamento_id);

-- Enable RLS
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes_cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes_usuario ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
DROP POLICY IF EXISTS "Allow all authenticated users on cargos" ON public.cargos;
CREATE POLICY "Allow all authenticated users on cargos" ON public.cargos FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on departamentos" ON public.departamentos;
CREATE POLICY "Allow all authenticated users on departamentos" ON public.departamentos FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on menus_sistema" ON public.menus_sistema;
CREATE POLICY "Allow all authenticated users on menus_sistema" ON public.menus_sistema FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on permissoes_cargo" ON public.permissoes_cargo;
CREATE POLICY "Allow all authenticated users on permissoes_cargo" ON public.permissoes_cargo FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on permissoes_usuario" ON public.permissoes_usuario;
CREATE POLICY "Allow all authenticated users on permissoes_usuario" ON public.permissoes_usuario FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on profiles" ON public.profiles;
CREATE POLICY "Allow all authenticated users on profiles" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

