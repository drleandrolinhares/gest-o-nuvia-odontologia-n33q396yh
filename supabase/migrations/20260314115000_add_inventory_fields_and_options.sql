ALTER TABLE public.inventory
ADD COLUMN IF NOT EXISTS nfe_number TEXT,
ADD COLUMN IF NOT EXISTS storage_room TEXT,
ADD COLUMN IF NOT EXISTS cabinet_number TEXT;

CREATE TABLE IF NOT EXISTS public.inventory_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.inventory_options LIMIT 1) THEN
        INSERT INTO public.inventory_options (category, value) VALUES
        ('IMPLANT_BRAND', 'NEODENT'),
        ('IMPLANT_BRAND', 'STRAUMANN'),
        ('IMPLANT_BRAND', 'SIN'),
        ('IMPLANT_BRAND', 'INP'),
        ('IMPLANT_BRAND', 'DENTFLEX'),
        ('IMPLANT_BRAND', 'FGM'),
        ('IMPLANT_BRAND', 'TITANIUM FIX'),
        ('IMPLANT_BRAND', 'OUTRA'),
        ('IMPLANT_DIAMETER', '3.3'),
        ('IMPLANT_DIAMETER', '3.5'),
        ('IMPLANT_DIAMETER', '3.75'),
        ('IMPLANT_DIAMETER', '4.0'),
        ('IMPLANT_DIAMETER', '4.3'),
        ('IMPLANT_DIAMETER', '4.5'),
        ('IMPLANT_DIAMETER', '5.0'),
        ('IMPLANT_DIAMETER', '6.0'),
        ('IMPLANT_HEIGHT', '4'),
        ('IMPLANT_HEIGHT', '5'),
        ('IMPLANT_HEIGHT', '5.5'),
        ('IMPLANT_HEIGHT', '6'),
        ('IMPLANT_HEIGHT', '7'),
        ('IMPLANT_HEIGHT', '8'),
        ('IMPLANT_HEIGHT', '8.5'),
        ('IMPLANT_HEIGHT', '9'),
        ('IMPLANT_HEIGHT', '10'),
        ('IMPLANT_HEIGHT', '11.5'),
        ('IMPLANT_HEIGHT', '13'),
        ('IMPLANT_HEIGHT', '15'),
        ('PROSTHETIC_TYPE', 'MINI PILAR RETO'),
        ('PROSTHETIC_TYPE', 'MINI PILAR ANGULADO'),
        ('PROSTHETIC_TYPE', 'MUNHÃO UNIVERSAL'),
        ('PROSTHETIC_COLLAR_HEIGHT', '0,8 MM'),
        ('PROSTHETIC_COLLAR_HEIGHT', '1,5 MM'),
        ('PROSTHETIC_COLLAR_HEIGHT', '2,5 MM'),
        ('PROSTHETIC_COLLAR_HEIGHT', '3,5 MM'),
        ('PROSTHETIC_COLLAR_HEIGHT', '4,5 MM'),
        ('PROSTHETIC_COLLAR_HEIGHT', '5,0 MM'),
        ('PROSTHETIC_ANGLE', '17 GRAUS'),
        ('PROSTHETIC_ANGLE', '30 GRAUS'),
        ('PROSTHETIC_DIAMETER', '3,3 MM'),
        ('PROSTHETIC_DIAMETER', '4,5 MM'),
        ('PROSTHETIC_HEIGHT', '4 MM'),
        ('PROSTHETIC_HEIGHT', '6 MM'),
        ('STORAGE_ROOM', 'SALA 1'),
        ('STORAGE_ROOM', 'SALA 2'),
        ('STORAGE_ROOM', 'ESTOQUE PRINCIPAL');
    END IF;
END $;

ALTER TABLE public.inventory_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all authenticated users" ON public.inventory_options FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow master users" ON public.inventory_options FOR ALL TO authenticated USING (is_master_user(auth.uid())) WITH CHECK (is_master_user(auth.uid()));

