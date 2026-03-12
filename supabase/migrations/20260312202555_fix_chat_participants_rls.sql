-- Fix infinite recursion in chat_participants SELECT policy

-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON public.chat_participants;

-- Create a security definer function to bypass RLS when fetching user's rooms
CREATE OR REPLACE FUNCTION public.get_auth_user_rooms()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT room_id FROM public.chat_participants WHERE user_id = auth.uid();
$$;

-- Create the new non-recursive policy using the security definer function
CREATE POLICY "Users can view participants in their rooms" ON public.chat_participants
  FOR SELECT USING (
    room_id IN (SELECT public.get_auth_user_rooms())
  );
