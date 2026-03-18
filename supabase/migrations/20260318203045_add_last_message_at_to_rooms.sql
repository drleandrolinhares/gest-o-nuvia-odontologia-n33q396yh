ALTER TABLE public.chat_rooms ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMPTZ;

UPDATE public.chat_rooms r
SET last_message_at = COALESCE(
  (SELECT MAX(created_at) FROM public.chat_messages m WHERE m.room_id = r.id),
  r.created_at
);

CREATE OR REPLACE FUNCTION public.update_room_last_message_at()
RETURNS trigger AS $$
BEGIN
  UPDATE public.chat_rooms
  SET last_message_at = NEW.created_at
  WHERE id = NEW.room_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_chat_message_created ON public.chat_messages;
CREATE TRIGGER on_chat_message_created
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION public.update_room_last_message_at();
