-- Redefine functions to remove dependency on the deleted employees table

CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name IN ('ADMIN', 'MASTER', 'DIRETORIA')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_master_user(user_uuid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name IN ('ADMIN', 'MASTER')
  );
$$;

-- Drop other functions that depend on the deleted employees table
DROP FUNCTION IF EXISTS public.calcular_aderencia_diaria(uuid, date);
DROP FUNCTION IF EXISTS public.get_monthly_ranking(integer, integer);
DROP FUNCTION IF EXISTS public.get_or_create_group_room(text, uuid);
DROP FUNCTION IF EXISTS public.sync_my_employee_record();
