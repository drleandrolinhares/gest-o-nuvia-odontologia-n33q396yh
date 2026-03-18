ALTER TABLE public.inventory ALTER COLUMN quantity TYPE numeric USING quantity::numeric;
ALTER TABLE public.inventory_movements ALTER COLUMN quantity TYPE numeric USING quantity::numeric;
ALTER TABLE public.inventory_temporary_outflows ALTER COLUMN quantity TYPE numeric USING quantity::numeric;

INSERT INTO public.inventory_settings (category, value, label)
SELECT 'package_type', val, val
FROM unnest(ARRAY['CAIXA', 'UNIDADE', 'FRASCO', 'PACOTE', 'SERINGA']) AS val
WHERE NOT EXISTS (
    SELECT 1 FROM public.inventory_settings 
    WHERE category = 'package_type' AND value = val
);

