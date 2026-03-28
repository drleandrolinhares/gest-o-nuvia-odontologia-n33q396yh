-- Fix chat participants policy by using an optimized security definer function without search_path issues

-- 1. Drop the existing policy
DROP POLICY IF EXISTS "Users can view participants in their rooms" ON public.chat_participants;

-- 2. Create an optimized scalar function to check room participation
-- We omit SET search_path = '' as it was causing the function to crash when resolving auth.uid() or types
CREATE OR REPLACE FUNCTION public.is_room_participant(checking_room_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.chat_participants 
    WHERE room_id = checking_room_id AND user_id = auth.uid()
  );
$$;

-- 3. Create the new non-recursive policy
CREATE POLICY "Users can view participants in their rooms" ON public.chat_participants
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR public.is_room_participant(room_id)
  );

-- 4. Clean up the broken function from the previous migration
DROP FUNCTION IF EXISTS public.get_auth_user_rooms();
