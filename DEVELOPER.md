# ProspectOS — Developer Guide & REST API Reference

Welcome to the **ProspectOS** developer documentation. This guide details the project structure, OpenAPI-compliant REST specifications, environment configurations, and production deployment processes.

---

## 📂 Project Directory Structure

```text
ProspectOS/
├── Dockerfile                  # Multi-stage production build configuration
├── docker-compose.yml          # Container configuration (NextJS + Redis + PostgreSQL)
├── nginx.conf                  # Reverse proxy server configuration
├── src/
│   ├── app/                    # Next.js 16 App Router routing tree
│   │   ├── auth/               # Credentials and Magic link screens
│   │   ├── onboarding/         # Setup workflow wizard
│   │   ├── dashboard/          # Central CRM, Analytics, Billing, and Agent panels
│   │   └── page.tsx            # Visual landing page
│   ├── components/             # Reusable UI & Core modules
│   │   ├── dashboard/          # Command palette, lead detail drawers, notifications
│   │   ├── landing/            # Responsive hero layouts, pricing grids
│   │   └── ui/                 # Core Design tokens (GlassCard, Buttons, Dialogs)
│   └── lib/
│       ├── store.ts            # Zustand State managers and duplicate logic
│       └── utils.ts            # Helper configurations
```

---

## ⚙️ Environment Configuration

Create a `.env.production` in your root directory:
```env
# Server
PORT=3000
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Databases & Queues
DATABASE_URL="postgresql://prospect_user:prospect_pass@localhost:5432/prospect_db?schema=public"
REDIS_URL="redis://localhost:6379"

# SMTP Outbox Credentials
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="outreach@prospectos.com"
SMTP_PASS="secret_password"
```

---

## 📡 REST API Reference (OpenAPI Specification)

All API endpoints are versioned under `/api/v1` and return standard JSON.

### 1. Leads Management

#### `GET /api/v1/leads`
Retrieve verified leads matching filtering queries.
* **Headers**: `Authorization: Bearer <token>`
* **Parameters**:
  - `stage` (optional): Filter leads by pipeline stage (e.g. `Replied`)
  - `limit` (optional): Limits responses count.

#### `POST /api/v1/leads`
Discovers and imports a new lead target, validating duplicates.
* **Payload**:
```json
{
  "name": "Jane Doe",
  "role": "VP Procurement",
  "company": "Raycast",
  "email": "jane@raycast.com",
  "website": "raycast.com",
  "location": "London, UK",
  "industry": "Developer Utilities",
  "companySize": "10-50",
  "tags": ["AI Scraped"]
}
```

---

### 2. Outreach Campaigns

#### `GET /api/v1/campaigns`
Returns list of active, paused, or draft campaign sequences.

#### `POST /api/v1/campaigns`
Creates a new campaign sequence with custom daily limit settings.
* **Payload**:
```json
{
  "name": "Q3 Growth Campaign",
  "dailyLimit": 50,
  "delaySeconds": 30,
  "timezone": "UTC-5 (EST)"
}
```

---

### 3. Webhook Delivery System

#### `POST /api/v1/webhooks`
Registers an active URL to receive events on trigger executions.
* **Payload**:
```json
{
  "url": "https://api.yourdomain.com/v1/sync",
  "events": ["lead_created", "email_replied"]
}
```

---

## 🚀 Production Deployment & Self-Hosting

### One-Command Docker Setup
You can spin up the Next.js app, Redis worker queue, and PostgreSQL server locally in one command:
```bash
docker-compose up --build -d
```
This binds:
* Next.js App -> `http://localhost:3000`
* PostgreSQL Database -> `port 5432`
* Redis Stack -> `port 6379`
* NGINX Proxy Router -> `port 80`
