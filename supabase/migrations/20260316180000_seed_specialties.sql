DO $
DECLARE
    spec_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM public.inventory_settings WHERE category = 'SPECIALTY') INTO spec_exists;
    IF NOT spec_exists THEN
        INSERT INTO public.inventory_settings (category, value) VALUES
        ('SPECIALTY', 'CLÍNICA GERAL'),
        ('SPECIALTY', 'ORTODONTIA'),
        ('SPECIALTY', 'IMPLANTODONTIA'),
        ('SPECIALTY', 'ENDODONTIA'),
        ('SPECIALTY', 'ODONTOPEDIATRIA'),
        ('SPECIALTY', 'PRÓTESE');
    END IF;
END $;

