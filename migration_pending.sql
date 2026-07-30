-- ================================================================
-- JAYSHREE REALTY - PENDING DATABASE MIGRATION
-- Generated: 2026-07-30T20:57:20.007Z
-- INSTRUCTIONS: Run in Supabase SQL Editor → New Query → Run
-- URL: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql
-- ================================================================

-- Safe idempotent column additions (ADD COLUMN IF NOT EXISTS)

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS button_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS form_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS property_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS device_info TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS traffic_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_source TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_medium TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_campaign TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_term TEXT DEFAULT '';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content TEXT DEFAULT '';

-- Verify columns were added
SELECT column_name, data_type FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('leads','properties') ORDER BY table_name, ordinal_position;