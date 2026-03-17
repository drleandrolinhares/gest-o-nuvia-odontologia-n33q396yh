-- Cleanup script to remove specific orphaned user and ensure data integrity
DO $$
DECLARE
  orphan_id uuid;
BEGIN
  -- Find the user ID in auth.users by email
  SELECT id INTO orphan_id FROM auth.users WHERE email = 'samuelcantao.contato@gmail.com' LIMIT 1;

  IF orphan_id IS NOT NULL THEN
    -- Delete any partial employee records pointing to this user or email
    DELETE FROM public.employees WHERE email = 'samuelcantao.contato@gmail.com' OR user_id = orphan_id;
    
    -- Delete the user (this cascades to public.profiles)
    DELETE FROM auth.users WHERE id = orphan_id;
  ELSE
    -- Fallback: delete employees by email just in case the auth record is already gone
    DELETE FROM public.employees WHERE email = 'samuelcantao.contato@gmail.com';
  END IF;
END $$;
