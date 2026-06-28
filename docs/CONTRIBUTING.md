# Contributing to ProspectOS

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

```bash
git clone https://github.com/thesawankumar/ProspectOS.git
cd ProspectOS
npm install
cp .env.example .env.local
npm run dev
```

## Branch Strategy

- `main` — production-ready, deployed on merge
- `develop` — integration branch for features
- `feature/your-feature-name` — individual feature branches
- `fix/bug-description` — bug fix branches

## Pull Request Process

1. **Fork** the repository
2. Create a feature branch from `develop`:
   ```bash
   git checkout -b feature/my-new-feature develop
   ```
3. Make your changes following the code standards below
4. Ensure the build passes: `npm run build`
5. Open a PR targeting `develop` with:
   - Clear description of changes
   - Screenshots for UI changes
   - Reference to any related issues

## Code Standards

### TypeScript
- All new code must be TypeScript
- Avoid `any` types — use `unknown` + type guards when needed
- Export all types from `src/types/index.ts`

### Components
- Use the existing design system in `src/components/ui/`
- New dashboard components go in `src/components/dashboard/`
- Always include loading, error, and empty states

### API Routes
- All new API routes go under `src/app/api/v1/`
- Every route must include: auth check, rate limiting, Zod validation
- Use response helpers from `src/middleware/validate.middleware.ts`
- Include a mock fallback for development without a database

### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: add email discovery for Instagram profiles
fix: resolve calendar date timezone offset bug
docs: update API documentation for webhooks
chore: upgrade Prisma to 5.x
```

## File Naming
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- API routes: `route.ts` (Next.js convention)
- Repositories: `entity.repository.ts`
- Services: `entity.service.ts`

## Questions?

Open a GitHub Discussion or reach out in the project's Slack workspace.
