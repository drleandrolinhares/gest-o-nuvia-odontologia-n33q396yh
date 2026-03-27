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

-- 6. Alter auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS cargo_id UUID REFERENCES public.cargos(id) ON DELETE SET NULL;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS departamento_id UUID REFERENCES public.departamentos(id) ON DELETE SET NULL;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS cpf TEXT;

-- Adiciona constraint UNIQUE ao CPF caso não exista
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auth_users_cpf_key') THEN
    ALTER TABLE auth.users ADD CONSTRAINT auth_users_cpf_key UNIQUE (cpf);
  END IF;
END $$;

ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS data_nascimento DATE;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS pix_tipo TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS pix_numero TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS pix_banco TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS data_admissao DATE;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_permissoes_cargo_cargo_id ON public.permissoes_cargo(cargo_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_cargo_menu_id ON public.permissoes_cargo(menu_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_user_id ON public.permissoes_usuario(user_id);
CREATE INDEX IF NOT EXISTS idx_permissoes_usuario_menu_id ON public.permissoes_usuario(menu_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_cargo_id ON auth.users(cargo_id);
CREATE INDEX IF NOT EXISTS idx_auth_users_departamento_id ON auth.users(departamento_id);

-- Enable RLS
ALTER TABLE public.cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes_cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissoes_usuario ENABLE ROW LEVEL SECURITY;

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
