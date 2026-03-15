-- Drop pricing triggers and functions
DROP TRIGGER IF EXISTS on_pricing_history_created ON public.pricing_history;
DROP FUNCTION IF EXISTS public.handle_pricing_history_insert();

-- Drop pricing related tables
DROP TABLE IF EXISTS public.price_stages CASCADE;
DROP TABLE IF EXISTS public.price_list CASCADE;
DROP TABLE IF EXISTS public.pricing_history CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;

-- Clean up any generated agenda items related to pricing history
DELETE FROM public.agenda 
WHERE type = 'REVISÃO' 
AND title LIKE 'REVISÃO DE PRECIFICAÇÃO%';
