# Jayshree Realty — Hostinger Deployment Guide
> Enterprise Real Estate Platform v2.0 | Supabase + Node.js + Express + React

---

## ⚡ Quick Start Checklist

- [ ] 1. Run SQL schema in Supabase
- [ ] 2. Push code to GitHub
- [ ] 3. Configure Hostinger Node.js app
- [ ] 4. Set environment variables in hPanel
- [ ] 5. Deploy & verify

---

## STEP 1 — Create Supabase Database Tables

**This is the most important step. Without it, nothing works.**

1. Open your Supabase dashboard: https://supabase.com/dashboard/project/pzmjewrnnzntvtueqmcq/sql/new
2. Click **"New Query"**
3. Open the file `supabase_schema.sql` in this project
4. **Copy the entire contents** and paste into the SQL Editor
5. Click **"Run"** (or press `Ctrl+Enter`)
6. You should see a success notification at the bottom

> After completing this, run `node server/migrate.js` locally to verify all tables were created.

---

## STEP 2 — Verify Local Server Works

```bash
# Test server starts correctly
node server/index.js

# Should see:
# 🚀  Jayshree Realty Enterprise Backend
# 📡  Running: http://localhost:5000

# Test admin login (should return success + token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@jayshreerealty","password":"jayshreerealty@8989"}'
```

---

## STEP 3 — Build Frontend for Production

```bash
npm run build
# Creates optimized dist/ folder (takes ~40 seconds)
```

---

## STEP 4 — Push to GitHub

```bash
git add .
git commit -m "Production deployment v2.0 — Supabase backend"
git push origin main
```

---

## STEP 5 — Configure Hostinger Node.js App

1. Log into **Hostinger hPanel** → Websites → your domain
2. Click **"Node.js"** or **"Setup Node.js App"**
3. Configure:
   | Field | Value |
   |-------|-------|
   | **Node.js Version** | `20.x` (or latest LTS) |
   | **Application Mode** | `production` |
   | **Application Root** | `/` (project root) |
   | **Startup File** | `server/index.js` |

---

## STEP 6 — Set Environment Variables in hPanel

In Hostinger → Node.js App → **Environment Variables**, add these:

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://iampratik.tech
BACKEND_URL=https://iampratik.tech
CLIENT_URL=https://iampratik.tech

VITE_SUPABASE_URL=https://pzmjewrnnzntvtueqmcq.supabase.co
SUPABASE_URL=https://pzmjewrnnzntvtueqmcq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWpld3JubnpudHZ0dWVxbWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODkwODcsImV4cCI6MjEwMDY2NTA4N30.VJmY32OZ107Bu33NIcEurkJzcSeXiaYEY6QFOIe84sE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6bWpld3JubnpudHZ0dWVxbWNxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTA4OTA4NywiZXhwIjoyMTAwNjY1MDg3fQ.-9qVNxCcvUlnd3QXAIGajB6u67l-AjiDdb_mq75XdqA

JWT_SECRET=jayshree_realty_jwt_secret_key_2026_super_secure_key
SESSION_SECRET=jayshree_realty_session_secret_2026_super_secure_key
ADMIN_USER=admin@jayshreerealty
ADMIN_PASS=jayshreerealty@8989

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=bluetorn03@gmail.com
SMTP_PASS=rhdu aiff twvb buok
RECEIVER_EMAIL=bluetorn03@gmail.com
```

---

## STEP 7 — Connect GitHub & Deploy

1. In Hostinger hPanel → **Git** → Connect Repository
2. Repository: `https://github.com/your-username/jayshree-realty.git`
3. Branch: `main`
4. After git pull, run via SSH:

```bash
npm install --production
npm run build
# Server auto-starts via Hostinger Node.js App Manager
```

Or set the **Deployment Script** in Hostinger to:
```bash
npm install && npm run build
```

---

## STEP 8 — Verify Deployment

Open browser and test:

| URL | Expected |
|-----|----------|
| `https://iampratik.tech/` | Website homepage loads |
| `https://iampratik.tech/api/health` | `{"status":"ok","database":"Supabase PostgreSQL"}` |
| `https://iampratik.tech/admin` | Admin login page |
| `https://iampratik.tech/robots.txt` | Robots.txt content |

---

## STEP 9 — Admin Login

**URL:** `https://iampratik.tech/admin`

| Field | Value |
|-------|-------|
| **Username** | `admin@jayshreerealty` |
| **Password** | `jayshreerealty@8989` |

> ⚠️ **Change your admin password immediately** after first login via Admin → Settings → Security Console.

---

## Troubleshooting

### "Tables not found" errors
→ Run the SQL schema in Supabase SQL Editor (Step 1)

### Admin login fails
→ Check `ADMIN_USER` and `ADMIN_PASS` env vars match exactly
→ Verify Supabase `SUPABASE_SERVICE_ROLE_KEY` is correct

### Emails not sending
→ Verify `SMTP_PASS` is a Gmail App Password (16-char format: `xxxx xxxx xxxx xxxx`)
→ Check: https://myaccount.google.com/apppasswords

### 404 on page refresh
→ Ensure all non-API routes serve `dist/index.html` (already configured in `server/index.js`)

### Build fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```
