UPDATE public.employees
SET access_level = 'ESTRATEGICO'
WHERE access_level = 'ADMINISTRATIVO';

UPDATE public.acessos
SET access_level = 'ESTRATEGICO'
WHERE access_level = 'ADMINISTRATIVO';

UPDATE public.employees
SET permissions = '{}'::jsonb
WHERE jsonb_typeof(permissions) = 'array';

