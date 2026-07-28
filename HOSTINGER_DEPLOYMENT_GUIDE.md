# Step-by-Step Hostinger Deployment Guide

This guide walks you through deploying the Jayshree Realty Enterprise Real Estate Platform to Hostinger using Node.js web application hosting and GitHub integration.

---

## 1. Prerequisites & Hostinger Environment Setup

1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** -> Select your domain (e.g. `jayshreerealty.com`).
3. Click on **Setup Node.js App** (or Advanced -> Node.js App).
4. Configure Node.js version: Select **Node.js 18.x or 20.x**.
5. Set Application Root: `/public_html` (or your project root).
6. Set Application Startup File: `server/index.js`.
7. Set Application Mode: `production`.

---

## 2. Environment Variables Configuration

In Hostinger hPanel -> **Node.js App Environment Variables**, add all environment variables defined in `.env`:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://jayshreerealty.com
BACKEND_URL=https://jayshreerealty.com
CLIENT_URL=https://jayshreerealty.com
CORS_ORIGIN=*

VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:password@db.your-supabase-project.supabase.co:5432/postgres

JWT_SECRET=your_jwt_secret_key_2026
SESSION_SECRET=your_session_secret_key_2026
ADMIN_EMAIL=admin@jayshreerealty
ADMIN_USER=admin@jayshreerealty
ADMIN_PASS=jayshreerealty@8989

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=jayshreerealty03@gmail.com
SMTP_PASS=your_gmail_16_char_app_password
RECEIVER_EMAIL=bluetorn03@gmail.com
```

---

## 3. GitHub Automatic Deployment via Hostinger

1. Push your repository to GitHub (`git push origin main`).
2. In Hostinger hPanel -> **Git Integration**, connect your repository:
   - Repository URL: `https://github.com/your-username/jayshree-realty.git`
   - Branch: `main`
3. Set Deployment Action or SSH script to run post-deployment commands:
   ```bash
   npm install
   npm run build
   ```

---

## 4. Supabase Database Provisioning

1. Go to your **Supabase Dashboard** (`https://supabase.com/dashboard`).
2. Select your project -> Go to **SQL Editor**.
3. Copy the full content of `supabase_schema.sql` from your project repository.
4. Execute the SQL script. This creates:
   - All 14 production database tables (`admin_users`, `properties`, `leads`, `lead_history`, `categories`, `reviews`, `hero_settings`, `popup_settings`, `site_settings`, `counters`, `location_nodes`, `analytics_events`, `visitor_sessions`, `activity_logs`).
   - Indexes for fast querying.
   - Row Level Security (RLS) policies ensuring public read access and admin-only write access.

---

## 5. Verification Checklist

After deployment completes:
1. Access `https://jayshreerealty.com/api/health` -> Expect `{ "status": "ok", "database": "Supabase" }`.
2. Access `https://jayshreerealty.com/admin` -> Log in using `admin@jayshreerealty` / `jayshreerealty@8989`.
3. Test Property CRUD and Image Uploads in Admin Panel.
4. Submit a website inquiry form -> Verify email notification received at `bluetorn03@gmail.com` and lead recorded in Supabase database.
