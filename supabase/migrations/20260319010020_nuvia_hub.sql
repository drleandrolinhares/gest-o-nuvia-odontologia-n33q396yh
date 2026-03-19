CREATE TABLE public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.announcement_read_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    announcement_id UUID NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    points_earned INTEGER NOT NULL DEFAULT 0,
    is_read BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(announcement_id, user_id)
);

CREATE TABLE public.feedback_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    positive_points TEXT NOT NULL,
    improvements TEXT NOT NULL,
    points_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_read_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users to read announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users to insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to read announcement logs" ON public.announcement_read_logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert own announcement logs" ON public.announcement_read_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow all authenticated users to read feedback" ON public.feedback_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to insert own feedback" ON public.feedback_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

