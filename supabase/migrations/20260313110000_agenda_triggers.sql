-- Up Migration: Sync employee dates to agenda table
CREATE OR REPLACE FUNCTION public.sync_employee_dates_to_agenda()
RETURNS trigger AS $$
DECLARE
    v_date_str text;
    v_title text;
BEGIN
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        DELETE FROM public.agenda WHERE assigned_to = OLD.id::text AND is_completed = false AND (type = 'BÔNUS' OR type = 'FÉRIAS');
        RETURN OLD;
    END IF;

    -- Handle Bonus Due Date
    IF NEW.bonus_due_date IS NOT NULL AND NEW.bonus_due_date <> '' THEN
        IF TG_OP = 'INSERT' OR OLD.bonus_due_date IS DISTINCT FROM NEW.bonus_due_date OR OLD.name IS DISTINCT FROM NEW.name THEN
            v_title := 'VENCIMENTO DE BÔNUS - ' || NEW.name;
            UPDATE public.agenda SET date = NEW.bonus_due_date, title = v_title WHERE assigned_to = NEW.id::text AND type = 'BÔNUS' AND is_completed = false;
            IF NOT FOUND THEN
                INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by) VALUES (v_title, NEW.bonus_due_date, '08:00', 'SISTEMA', 'BÔNUS', NEW.id::text, 'SISTEMA');
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND (OLD.bonus_due_date IS NOT NULL AND OLD.bonus_due_date <> '') THEN
        DELETE FROM public.agenda WHERE assigned_to = NEW.id::text AND type = 'BÔNUS' AND is_completed = false;
    END IF;

    -- Handle Vacation Due Date
    IF NEW.vacation_due_date IS NOT NULL THEN
        IF TG_OP = 'INSERT' OR OLD.vacation_due_date IS DISTINCT FROM NEW.vacation_due_date OR OLD.name IS DISTINCT FROM NEW.name THEN
            v_date_str := to_char(NEW.vacation_due_date AT TIME ZONE 'UTC', 'YYYY-MM-DD');
            v_title := 'VENCIMENTO DE FÉRIAS - ' || NEW.name;
            UPDATE public.agenda SET date = v_date_str, title = v_title WHERE assigned_to = NEW.id::text AND type = 'FÉRIAS' AND is_completed = false;
            IF NOT FOUND THEN
                INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by) VALUES (v_title, v_date_str, '08:00', 'SISTEMA', 'FÉRIAS', NEW.id::text, 'SISTEMA');
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.vacation_due_date IS NOT NULL THEN
        DELETE FROM public.agenda WHERE assigned_to = NEW.id::text AND type = 'FÉRIAS' AND is_completed = false;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_employee_dates_to_agenda ON public.employees;
CREATE TRIGGER trg_sync_employee_dates_to_agenda
AFTER INSERT OR UPDATE OR DELETE ON public.employees
FOR EACH ROW EXECUTE FUNCTION public.sync_employee_dates_to_agenda();

-- Seed existing data to keep consistency
DO $$
DECLARE
    emp RECORD;
BEGIN
    FOR emp IN SELECT * FROM public.employees LOOP
        IF emp.bonus_due_date IS NOT NULL AND emp.bonus_due_date <> '' THEN
            IF NOT EXISTS (SELECT 1 FROM public.agenda WHERE assigned_to = emp.id::text AND type = 'BÔNUS' AND is_completed = false) THEN
                INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by)
                VALUES ('VENCIMENTO DE BÔNUS - ' || emp.name, emp.bonus_due_date, '08:00', 'SISTEMA', 'BÔNUS', emp.id::text, 'SISTEMA');
            END IF;
        END IF;

        IF emp.vacation_due_date IS NOT NULL THEN
            IF NOT EXISTS (SELECT 1 FROM public.agenda WHERE assigned_to = emp.id::text AND type = 'FÉRIAS' AND is_completed = false) THEN
                INSERT INTO public.agenda (title, date, time, location, type, assigned_to, created_by)
                VALUES ('VENCIMENTO DE FÉRIAS - ' || emp.name, to_char(emp.vacation_due_date AT TIME ZONE 'UTC', 'YYYY-MM-DD'), '08:00', 'SISTEMA', 'FÉRIAS', emp.id::text, 'SISTEMA');
            END IF;
        END IF;
    END LOOP;
END;
$$;
