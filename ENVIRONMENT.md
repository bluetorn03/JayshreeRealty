# Jayshree Realty - Environment Variables Documentation

This document explains every environment variable used in the Jayshree Realty Enterprise Real Estate Platform.

## 1. Supabase Database & Storage Settings
- **`VITE_SUPABASE_URL` / `SUPABASE_URL`**: Public HTTPS URL of your Supabase project (e.g. `https://xyzcompany.supabase.co`).
- **`VITE_SUPABASE_ANON_KEY`**: Anonymous API key used for public data queries and browser-side client connections.
- **`SUPABASE_SERVICE_ROLE_KEY`**: Elevated service role secret key used strictly server-side in Node.js to perform administrative CRUD operations bypassing client RLS restriction securely.
- **`DATABASE_URL`**: PostgreSQL connection string for direct database access or ORM connectivity (e.g. `postgresql://postgres:password@db.xyzcompany.supabase.co:5432/postgres`).

## 2. Authentication & Session Secrets
- **`JWT_SECRET`**: Secret key used to sign and verify JSON Web Tokens for Admin session authentication.
- **`SESSION_SECRET`**: Secret key used for cryptographic session signing.
- **`ADMIN_EMAIL` / `ADMIN_USER`**: Email address or username used for superadmin login access (`admin@jayshreerealty`).
- **`ADMIN_PASS`**: Initial password for seeding the admin user account (`jayshreerealty@8989`).
- **`ADMIN_PASSWORD_HASH`**: Pre-hashed bcrypt password fallback for production verification.

## 3. Hostinger Business Email SMTP Configuration
- **`SMTP_HOST`**: SMTP server host (`smtp.hostinger.com`).
- **`SMTP_PORT`**: Port for SMTP connection (`465` for SSL).
- **`SMTP_USER`**: Sender email address (`info@jayshreerealty.com`).
- **`SMTP_PASS`**: Hostinger webmail account password.
- **`RECEIVER_EMAIL`**: Recipient email address for all incoming lead notifications (`info@jayshreerealty.com`).

## 4. Application & Server Settings
- **`NODE_ENV`**: Environment mode (`development` or `production`).
- **`PORT`**: HTTP port for the Node.js Express server (`5000` by default or provided by Hostinger).
- **`FRONTEND_URL` / `BACKEND_URL` / `CLIENT_URL`**: Public domain of the application.
- **`CORS_ORIGIN`**: Allowed CORS origins for API requests (`*` or domain list).

## 5. Google Services
- **`GOOGLE_MAPS_API_KEY`**: Google Maps API Key for location embedding and geo-services.
- **`GOOGLE_ANALYTICS_ID`**: Google Analytics Measurement ID (e.g. `G-XXXXXXX`).
