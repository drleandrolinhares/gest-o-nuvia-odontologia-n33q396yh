ALTER TABLE public.employees
DROP COLUMN IF EXISTS permissions,
DROP COLUMN IF EXISTS system_profiles,
DROP COLUMN IF EXISTS access_level,
DROP COLUMN IF EXISTS access_schedule,
DROP COLUMN IF EXISTS agenda_access;

