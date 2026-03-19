-- Update the get_monthly_ranking function to include SER 5S points
CREATE OR REPLACE FUNCTION public.get_monthly_ranking(year_val integer, month_val integer)
 RETURNS TABLE(user_id uuid, employee_id uuid, employee_name text, total_points bigint)
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
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
    
    UNION ALL
    
    SELECT user_id, points_earned as pts
    FROM public.ser_5s_submissions
    WHERE extract(year from submission_date) = year_val AND extract(month from submission_date) = month_val

  ) points ON points.user_id = e.user_id
  WHERE e.status != 'Desligado' AND e.user_id IS NOT NULL
  GROUP BY e.user_id, e.id, e.name
  ORDER BY total_points DESC, e.name ASC;
$function$;
