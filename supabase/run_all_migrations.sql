-- =====================
-- Fritz Automation Database Schema
-- Run this in Supabase SQL Editor
-- =====================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES (extends Supabase auth.users)
-- =====================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'admin', 'superadmin')),
    company_name VARCHAR(255),
    phone VARCHAR(20),
    industry VARCHAR(100),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- CMS CONTENT
-- =====================

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    features JSONB DEFAULT '[]',
    technologies JSONB DEFAULT '[]',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    role VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- INQUIRIES
-- =====================

CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'contact_form',
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- =====================
-- CLIENT PORTAL
-- =====================

CREATE TABLE public.tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(50),
    assigned_to UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Auto-generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    sequence_num INTEGER;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');

    SELECT COALESCE(MAX(
        CAST(SUBSTRING(ticket_number FROM 9) AS INTEGER)
    ), 0) + 1 INTO sequence_num
    FROM public.tickets
    WHERE ticket_number LIKE 'FA-' || year_part || '-%';

    NEW.ticket_number := 'FA-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON public.tickets
    FOR EACH ROW
    WHEN (NEW.ticket_number IS NULL)
    EXECUTE FUNCTION generate_ticket_number();

CREATE TABLE public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update ticket timestamp when message added
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.tickets SET updated_at = NOW() WHERE id = NEW.ticket_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_message_created
    AFTER INSERT ON public.ticket_messages
    FOR EACH ROW EXECUTE FUNCTION update_ticket_timestamp();

-- =====================
-- FILES
-- =====================

CREATE TABLE public.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploaded_by UUID REFERENCES public.profiles(id),
    ticket_id UUID REFERENCES public.tickets(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_tickets_client ON public.tickets(client_id);
CREATE INDEX idx_tickets_status ON public.tickets(status);
CREATE INDEX idx_tickets_assigned ON public.tickets(assigned_to);
CREATE INDEX idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
CREATE INDEX idx_files_ticket ON public.files(ticket_id);
CREATE INDEX idx_files_uploaded_by ON public.files(uploaded_by);
CREATE INDEX idx_contact_status ON public.contact_submissions(status);
CREATE INDEX idx_services_active ON public.services(is_active);
CREATE INDEX idx_industries_active ON public.industries(is_active);

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

-- =====================
-- Seed Data for Fritz Automation
-- =====================

-- Services
INSERT INTO public.services (title, slug, description, icon, features, technologies, display_order) VALUES
(
    'Process Automation',
    'process-automation',
    'Streamline your business operations with intelligent automation solutions that save time and reduce errors.',
    'cog',
    '["Workflow automation", "Data processing pipelines", "Report generation", "Task scheduling & monitoring", "Email & notification automation", "File processing & management"]',
    '["Python", "Celery", "Apache Airflow", "Pandas"]',
    1
),
(
    'System Integration',
    'system-integration',
    'Connect your existing systems and tools to work together seamlessly, eliminating manual data transfer and reducing silos.',
    'link',
    '["API development & integration", "Database synchronization", "Third-party service connections", "Legacy system modernization", "Real-time data sync", "Webhook automation"]',
    '["REST APIs", "GraphQL", "Webhooks", "ETL Pipelines"]',
    2
),
(
    'Custom Software Development',
    'custom-software',
    'Tailored software applications built specifically for your business needs, from concept to deployment.',
    'code',
    '["Web applications", "Internal tools & dashboards", "Customer portals", "Data visualization", "Admin panels", "Progressive web apps"]',
    '["React", "Next.js", "TypeScript", "PostgreSQL"]',
    3
);

-- Industries
INSERT INTO public.industries (title, slug, description, icon, display_order) VALUES
(
    'Manufacturing',
    'manufacturing',
    'Streamline production workflows, quality control, and inventory management with custom automation solutions.',
    'factory',
    1
),
(
    'Finance & Accounting',
    'finance-accounting',
    'Automate financial reporting, reconciliation, and compliance processes to reduce errors and save time.',
    'chart',
    2
),
(
    'Supply Chain & Logistics',
    'supply-chain',
    'Optimize inventory tracking, order processing, and shipment management with integrated systems.',
    'truck',
    3
),
(
    'Operations',
    'operations',
    'Transform manual operational processes into efficient, automated workflows that scale with your business.',
    'settings',
    4
);
