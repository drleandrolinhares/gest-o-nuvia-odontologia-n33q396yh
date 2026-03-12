CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  type TEXT CHECK (type IN ('individual', 'group')),
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view rooms they are in" ON public.chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.room_id = id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view participants in their rooms" ON public.chat_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.room_id = chat_participants.room_id AND cp.user_id = auth.uid()
    ) OR user_id = auth.uid()
  );

CREATE POLICY "Users can insert themselves or others into rooms" ON public.chat_participants
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own participant record" ON public.chat_participants
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view messages in their rooms" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.room_id = chat_messages.room_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in their rooms" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.room_id = room_id AND cp.user_id = auth.uid()
    ) AND sender_id = auth.uid()
  );

CREATE OR REPLACE FUNCTION public.get_unread_counts(user_id_param UUID)
RETURNS TABLE (room_id UUID, unread_count BIGINT)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    cp.room_id,
    COUNT(m.id) as unread_count
  FROM public.chat_participants cp
  JOIN public.chat_messages m ON m.room_id = cp.room_id
  WHERE cp.user_id = user_id_param
    AND m.sender_id != user_id_param
    AND m.created_at > COALESCE(cp.last_read_at, '1970-01-01'::timestamptz)
  GROUP BY cp.room_id;
$$;

CREATE OR REPLACE FUNCTION public.mark_room_read(p_room_id UUID, p_user_id UUID)
RETURNS void
LANGUAGE sql SECURITY DEFINER AS $$
  UPDATE public.chat_participants
  SET last_read_at = NOW()
  WHERE room_id = p_room_id AND user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_group_room(dept_name TEXT, creator_id UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_room_id UUID;
BEGIN
  SELECT id INTO v_room_id FROM public.chat_rooms WHERE type = 'group' AND department = dept_name LIMIT 1;
  IF v_room_id IS NULL THEN
    INSERT INTO public.chat_rooms (name, type, department) VALUES (dept_name, 'group', dept_name) RETURNING id INTO v_room_id;
    INSERT INTO public.chat_participants (room_id, user_id)
    SELECT v_room_id, user_id FROM public.employees WHERE department = dept_name AND user_id IS NOT NULL
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.chat_participants (room_id, user_id) VALUES (v_room_id, creator_id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN v_room_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_or_create_individual_room(user1 UUID, user2 UUID)
RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_room_id UUID;
BEGIN
  SELECT r.id INTO v_room_id
  FROM public.chat_rooms r
  JOIN public.chat_participants p1 ON p1.room_id = r.id AND p1.user_id = user1
  JOIN public.chat_participants p2 ON p2.room_id = r.id AND p2.user_id = user2
  WHERE r.type = 'individual'
  LIMIT 1;

  IF v_room_id IS NULL THEN
    INSERT INTO public.chat_rooms (type) VALUES ('individual') RETURNING id INTO v_room_id;
    INSERT INTO public.chat_participants (room_id, user_id) VALUES (v_room_id, user1), (v_room_id, user2);
  END IF;
  RETURN v_room_id;
END;
$$;
