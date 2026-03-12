ALTER TABLE public.employees
ALTER COLUMN team_category DROP DEFAULT;

ALTER TABLE public.employees
ALTER COLUMN team_category TYPE text[] USING CASE 
  WHEN team_category IS NULL OR team_category = '' THEN ARRAY['COLABORADOR']::text[] 
  ELSE ARRAY[team_category]::text[] 
END;

ALTER TABLE public.employees
ALTER COLUMN team_category SET DEFAULT ARRAY['COLABORADOR']::text[];
