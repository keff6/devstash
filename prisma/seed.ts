import "dotenv/config"
import ws from "ws"
import bcrypt from "bcryptjs"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clean previous seed data
  const existing = await prisma.user.findUnique({ where: { email: "demo@devstash.io" } })
  if (existing) {
    await prisma.user.delete({ where: { id: existing.id } })
  }
  await prisma.itemType.deleteMany({ where: { isSystem: true } })

  // ─── User ────────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("12345678", 12)
  const user = await prisma.user.create({
    data: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  })
  console.log(`Created user: ${user.email}`)

  // ─── System Item Types ───────────────────────────────────────────────────────
  const [snippet, prompt, command, , , , link] = await Promise.all([
    prisma.itemType.create({ data: { name: "snippet", icon: "Code",       color: "#3b82f6", isSystem: true } }),
    prisma.itemType.create({ data: { name: "prompt",  icon: "Sparkles",   color: "#8b5cf6", isSystem: true } }),
    prisma.itemType.create({ data: { name: "command", icon: "Terminal",   color: "#f97316", isSystem: true } }),
    prisma.itemType.create({ data: { name: "note",    icon: "StickyNote", color: "#fde047", isSystem: true } }),
    prisma.itemType.create({ data: { name: "file",    icon: "File",       color: "#6b7280", isSystem: true } }),
    prisma.itemType.create({ data: { name: "image",   icon: "Image",      color: "#ec4899", isSystem: true } }),
    prisma.itemType.create({ data: { name: "link",    icon: "Link",       color: "#10b981", isSystem: true } }),
  ])
  console.log("Created 7 system item types")

  // ─── Collection: React Patterns ─────────────────────────────────────────────
  const reactPatterns = await prisma.collection.create({
    data: { name: "React Patterns", description: "Reusable React patterns and hooks", userId: user.id },
  })

  const reactItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "useDebounce",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: snippet.id,
        content: `import { useState, useEffect } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}`,
      },
    }),
    prisma.item.create({
      data: {
        title: "useLocalStorage",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: snippet.id,
        content: `import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const set = (val: T) => {
    setValue(val)
    window.localStorage.setItem(key, JSON.stringify(val))
  }

  return [value, set] as const
}`,
      },
    }),
    prisma.item.create({
      data: {
        title: "Context Provider Pattern",
        contentType: "text",
        language: "typescript",
        userId: user.id,
        itemTypeId: snippet.id,
        content: `import { createContext, useContext, useState } from "react"

interface ThemeContextValue {
  theme: "light" | "dark"
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark")
  const toggle = () => setTheme(t => t === "dark" ? "light" : "dark")
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}`,
      },
    }),
  ])

  await Promise.all(
    reactItems.map(item =>
      prisma.itemCollection.create({ data: { itemId: item.id, collectionId: reactPatterns.id } })
    )
  )
  console.log("Created collection: React Patterns (3 snippets)")

  // ─── Collection: AI Workflows ────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.create({
    data: { name: "AI Workflows", description: "AI prompts and workflow automations", userId: user.id },
  })

  const aiItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Code Review Prompt",
        contentType: "text",
        userId: user.id,
        itemTypeId: prompt.id,
        content: `Review the following code and provide feedback on:
1. Correctness — are there any bugs or logic errors?
2. Performance — any unnecessary re-renders, N+1 queries, or expensive operations?
3. Security — input validation, auth checks, injection risks
4. Readability — naming, structure, and clarity

Be concise. List issues by severity (critical → minor). Include a short fix for each.

\`\`\`
{{code}}
\`\`\``,
      },
    }),
    prisma.item.create({
      data: {
        title: "Documentation Generator",
        contentType: "text",
        userId: user.id,
        itemTypeId: prompt.id,
        content: `Generate concise documentation for the following function or module.

Include:
- One-line summary
- Parameters (name, type, description)
- Return value
- Usage example

Keep it developer-friendly. No filler. Output in Markdown.

\`\`\`
{{code}}
\`\`\``,
      },
    }),
    prisma.item.create({
      data: {
        title: "Refactoring Assistant",
        contentType: "text",
        userId: user.id,
        itemTypeId: prompt.id,
        content: `Refactor the following code to improve readability and maintainability.

Rules:
- Preserve existing behavior exactly
- Prefer clarity over cleverness
- Extract repeated logic into helpers
- Use early returns to reduce nesting
- Do not add features or change the public API

Show the refactored version only. No explanations unless something is non-obvious.

\`\`\`
{{code}}
\`\`\``,
      },
    }),
  ])

  await Promise.all(
    aiItems.map(item =>
      prisma.itemCollection.create({ data: { itemId: item.id, collectionId: aiWorkflows.id } })
    )
  )
  console.log("Created collection: AI Workflows (3 prompts)")

  // ─── Collection: DevOps ──────────────────────────────────────────────────────
  const devops = await prisma.collection.create({
    data: { name: "DevOps", description: "Infrastructure and deployment resources", userId: user.id },
  })

  const devopsItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Node.js Dockerfile",
        contentType: "text",
        language: "dockerfile",
        userId: user.id,
        itemTypeId: snippet.id,
        content: `FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker build & run",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: command.id,
        content: `docker build -t myapp:latest . && docker run -p 3000:3000 --env-file .env myapp:latest`,
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker Hub",
        contentType: "url",
        url: "https://hub.docker.com",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "GitHub Actions Docs",
        contentType: "url",
        url: "https://docs.github.com/en/actions",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
  ])

  await Promise.all(
    devopsItems.map(item =>
      prisma.itemCollection.create({ data: { itemId: item.id, collectionId: devops.id } })
    )
  )
  console.log("Created collection: DevOps (1 snippet, 1 command, 2 links)")

  // ─── Collection: Terminal Commands ──────────────────────────────────────────
  const terminal = await prisma.collection.create({
    data: { name: "Terminal Commands", description: "Useful shell commands for everyday development", userId: user.id },
  })

  const terminalItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Git pretty log",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: command.id,
        content: `git log --oneline --graph --decorate --all`,
      },
    }),
    prisma.item.create({
      data: {
        title: "Docker full cleanup",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: command.id,
        content: `docker system prune -af --volumes`,
      },
    }),
    prisma.item.create({
      data: {
        title: "Kill process on port",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: command.id,
        content: `lsof -ti :<PORT> | xargs kill -9`,
      },
    }),
    prisma.item.create({
      data: {
        title: "List top-level dependencies",
        contentType: "text",
        language: "bash",
        userId: user.id,
        itemTypeId: command.id,
        content: `npm ls --depth=0`,
      },
    }),
  ])

  await Promise.all(
    terminalItems.map(item =>
      prisma.itemCollection.create({ data: { itemId: item.id, collectionId: terminal.id } })
    )
  )
  console.log("Created collection: Terminal Commands (4 commands)")

  // ─── Collection: Design Resources ───────────────────────────────────────────
  const design = await prisma.collection.create({
    data: { name: "Design Resources", description: "UI/UX resources and references", userId: user.id },
  })

  const designItems = await Promise.all([
    prisma.item.create({
      data: {
        title: "Tailwind CSS Docs",
        contentType: "url",
        url: "https://tailwindcss.com/docs",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "shadcn/ui",
        contentType: "url",
        url: "https://ui.shadcn.com",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Radix UI Primitives",
        contentType: "url",
        url: "https://www.radix-ui.com/primitives",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
    prisma.item.create({
      data: {
        title: "Lucide Icons",
        contentType: "url",
        url: "https://lucide.dev/icons",
        userId: user.id,
        itemTypeId: link.id,
      },
    }),
  ])

  await Promise.all(
    designItems.map(item =>
      prisma.itemCollection.create({ data: { itemId: item.id, collectionId: design.id } })
    )
  )
  console.log("Created collection: Design Resources (4 links)")

  console.log("\nDone.")
}

main()
  .catch((err) => {
    console.error("Seed failed:", err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
