# ProspectOS

<div align="center">
  <h3>The Smart Outreach Platform</h3>
  <p>AI-powered client acquisition operating system for freelancers, agencies, sales teams, and B2B businesses.</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
  ![License](https://img.shields.io/badge/License-MIT-green)
</div>

---

## Features

- **🔍 AI Lead Finder** — Find leads by location, industry, company size with one command
- **📧 Email Intelligence** — Discover and validate emails with confidence scores and risk analysis
- **🤖 AI Copywriter** — Generate personalized cold emails, follow-ups, LinkedIn messages, and proposals
- **🚀 Campaign Engine** — Multi-step sequences with automatic scheduling, daily limits, and timezone support
- **📊 CRM Pipeline** — Kanban-style deal tracking with lead scoring and stage management
- **💬 AI Chat Assistant** — Natural language dashboard control ("Find 100 SaaS companies in Berlin")
- **⌨️ Ctrl+K Command Palette** — Keyboard-driven navigation across all features
- **🔔 Real-time Notifications** — Server-Sent Events stream for replies, meetings, and campaign progress
- **📄 Billing Suite** — AI proposal generator, invoice management, and contract drafting
- **🔗 Integrations** — Slack, Stripe, Google Calendar, Zapier + full REST API with webhooks
- **🛡️ Developer Admin** — System health, Redis queues, feature flags, and debug console

---

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (optional — runs with mock data without it)

### Development

```bash
# 1. Clone the repository
git clone https://github.com/thesawankumar/ProspectOS.git
cd ProspectOS

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. (Optional) Set up database
npx prisma db push
npx prisma generate

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### With Docker

```bash
# Start all services (app + PostgreSQL + Redis)
docker-compose up -d

# View logs
docker-compose logs -f app
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + Custom Design System |
| **Animations** | Framer Motion 12 |
| **3D Graphics** | Three.js + @react-three/fiber |
| **State** | Zustand 5 |
| **Database** | PostgreSQL + Prisma ORM |
| **Validation** | Zod |
| **Real-time** | Server-Sent Events (SSE) |
| **Auth** | JWT + HTTP-only Cookies |
| **Container** | Docker + NGINX |
| **CI/CD** | GitHub Actions |

---

## Project Structure

```
ProspectOS/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/v1/             # REST API routes
│   │   │   ├── admin/health/   # Health check
│   │   │   ├── ai/chat/        # AI assistant
│   │   │   ├── ai/generate/    # Content generation
│   │   │   ├── campaigns/      # Campaign CRUD
│   │   │   ├── email/          # Discovery & validation
│   │   │   ├── leads/          # Lead CRUD
│   │   │   ├── stream/         # SSE notifications
│   │   │   └── webhooks/       # Webhook management
│   │   ├── auth/               # Login & signup pages
│   │   ├── dashboard/          # Protected dashboard
│   │   │   ├── admin/          # Developer admin
│   │   │   ├── agent/          # AI Outreach Agent
│   │   │   ├── ai/             # AI Copywriter
│   │   │   ├── analytics/      # Reports & charts
│   │   │   ├── billing/        # Proposals, invoices
│   │   │   ├── calendar/       # Scheduler
│   │   │   ├── campaigns/      # Campaign management
│   │   │   ├── crm/            # Kanban pipeline
│   │   │   ├── documents/      # File manager
│   │   │   ├── integrations/   # Webhooks & apps
│   │   │   ├── leads/          # Lead finder
│   │   │   ├── settings/       # Workspace settings
│   │   │   └── templates/      # Email templates
│   │   └── onboarding/         # Onboarding wizard
│   ├── components/
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── AIChatPanel.tsx # AI assistant panel
│   │   │   ├── CommandPalette.tsx # Ctrl+K palette
│   │   │   └── NotificationCenter.tsx # Bell dropdown
│   │   ├── landing/            # Landing page sections
│   │   ├── three/              # 3D components
│   │   └── ui/                 # Design system components
│   ├── features/               # Feature modules
│   │   ├── ai/                 # AI feature actions
│   │   ├── auth/               # Auth feature actions
│   │   ├── campaigns/          # Campaign actions
│   │   └── leads/              # Lead actions
│   ├── hooks/                  # Custom React hooks
│   │   └── useNotificationStream.ts
│   ├── lib/                    # Core utilities
│   │   ├── prisma.ts           # Database client
│   │   ├── store.ts            # Zustand state
│   │   └── utils.ts            # Utility functions
│   ├── middleware/             # API middleware
│   │   ├── auth.middleware.ts
│   │   ├── ratelimit.middleware.ts
│   │   └── validate.middleware.ts
│   ├── repositories/           # Data access layer
│   ├── services/               # Business logic
│   ├── types/                  # TypeScript types
│   └── emails/                 # HTML email templates
├── prisma/
│   └── schema.prisma           # Database schema
├── docs/                       # Documentation
├── .github/workflows/          # CI/CD pipelines
├── Dockerfile
├── docker-compose.yml
└── nginx.conf
```

---

## API Overview

All endpoints are under `/api/v1/`. See [docs/API.md](./docs/API.md) for full documentation.

```bash
# Health check
GET /api/v1/admin/health

# Leads
GET  /api/v1/leads?page=1&limit=25&stage=INTERESTED
POST /api/v1/leads
GET  /api/v1/leads/:id
PATCH /api/v1/leads/:id
DELETE /api/v1/leads/:id

# Campaigns
GET  /api/v1/campaigns
POST /api/v1/campaigns

# Email Intelligence
POST /api/v1/email/discover
POST /api/v1/email/validate

# AI
POST /api/v1/ai/chat
POST /api/v1/ai/generate

# Real-time SSE stream
GET  /api/v1/stream

# Webhooks
GET  /api/v1/webhooks
POST /api/v1/webhooks
DELETE /api/v1/webhooks?id=<uuid>
```

---

## Deployment

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full deployment guides.

### Vercel (Recommended)

```bash
npx vercel --prod
```

### Docker

```bash
docker-compose up -d
```

---

## Contributing

See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.

---

## License

MIT — see [LICENSE](./LICENSE) for details.
