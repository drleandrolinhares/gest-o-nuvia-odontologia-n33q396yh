-- Remove access_level from acessos if it exists
ALTER TABLE public.acessos DROP COLUMN IF EXISTS access_level;

-- Drop legacy permission tables if they somehow still exist
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.system_profiles CASCADE;

-- Just to be safe, drop any columns from employees that might still be around related to permissions
ALTER TABLE public.employees
DROP COLUMN IF EXISTS permissions,
DROP COLUMN IF EXISTS system_profiles,
DROP COLUMN IF EXISTS access_level,
DROP COLUMN IF EXISTS access_schedule,
DROP COLUMN IF EXISTS agenda_access;
