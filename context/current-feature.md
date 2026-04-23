# Current Feature

## Status

—

## Goals

—

## Notes

—

## History

<!-- Keep this updated. Earliest to Latest -->

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

