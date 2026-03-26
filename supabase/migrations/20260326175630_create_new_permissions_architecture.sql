-- 1. Create table roles
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create table sys_actions
CREATE TABLE IF NOT EXISTS public.sys_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create table role_permissions
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  action_id UUID NOT NULL REFERENCES public.sys_actions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT role_permissions_role_action_key UNIQUE (role_id, action_id)
);

-- 4. Create table user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_roles_user_role_key UNIQUE (user_id, role_id)
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_sys_actions_module ON public.sys_actions USING btree (module);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions USING btree (role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_action_id ON public.role_permissions USING btree (action_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles USING btree (role_id);

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sys_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Full access to authenticated users for administrative management)
DROP POLICY IF EXISTS "Allow all authenticated users on roles" ON public.roles;
CREATE POLICY "Allow all authenticated users on roles" ON public.roles 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on sys_actions" ON public.sys_actions;
CREATE POLICY "Allow all authenticated users on sys_actions" ON public.sys_actions 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on role_permissions" ON public.role_permissions;
CREATE POLICY "Allow all authenticated users on role_permissions" ON public.role_permissions 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all authenticated users on user_roles" ON public.user_roles;
CREATE POLICY "Allow all authenticated users on user_roles" ON public.user_roles 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
