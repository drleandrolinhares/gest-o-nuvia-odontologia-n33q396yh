CREATE OR REPLACE FUNCTION public.is_master_user(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE user_id = user_uuid AND 'MASTER' = ANY(team_category)
  );
$$;

DROP POLICY IF EXISTS "Users can create rooms" ON public.chat_rooms;
CREATE POLICY "Users can create rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    (type = 'individual' OR (type = 'group' AND public.is_master_user(auth.uid())))
  );

CREATE POLICY "Users can delete participants" ON public.chat_participants
  FOR DELETE USING (
    public.is_master_user(auth.uid()) OR user_id = auth.uid()
  );
