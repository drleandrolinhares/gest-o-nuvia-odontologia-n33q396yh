-- Cleanup script to remove specific orphaned user and ensure data integrity for samuelcantao.contato@gmail.com
DO $$
DECLARE
  v_user_id uuid;
  v_target_email text := 'samuelcantao.contato@gmail.com';
BEGIN
  -- Find the user ID in auth.users by email
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_target_email LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    -- Delete any employee records pointing to this user or email
    DELETE FROM public.employees WHERE email = v_target_email OR user_id = v_user_id;
    
    -- Delete the user from auth schema (this normally cascades to public.profiles)
    DELETE FROM auth.users WHERE id = v_user_id;
  ELSE
    -- Fallback: delete employees by email just in case the auth record is already gone
    DELETE FROM public.employees WHERE email = v_target_email;
  END IF;

  -- Ensure profiles are also cleaned up if they exist independently or cascade failed
  DELETE FROM public.profiles WHERE email = v_target_email;
END $$;
