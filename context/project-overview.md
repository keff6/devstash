# DevStash — Project Overview

> **One fast, searchable, AI-enhanced hub for all developer knowledge & resources.**

---

## Table of Contents

- [Problem](#problem)
- [Target Users](#target-users)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Data Models](#data-models)
- [UI/UX](#uiux)
- [Monetization](#monetization)

---

## Problem

Developers keep their essentials scattered across too many places:

| Resource | Where it lives |
|---|---|
| Code snippets | VS Code, Notion |
| AI prompts | Chat histories |
| Context files | Buried in project folders |
| Useful links | Browser bookmarks |
| Documentation | Random folders |
| Commands | `.txt` files, bash history |
| Project templates | GitHub Gists |

This creates context switching, lost knowledge, and inconsistent workflows. **DevStash consolidates everything into one place.**

---

## Target Users

| User | Core Need |
|---|---|
| **Everyday Developer** | Quickly grab snippets, prompts, commands, links |
| **AI-first Developer** | Save prompts, contexts, workflows, system messages |
| **Content Creator / Educator** | Store code blocks, explanations, course notes |
| **Full-stack Builder** | Collect patterns, boilerplates, API examples |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) + [React 19](https://react.dev/) |
| **Language** | TypeScript |
| **Database** | [Neon](https://neon.tech/) (PostgreSQL) |
| **ORM** | [Prisma 7](https://www.prisma.io/docs) |
| **Auth** | [NextAuth v5](https://authjs.dev/) — Email/password + GitHub OAuth |
| **File Storage** | [Cloudflare R2](https://developers.cloudflare.com/r2/) |
| **AI** | OpenAI `gpt-4o-mini` |
| **CSS** | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Caching** | Redis *(optional)* |
| **Rendering** | SSR pages with dynamic components |

> ⚠️ **Database rule:** Never use `db push`. Always create and run explicit migrations in dev before promoting to prod.

---

## Features

### A. Items & Item Types

Items are the core unit in DevStash. Each item has a **type** that determines its behavior, icon, and color.

**System types** (built-in, non-editable):

| Type | Icon | Color | Content Kind | URL Pattern |
|---|---|---|---|---|
| `snippet` | `<Code />` | `#3b82f6` Blue | Text | `/items/snippets` |
| `prompt` | `<Sparkles />` | `#8b5cf6` Purple | Text | `/items/prompts` |
| `note` | `<StickyNote />` | `#fde047` Yellow | Text | `/items/notes` |
| `command` | `<Terminal />` | `#f97316` Orange | Text | `/items/commands` |
| `link` | `<Link />` | `#10b981` Emerald | URL | `/items/links` |
| `file` | `<File />` | `#6b7280` Gray | File *(Pro)* | `/items/files` |
| `image` | `<Image />` | `#ec4899` Pink | File *(Pro)* | `/items/images` |

Users can create **custom types** (Pro — coming later).

Items are accessed and created quickly via a **slide-in drawer**.

---

### B. Collections

Collections are user-defined groups that can contain any mix of item types.

- An item can belong to **multiple collections** (many-to-many)
- Examples: `React Patterns`, `Interview Prep`, `Context Files`, `Python Snippets`
- Each collection has an optional `defaultTypeId` for new-item defaults

---

### C. Search

Full-text search across:
- Item title
- Item content
- Tags
- Item type

---

### D. Authentication

- Email + password
- GitHub OAuth (via NextAuth v5)

---

### E. General Features

- Favorites on items and collections
- Pin items to top
- Recently used items
- Import code from file
- Markdown editor for text-type items
- File upload for `file` and `image` types
- Export data (JSON / ZIP)
- Dark mode default, light mode optional
- Add/remove items from multiple collections
- View which collections an item belongs to
- Toast notifications, loading skeletons, hover states

---

### F. AI Features *(Pro only)*

| Feature | Description |
|---|---|
| **Auto-tag suggestions** | AI suggests relevant tags on save |
| **AI Summaries** | One-click summary of any item |
| **Explain This Code** | Plain-English explanation of a snippet |
| **Prompt Optimizer** | Rewrites and improves AI prompts |

---

## Data Models

### Prisma Schema

```prisma
model User {
  id                     String       @id @default(cuid())
  name                   String?
  email                  String?      @unique
  emailVerified          DateTime?
  image                  String?
  isPro                  Boolean      @default(false)
  stripeCustomerId       String?      @unique
  stripeSubscriptionId   String?      @unique
  items                  Item[]
  collections            Collection[]
  itemTypes              ItemType[]
  accounts               Account[]
  sessions               Session[]
  createdAt              DateTime     @default(now())
  updatedAt              DateTime     @updatedAt
}

model ItemType {
  id        String   @id @default(cuid())
  name      String
  icon      String
  color     String
  isSystem  Boolean  @default(false)
  userId    String?
  user      User?    @relation(fields: [userId], references: [id], onDelete: Cascade)
  items     Item[]
}

model Item {
  id          String            @id @default(cuid())
  title       String
  contentType String            // "text" | "file" | "url"
  content     String?           // text content (null for file/url types)
  fileUrl     String?           // Cloudflare R2 URL
  fileName    String?
  fileSize    Int?              // bytes
  url         String?           // for link types
  description String?
  language    String?           // e.g. "typescript", "python"
  isFavorite  Boolean          @default(false)
  isPinned    Boolean          @default(false)
  lastUsedAt  DateTime?
  userId      String
  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemTypeId  String
  itemType    ItemType         @relation(fields: [itemTypeId], references: [id])
  tags        Tag[]
  collections ItemCollection[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model Collection {
  id            String           @id @default(cuid())
  name          String
  description   String?
  isFavorite    Boolean          @default(false)
  defaultTypeId String?
  userId        String
  user          User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  items         ItemCollection[]
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt
}

model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime   @default(now())
  item         Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  items Item[]
}
```

---

### Entity Relationship Diagram

```
User
 ├── Item[]          (1:many)
 ├── Collection[]    (1:many)
 └── ItemType[]      (1:many, null for system types)

Item
 ├── ItemType        (many:1)
 ├── Tag[]           (many:many)
 └── Collection[]    (many:many via ItemCollection)

ItemCollection       (join table)
 ├── itemId
 ├── collectionId
 └── addedAt
```

---

## UI/UX

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  Sidebar (collapsible)    │  Main Content               │
│                           │                             │
│  [DevStash logo]          │  Collections Grid           │
│                           │  ┌──────┐ ┌──────┐          │
│  Item Types               │  │React │ │AI    │          │
│  ├─ Snippets              │  │Hooks │ │Prompts          │
│  ├─ Prompts               │  └──────┘ └──────┘          │
│  ├─ Commands              │                             │
│  ├─ Notes                 │  Items                      │
│  ├─ Links                 │  ┌──────┐ ┌──────┐          │
│  └─ Files (Pro)           │  │snip  │ │cmd   │          │
│                           │  └──────┘ └──────┘          │
│  Collections              │                             │
│  ├─ React Patterns        │                             │
│  └─ Interview Prep        │                             │
│                           │                             │
│  [+ New Item]             │                             │
└─────────────────────────────────────────────────────────┘
```

- **Sidebar:** Item type links + latest collections. Collapses to icon-only on narrow viewports; becomes a full drawer on mobile.
- **Collections:** Color-coded cards. Background color reflects the most common item type in that collection.
- **Items:** Color-coded border by type. Click opens a quick-access **drawer** (no full-page navigation).
- **Individual items:** Open in a side drawer with full edit, copy, tag, and collection management.

### Design Principles

- Modern, minimal, developer-focused
- **Dark mode default** — light mode optional
- Clean typography, generous whitespace, subtle borders and shadows
- Syntax highlighting in code blocks
- References: [Notion](https://notion.so), [Linear](https://linear.app), [Raycast](https://www.raycast.com)

### Screenshots

Refer to the screenshots below for the dashboard ui design. It does not have to be exact, just a reference:

- @context/screenshots/dashboard-ui.png
- @context/screenshots/dashboard-ui-drawer.png

### Micro-interactions

- Smooth drawer transitions
- Hover states on cards
- Toast notifications for all actions
- Loading skeleton screens

---

## Monetization

Freemium model. During development, **all users have full access**.

| Feature | Free | Pro ($8/mo or $72/yr) |
|---|---|---|
| Items | 50 total | Unlimited |
| Collections | 3 | Unlimited |
| Item types | All except file/image | All (+ custom later) |
| File & image uploads | ✗ | ✓ |
| AI features | ✗ | ✓ |
| Export (JSON / ZIP) | ✗ | ✓ |
| Priority support | ✗ | ✓ |

Payments via **Stripe** — `stripeCustomerId` and `stripeSubscriptionId` stored on the User model.
