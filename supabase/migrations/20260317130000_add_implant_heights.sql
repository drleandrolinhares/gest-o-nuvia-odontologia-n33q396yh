DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.inventory_settings WHERE category = 'ALTURA_IMPLANTE' LIMIT 1) THEN
        INSERT INTO public.inventory_settings (category, value) VALUES
        ('ALTURA_IMPLANTE', '4'),
        ('ALTURA_IMPLANTE', '5'),
        ('ALTURA_IMPLANTE', '5.5'),
        ('ALTURA_IMPLANTE', '6'),
        ('ALTURA_IMPLANTE', '7'),
        ('ALTURA_IMPLANTE', '8'),
        ('ALTURA_IMPLANTE', '8.5'),
        ('ALTURA_IMPLANTE', '9'),
        ('ALTURA_IMPLANTE', '10'),
        ('ALTURA_IMPLANTE', '11.5'),
        ('ALTURA_IMPLANTE', '13'),
        ('ALTURA_IMPLANTE', '15');
    END IF;
END $$;
