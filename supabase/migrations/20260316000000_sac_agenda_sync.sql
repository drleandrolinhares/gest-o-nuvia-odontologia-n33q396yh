-- Add reference column to agenda table
ALTER TABLE public.agenda ADD COLUMN IF NOT EXISTS sac_record_id UUID REFERENCES public.sac_records(id) ON DELETE CASCADE;

-- Ensure constraints match the latest requirements
ALTER TABLE public.sac_records DROP CONSTRAINT IF EXISTS sac_records_status_check;
ALTER TABLE public.sac_records ADD CONSTRAINT sac_records_status_check CHECK (status IN ('OPORTUNIDADE DE SOLUÇÃO', 'RECEBIDO', 'SENDO TRATADO', 'RESOLVIDO'));

-- Trigger function: Update agenda when SAC is marked as RESOLVIDO
CREATE OR REPLACE FUNCTION public.sync_sac_to_agenda()
RETURNS trigger AS $
BEGIN
    IF NEW.status = 'RESOLVIDO' AND OLD.status != 'RESOLVIDO' THEN
        UPDATE public.agenda 
        SET is_completed = true, completed_at = NOW() 
        WHERE sac_record_id = NEW.id AND is_completed = false;
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_sac_to_agenda ON public.sac_records;
CREATE TRIGGER trg_sync_sac_to_agenda
AFTER UPDATE ON public.sac_records
FOR EACH ROW EXECUTE FUNCTION sync_sac_to_agenda();

-- Trigger function: Update SAC when related Agenda item is marked as complete
CREATE OR REPLACE FUNCTION public.sync_agenda_to_sac()
RETURNS trigger AS $
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false AND NEW.type = 'SAC' AND NEW.sac_record_id IS NOT NULL THEN
        UPDATE public.sac_records 
        SET status = 'RESOLVIDO', solved_at = NOW() 
        WHERE id = NEW.sac_record_id AND status != 'RESOLVIDO';
    END IF;
    RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_agenda_to_sac ON public.agenda;
CREATE TRIGGER trg_sync_agenda_to_sac
AFTER UPDATE ON public.agenda
FOR EACH ROW EXECUTE FUNCTION sync_agenda_to_sac();

