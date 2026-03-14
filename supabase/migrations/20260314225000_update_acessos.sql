ALTER TABLE public.acessos
ADD COLUMN sector TEXT DEFAULT 'GERAL',
ADD COLUMN access_level TEXT DEFAULT 'ACESSO GERAL',
ADD COLUMN logo_url TEXT,
ADD COLUMN description TEXT,
ADD COLUMN target_users TEXT,
ADD COLUMN frequency TEXT,
ADD COLUMN video_url TEXT,
ADD COLUMN manual_steps JSONB DEFAULT '[]'::jsonb,
ADD COLUMN troubleshooting JSONB DEFAULT '[]'::jsonb,
ADD COLUMN security_note TEXT;

