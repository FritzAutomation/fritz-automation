-- Fix infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all services" ON public.services;
DROP POLICY IF EXISTS "Admins can insert services" ON public.services;
DROP POLICY IF EXISTS "Admins can update services" ON public.services;
DROP POLICY IF EXISTS "Admins can delete services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage industries" ON public.industries;
DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can delete contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can delete tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Admins can add messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Admins can delete messages" ON public.ticket_messages;
DROP POLICY IF EXISTS "Admins can view all files" ON public.files;
DROP POLICY IF EXISTS "Admins can delete any file" ON public.files;

-- Create a security definer function to check admin status
-- This avoids the infinite recursion by bypassing RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = auth.uid();

    RETURN user_role IN ('admin', 'superadmin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Recreate admin policies using the helper function

-- PROFILES
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
    ON public.profiles FOR UPDATE
    USING (public.is_admin());

-- SERVICES
CREATE POLICY "Admins can view all services"
    ON public.services FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can insert services"
    ON public.services FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update services"
    ON public.services FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete services"
    ON public.services FOR DELETE
    USING (public.is_admin());

-- INDUSTRIES
CREATE POLICY "Admins can manage industries"
    ON public.industries FOR ALL
    USING (public.is_admin());

-- TESTIMONIALS
CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    USING (public.is_admin());

-- CONTACT SUBMISSIONS
CREATE POLICY "Admins can view contact submissions"
    ON public.contact_submissions FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update contact submissions"
    ON public.contact_submissions FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete contact submissions"
    ON public.contact_submissions FOR DELETE
    USING (public.is_admin());

-- TICKETS
CREATE POLICY "Admins can view all tickets"
    ON public.tickets FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update all tickets"
    ON public.tickets FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete tickets"
    ON public.tickets FOR DELETE
    USING (public.is_admin());

-- TICKET MESSAGES
CREATE POLICY "Admins can view all messages"
    ON public.ticket_messages FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can add messages"
    ON public.ticket_messages FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete messages"
    ON public.ticket_messages FOR DELETE
    USING (public.is_admin());

-- FILES
CREATE POLICY "Admins can view all files"
    ON public.files FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can delete any file"
    ON public.files FOR DELETE
    USING (public.is_admin());
