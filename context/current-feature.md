# Current Feature

## Status

—

## Goals

—

## Notes

—

## History

<!-- Keep this updated. Earliest to Latest -->

### 2026-04-24 — Add Pro Badge to Sidebar
- Installed shadcn/ui Badge component (`src/components/ui/badge.tsx`)
- Added `PRO` badge next to `files` and `images` item types in the sidebar
- Badge uses `outline` variant — muted border/text for a clean, subtle appearance
- Badge only renders in expanded sidebar mode; icon-only collapsed view is unaffected
- Item count is replaced by the badge for Pro-only types; all other types retain their count

### 2026-04-23 — Stats & Sidebar (Real Data)
- Added `getItemTypesWithCounts()` to `src/lib/db/items.ts` — fetches system types + per-user item counts via `groupBy`; sorted by custom order (snippets, prompts, commands, notes, files, images, links)
- Added `getSidebarCollections()` to `src/lib/db/collections.ts` — favorites first then recent, up to 5, with dominant color and total count
- Made `layout.tsx` async; fetches item types, sidebar collections, and demo user in parallel
- Sidebar accepts `SidebarDataProps` from layout instead of using mock data
- Collections show a colored circle dot (dominant type color); favorites additionally show a star badge
- "View all collections (N)" link uses live count
- Removed Help & Support button from sidebar

### 2026-04-23 — Dashboard Items (Real Data)
- Created `src/lib/db/items.ts` with `getPinnedItems()` and `getRecentItems(limit)`
- Items typed with `Prisma.ItemGetPayload` using a shared `itemInclude` constant; mapped to `ItemForCard`
- Pinned section hidden when no pinned items exist
- Recent items ordered by `lastUsedAt desc nulls last`
- Items count badge in section header uses `stats.totalItems` from existing DB query
- All four dashboard fetches (collections, stats, pinned, recent) run in a single `Promise.all`
- Mock data imports fully removed from `page.tsx`

### 2026-04-23 — Dashboard Collections (Real Data)
- Created `src/lib/db/collections.ts` with `getCollectionsForDashboard()` and `getDashboardStats()`
- Collections fetched from Neon DB via Prisma for the demo user; top 6 by newest first
- Dominant border color derived from the most-used item type in each collection
- Type icons shown in order of frequency (most common first)
- Stats cards (total items, collections, favorites) now use live DB counts
- Dashboard `page.tsx` made async; collections + stats fetched in parallel via `Promise.all`
- Items section (pinned/recent) remains on mock data — to be replaced in a future feature

### 2026-04-23 — Database Seed Script
- Added `password String?` to `User` model; migration `20260423213912_add_user_password` applied
- Created `prisma/seed.ts` — idempotent, cleans previous seed data before re-running
- Demo user: `demo@devstash.io` / `12345678` (bcryptjs, 12 rounds)
- Seeded 7 system item types (snippet, prompt, command, note, file, image, link) with Lucide icon names
- 5 collections with 18 items: React Patterns (3 snippets), AI Workflows (3 prompts), DevOps (1 snippet + 1 command + 2 links), Terminal Commands (4 commands), Design Resources (4 links)
- Added `db:seed` script to `package.json` and `prisma.seed` pointer so both `npm run db:seed` and `prisma db seed` work
- Installed `bcryptjs` + `@types/bcryptjs`

### 2026-04-23 — Prisma + Neon PostgreSQL Setup
- Installed Prisma 7 with `@prisma/adapter-neon` and `@neondatabase/serverless`
- Created full schema: `User`, `ItemType`, `Item`, `Collection`, `ItemCollection`, `Tag` + NextAuth models (`Account`, `Session`, `VerificationToken`)
- Added indexes on all foreign keys and frequently queried fields; cascade deletes on all user-owned data
- Configured `prisma.config.ts` (Prisma 7 pattern — `url` lives in config, not schema)
- Ran initial migration `20260423211327_init` via `prisma migrate dev` against Neon dev branch
- Prisma client generated to `generated/prisma/`
- Added `scripts/test-db.ts` to verify connectivity (requires `ws` for Node.js WebSocket support)
- Workaround applied: `zeptomatch` CJS shim in `node_modules` to fix Prisma 7.8.0 + Node.js v20 ESM incompatibility

### 2026-04-23 — Dashboard UI Phase 3
- 4 stats cards: total items, collections, favorite items, favorite collections
- Collections grid (3-col) with color accent, description, item count, and derived type icons
- Items section with visual All/Pinned/Favorites tabs
- Pinned items subsection
- Recent items subsection (all items sorted by lastUsedAt, up to 10)
- `StatsCard`, `CollectionCard`, and `ItemCard` components added

### 2026-04-23 — Dashboard UI Phase 2
- Built collapsible sidebar (icon-only when collapsed on desktop)
- Item type nav links to `/items/TYPE` with icon and count
- Favorite + recent collections listed in sidebar with "View all" link
- User avatar area at the bottom with name, plan, and settings link
- Mobile drawer via shadcn Sheet, opened with hamburger button in top bar
- Desktop toggle uses PanelLeft icon, mobile uses Menu icon (separate buttons per breakpoint)
- Sidebar state managed via `SidebarContext` (collapsed + mobileOpen)

### 2026-04-23 — Dashboard UI Phase 1
- Initialized shadcn/ui (v4.4.0) with Tailwind CSS v4 support
- Installed shadcn Button and Input components
- Added `dark` class to root `<html>` for dark mode by default
- Created `/dashboard` route with two-column layout (sidebar + main)
- Built `TopBar` component with sidebar toggle, search input, and "New Item" button (display only)
- Placeholder `h2` elements for sidebar and main content areas
- Build passes with no errors

### 2026-04-22 — Initial Next.js Setup
- Scaffolded project with Create Next App (Next.js 16, React 19, TypeScript, Tailwind CSS v4)
- Removed default Next.js boilerplate (SVGs, placeholder page content)
- Added project context files (`project-overview.md`, `coding-standards.md`, `ai-interaction.md`, `current-feature.md`)
- Configured CLAUDE.md with stack, architecture, and commands
- Pushed initial codebase to GitHub (`keff6/devstash`)

