-- Add end_date to agenda for multi-day events
ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS end_date date;
UPDATE public.agenda SET end_date = date::date WHERE end_date IS NULL;

-- Strict RLS for agenda as requested (users see their own, admins see all)
DROP POLICY IF EXISTS "Allow all authenticated users" ON public.agenda;

CREATE POLICY "Agenda visibility" ON public.agenda
  FOR SELECT TO authenticated
  USING (
    assigned_to = (SELECT id::text FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR 
    assigned_to = 'none' OR
    assigned_to IS NULL OR
    requester_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR 
    is_master_user(auth.uid()) OR
    EXISTS (
       SELECT 1 FROM public.employees e 
       WHERE e.user_id = auth.uid() 
       AND ('ADMIN' = ANY(e.team_category) OR 'DIRETORIA' = ANY(e.team_category))
    )
  );

CREATE POLICY "Agenda insert" ON public.agenda FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Agenda update" ON public.agenda FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Agenda delete" ON public.agenda FOR DELETE TO authenticated USING (true);

-- Strict RLS for sac_records
DROP POLICY IF EXISTS "Allow all authenticated users on sac_records" ON public.sac_records;

CREATE POLICY "Sac visibility" ON public.sac_records
  FOR SELECT TO authenticated
  USING (
    responsible_employee_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR 
    receiving_employee_id = (SELECT id FROM public.employees WHERE user_id = auth.uid() LIMIT 1) OR
    is_master_user(auth.uid()) OR
    EXISTS (
       SELECT 1 FROM public.employees e 
       WHERE e.user_id = auth.uid() 
       AND ('ADMIN' = ANY(e.team_category) OR 'DIRETORIA' = ANY(e.team_category))
    )
  );

CREATE POLICY "Sac insert" ON public.sac_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Sac update" ON public.sac_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Sac delete" ON public.sac_records FOR DELETE TO authenticated USING (true);

