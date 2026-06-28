# Deployment Guide

## Prerequisites
- Docker 24+ and Docker Compose v2
- A PostgreSQL 15+ database
- A Redis 7+ instance

## 1. Vercel (Recommended for serverless)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set these in the Vercel dashboard under **Settings → Environment Variables**:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_GEMINI_API_KEY`

> **Note**: The `/api/v1/stream` SSE endpoint works on Vercel with Node.js runtime (configured via `export const runtime = "nodejs"` in the route file).

---

## 2. Railway

1. Connect your GitHub repository to Railway
2. Add a PostgreSQL plugin
3. Set environment variables from `.env.example`
4. Railway will auto-detect the `npm run build` start command

---

## 3. Docker + VPS (DigitalOcean, AWS EC2, Hetzner)

```bash
# Build image
docker build -t prospect-os .

# Run with docker-compose
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f app
```

### docker-compose.yml services:
- `app` — Next.js application (port 3000)
- `postgres` — PostgreSQL database (port 5432)
- `redis` — Redis cache (port 6379)
- `nginx` — Reverse proxy (port 80/443)

---

## 4. Database Setup

After deploying with a real DATABASE_URL:

```bash
# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Seed with demo data
npx prisma db seed
```

---

## 5. NGINX SSL Configuration

Add SSL certificates to `nginx.conf`:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://app:3000;
    }
}
```

Use Certbot for free Let's Encrypt certificates:
```bash
certbot --nginx -d yourdomain.com
```

---

## 6. Health Check

Verify your deployment is healthy:

```bash
curl https://yourdomain.com/api/v1/admin/health
# Expected: {"success":true,"data":{"status":"ok","version":"0.1.0",...}}
```

---

## Environment Variables

See [.env.example](../.env.example) for all required variables with documentation.

**Minimum required for production:**
- `DATABASE_URL`
- `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_GEMINI_API_KEY` (for AI features)
