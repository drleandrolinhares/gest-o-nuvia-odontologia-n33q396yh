-- Add DELETE policy to hub_feedbacks table for admins
CREATE POLICY "Admins can delete hub_feedbacks"
  ON public.hub_feedbacks
  FOR DELETE TO authenticated
  USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));
