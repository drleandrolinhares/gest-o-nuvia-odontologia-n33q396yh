DO $
BEGIN
  -- Initialize action_history if null
  UPDATE public.sac_records 
  SET action_history = '[]'::jsonb 
  WHERE action_history IS NULL;
END $;

CREATE OR REPLACE FUNCTION public.log_sac_status_change()
RETURNS trigger AS $func$
DECLARE
  v_user_name TEXT;
  v_action JSONB;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Get user name from profiles using auth.uid()
    SELECT name INTO v_user_name FROM public.profiles WHERE id = auth.uid();
    
    IF v_user_name IS NULL THEN
      v_user_name := 'SISTEMA';
    END IF;

    v_action := jsonb_build_object(
      'timestamp', to_char(NOW() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'),
      'user_name', v_user_name,
      'action', 'ALTEROU STATUS DE ' || OLD.status || ' PARA ' || NEW.status,
      'previous_status', OLD.status,
      'new_status', NEW.status
    );

    -- Prepend to array
    NEW.action_history := jsonb_build_array(v_action) || COALESCE(NEW.action_history, '[]'::jsonb);
  END IF;
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_sac_status_change ON public.sac_records;
CREATE TRIGGER trg_log_sac_status_change
  BEFORE UPDATE ON public.sac_records
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sac_status_change();

