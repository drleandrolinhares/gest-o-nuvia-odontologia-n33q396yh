-- Drop dependent triggers to avoid errors when dropping tables
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TRIGGER IF EXISTS audit_role_permissions ON public.role_permissions;
DROP FUNCTION IF EXISTS public.trg_audit_role_permissions();
DROP TRIGGER IF EXISTS on_role_created ON public.roles;
DROP FUNCTION IF EXISTS public.trg_auto_init_role_permissions();

DROP FUNCTION IF EXISTS public."checkUserPermission"(uuid, uuid, uuid, uuid, uuid);
DROP FUNCTION IF EXISTS public.check_user_permission(uuid, uuid, uuid, uuid, uuid);

-- Drop tables as requested by the user
DROP TABLE IF EXISTS public.user_permissions CASCADE;
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.roles CASCADE;
DROP TABLE IF EXISTS public.sys_permissions CASCADE;
DROP TABLE IF EXISTS public.sys_profiles CASCADE;
DROP TABLE IF EXISTS public.sys_modules CASCADE;
DROP TABLE IF EXISTS public.sys_pages CASCADE;
DROP TABLE IF EXISTS public.sys_actions CASCADE;
DROP TABLE IF EXISTS public.sys_tabs CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Re-create sync_my_employee_record to not use profiles
CREATE OR REPLACE FUNCTION public.sync_my_employee_record()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_user_id UUID;
  v_email TEXT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN RETURN; END IF;
  
  SELECT email INTO v_email FROM auth.users WHERE id = v_user_id;
  
  IF v_email IS NOT NULL AND v_email != '' THEN
    UPDATE public.employees 
    SET user_id = v_user_id
    WHERE lower(email) = lower(v_email) AND (user_id IS NULL OR user_id != v_user_id);
  END IF;
END;
$function$;

-- Reload PostgREST schema cache and reactivate replication cleanly
NOTIFY pgrst, 'reload schema';
