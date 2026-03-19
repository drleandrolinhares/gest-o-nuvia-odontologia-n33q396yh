-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.employees
    WHERE user_id = user_uuid AND (
      role ILIKE '%admin%' OR role ILIKE '%diretor%' OR
      'ADMIN' = ANY(team_category) OR 'DIRETORIA' = ANY(team_category) OR 'MASTER' = ANY(team_category)
    )
  );
$$;

-- Table: hub_announcements
CREATE TABLE public.hub_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.hub_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read hub_announcements"
  ON public.hub_announcements FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert hub_announcements"
  ON public.hub_announcements FOR INSERT TO authenticated WITH CHECK (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

CREATE POLICY "Admins can update hub_announcements"
  ON public.hub_announcements FOR UPDATE TO authenticated USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

CREATE POLICY "Admins can delete hub_announcements"
  ON public.hub_announcements FOR DELETE TO authenticated USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

-- Table: hub_announcement_reads
CREATE TABLE public.hub_announcement_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  announcement_id UUID REFERENCES public.hub_announcements(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  points_earned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, announcement_id)
);

ALTER TABLE public.hub_announcement_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all hub_announcement_reads"
  ON public.hub_announcement_reads FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own hub_announcement_reads"
  ON public.hub_announcement_reads FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update hub_announcement_reads"
  ON public.hub_announcement_reads FOR UPDATE TO authenticated USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

CREATE POLICY "Admins can delete hub_announcement_reads"
  ON public.hub_announcement_reads FOR DELETE TO authenticated USING (is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

-- Table: hub_feedbacks
CREATE TABLE public.hub_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  excellent_content TEXT NOT NULL,
  improvement_content TEXT NOT NULL,
  points_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.hub_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedbacks or admins can read all"
  ON public.hub_feedbacks FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_admin_user(auth.uid()) OR is_master_user(auth.uid()));

CREATE POLICY "Users can insert own feedbacks"
  ON public.hub_feedbacks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- RPC for monthly ranking
CREATE OR REPLACE FUNCTION public.get_monthly_ranking(year_val INT, month_val INT)
RETURNS TABLE (
  user_id uuid,
  employee_id uuid,
  employee_name text,
  total_points bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    e.user_id,
    e.id as employee_id,
    e.name as employee_name,
    COALESCE(SUM(points.pts), 0) as total_points
  FROM public.employees e
  LEFT JOIN (
    SELECT user_id, points_earned as pts 
    FROM public.hub_announcement_reads 
    WHERE extract(year from read_at) = year_val AND extract(month from read_at) = month_val
    UNION ALL
    SELECT user_id, points_earned as pts 
    FROM public.hub_feedbacks 
    WHERE extract(year from created_at) = year_val AND extract(month from created_at) = month_val
  ) points ON points.user_id = e.user_id
  WHERE e.status != 'Desligado' AND e.user_id IS NOT NULL
  GROUP BY e.user_id, e.id, e.name
  ORDER BY total_points DESC, e.name ASC;
$$;
