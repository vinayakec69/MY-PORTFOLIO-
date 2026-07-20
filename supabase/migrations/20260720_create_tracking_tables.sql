-- Migration: Create Tracking Tables for Portfolio

-- 1. Create table for Chat Logs
CREATE TABLE IF NOT EXISTS public.chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_prompt TEXT NOT NULL
);

-- Allow public inserts (anonymous users can log chats)
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to chat_logs" ON public.chat_logs
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read only by authenticated admins" ON public.chat_logs
    FOR SELECT USING (auth.role() = 'authenticated');


-- 2. Create table for Team-Up Contacts
CREATE TABLE IF NOT EXISTS public.team_up_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT NOT NULL
);

-- Allow public inserts (anonymous users can submit emails)
ALTER TABLE public.team_up_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to team_up_contacts" ON public.team_up_contacts
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read only by authenticated admins" ON public.team_up_contacts
    FOR SELECT USING (auth.role() = 'authenticated');
