# LinkGuard — Production Setup & Launch Guide

This guide walks you through setting up and launching **LinkGuard** with a real working backend, database, automated 2:00 AM link checks, Telegram bot alerts, and email notifications.

---

## 🚀 1. Quick Start (Local Development)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### Step 3: Start Application (Frontend + Backend Engine)
```bash
npm run start
```
* 🌐 **Web Dashboard:** `http://localhost:5173/`
* 🛡️ **Backend API Engine:** `http://localhost:3001/`

---

## 🤖 2. Real Telegram Bot Alerts Setup

1. Open Telegram and search for **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot` and follow prompts to choose a name and username (e.g., `LinkGuardAlertsBot`).
3. Copy the HTTP API token provided by BotFather.
4. Paste it into your `.env` file:
   ```env
   TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
   ```
5. Open your bot on Telegram, click **Start**, and send your chat ID or connect code.
6. In the dashboard, click **"Send Test Alert"** to receive an instant live Telegram notification card with Revenue-Loss risk and 1-click fix buttons!

---

## 📧 3. Real Email Alerts Setup (Resend / SMTP)

### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com/) and create an API Key.
2. Add your verified domain or testing address in `.env`:
   ```env
   RESEND_API_KEY="re_123456789..."
   EMAIL_FROM="LinkGuard Alerts <alerts@yourdomain.com>"
   ```

### Option B: Standard SMTP (Gmail / SendGrid / Postmark)
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

---

## ⏰ 4. Daily Automated Cron Job (2:00 AM UTC)

LinkGuard runs daily automated health checks across all monitored affiliate links without manual intervention.

### Triggering Manual Cron Check:
```bash
# Test local cron execution:
curl -X POST http://localhost:3001/api/cron/daily-check \
  -H "Authorization: Bearer linkguard_cron_secret_auth_token_2026"
```

### Vercel Cron Configuration (`vercel.json`):
```json
{
  "crons": [
    {
      "path": "/api/cron/daily-check",
      "schedule": "0 2 * * *"
    }
  ]
}
```
In your Vercel Project Settings, add `CRON_SECRET` to automatically authorize Vercel cron triggers.

---

## 🗄️ 5. Real Database (Prisma ORM)

LinkGuard includes a complete Prisma schema (`prisma/schema.prisma`):
* `User`
* `Website`
* `Article`
* `AffiliateLink`
* `LinkCheck` (history timeline)
* `Alert`
* `TelegramConnection`
* `ScanJob`
* `Subscription`

To run database migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 📦 6. Production Deployment Checklist

- [x] Set production `DATABASE_URL` (Neon / Supabase PostgreSQL)
- [x] Configure `NEXTAUTH_SECRET` & `CRON_SECRET`
- [x] Set `TELEGRAM_BOT_TOKEN` for real-time mobile push alerts
- [x] Set `RESEND_API_KEY` for HTML email alerts
- [x] Run `npm run build` to generate production build (0 errors verified)
