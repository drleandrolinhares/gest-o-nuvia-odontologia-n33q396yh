ALTER TABLE public.sac_records DROP CONSTRAINT IF EXISTS sac_records_status_check;
ALTER TABLE public.sac_records ADD CONSTRAINT sac_records_status_check CHECK (status IN ('OPORTUNIDADE DE SOLUÇÃO', 'RECEBIDO', 'SENDO TRATADO', 'RESOLVIDO'));
ALTER TABLE public.sac_records ALTER COLUMN status SET DEFAULT 'OPORTUNIDADE DE SOLUÇÃO';

