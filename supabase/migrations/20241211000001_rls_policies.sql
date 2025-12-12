-- =====================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES
-- =====================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- SERVICES (CMS)
-- =====================

-- Anyone can view active services
CREATE POLICY "Anyone can view active services"
    ON public.services FOR SELECT
    USING (is_active = true);

-- Admins can view all services
CREATE POLICY "Admins can view all services"
    ON public.services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can insert services
CREATE POLICY "Admins can insert services"
    ON public.services FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can update services
CREATE POLICY "Admins can update services"
    ON public.services FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can delete services
CREATE POLICY "Admins can delete services"
    ON public.services FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- INDUSTRIES (CMS)
-- =====================

-- Anyone can view active industries
CREATE POLICY "Anyone can view active industries"
    ON public.industries FOR SELECT
    USING (is_active = true);

-- Admins can manage industries
CREATE POLICY "Admins can manage industries"
    ON public.industries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- TESTIMONIALS (CMS)
-- =====================

-- Anyone can view active testimonials
CREATE POLICY "Anyone can view active testimonials"
    ON public.testimonials FOR SELECT
    USING (is_active = true);

-- Admins can manage testimonials
CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- CONTACT SUBMISSIONS
-- =====================

-- Anyone can submit contact form (no auth required)
CREATE POLICY "Anyone can submit contact form"
    ON public.contact_submissions FOR INSERT
    WITH CHECK (true);

-- Admins can view contact submissions
CREATE POLICY "Admins can view contact submissions"
    ON public.contact_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can update contact submissions
CREATE POLICY "Admins can update contact submissions"
    ON public.contact_submissions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can delete contact submissions
CREATE POLICY "Admins can delete contact submissions"
    ON public.contact_submissions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- TICKETS
-- =====================

-- Users can view their own tickets
CREATE POLICY "Users can view own tickets"
    ON public.tickets FOR SELECT
    USING (client_id = auth.uid());

-- Users can create tickets
CREATE POLICY "Users can create tickets"
    ON public.tickets FOR INSERT
    WITH CHECK (client_id = auth.uid());

-- Users can update their own tickets (limited fields via app logic)
CREATE POLICY "Users can update own tickets"
    ON public.tickets FOR UPDATE
    USING (client_id = auth.uid());

-- Admins can view all tickets
CREATE POLICY "Admins can view all tickets"
    ON public.tickets FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can update all tickets
CREATE POLICY "Admins can update all tickets"
    ON public.tickets FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can delete tickets
CREATE POLICY "Admins can delete tickets"
    ON public.tickets FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- TICKET MESSAGES
-- =====================

-- Users can view non-internal messages on their tickets
CREATE POLICY "Users can view messages on own tickets"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE id = ticket_id AND client_id = auth.uid()
        )
        AND is_internal = false
    );

-- Users can add messages to their tickets
CREATE POLICY "Users can add messages to own tickets"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE id = ticket_id AND client_id = auth.uid()
        )
        AND is_internal = false
        AND sender_id = auth.uid()
    );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
    ON public.ticket_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can add messages
CREATE POLICY "Admins can add messages"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can delete messages
CREATE POLICY "Admins can delete messages"
    ON public.ticket_messages FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- =====================
-- FILES
-- =====================

-- Users can view their own files
CREATE POLICY "Users can view own files"
    ON public.files FOR SELECT
    USING (uploaded_by = auth.uid());

-- Users can view files on their tickets
CREATE POLICY "Users can view files on own tickets"
    ON public.files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tickets
            WHERE id = ticket_id AND client_id = auth.uid()
        )
    );

-- Users can upload files
CREATE POLICY "Users can upload files"
    ON public.files FOR INSERT
    WITH CHECK (uploaded_by = auth.uid());

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
    ON public.files FOR DELETE
    USING (uploaded_by = auth.uid());

-- Admins can view all files
CREATE POLICY "Admins can view all files"
    ON public.files FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );

-- Admins can delete any file
CREATE POLICY "Admins can delete any file"
    ON public.files FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('admin', 'superadmin')
        )
    );
