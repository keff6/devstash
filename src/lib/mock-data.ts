export const mockUser = {
  id: "user_1",
  name: "Demo",
  email: "demo@ds.com",
  image: null,
  isPro: false,
};

export const mockItemTypes = [
  { id: "type_snippet", name: "snippet", icon: "Code", color: "#3b82f6", isSystem: true, count: 24 },
  { id: "type_prompt", name: "prompt", icon: "Sparkles", color: "#8b5cf6", isSystem: true, count: 15 },
  { id: "type_note", name: "note", icon: "StickyNote", color: "#fde047", isSystem: true, count: 12 },
  { id: "type_command", name: "command", icon: "Terminal", color: "#f97316", isSystem: true, count: 8 },
  { id: "type_link", name: "link", icon: "Link", color: "#10b981", isSystem: true, count: 31 },
  { id: "type_file", name: "file", icon: "File", color: "#6b7280", isSystem: true, count: 5 },
  { id: "type_image", name: "image", icon: "Image", color: "#ec4899", isSystem: true, count: 0 },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    dominantColor: "#3b82f6",
  },
  {
    id: "col_2",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 8,
    dominantColor: "#8b5cf6",
  },
  {
    id: "col_3",
    name: "Interview Prep",
    description: "Coding interview questions",
    isFavorite: true,
    itemCount: 15,
    dominantColor: "#3b82f6",
  },
  {
    id: "col_4",
    name: "DevOps Commands",
    description: "Docker, K8s, and CLI commands",
    isFavorite: false,
    itemCount: 20,
    dominantColor: "#f97316",
  },
  {
    id: "col_5",
    name: "Project Ideas",
    description: "Side project inspiration",
    isFavorite: false,
    itemCount: 6,
    dominantColor: "#fde047",
  },
  {
    id: "col_6",
    name: "Useful Resources",
    description: "Links to documentation and tutorials",
    isFavorite: true,
    itemCount: 18,
    dominantColor: "#10b981",
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "useDebounce Hook",
    contentType: "text",
    content: `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`,
    language: "typescript",
    description: null,
    isFavorite: true,
    isPinned: true,
    tags: ["react", "hooks"],
    itemTypeId: "type_snippet",
    collectionIds: ["col_1"],
    createdAt: "2026-04-20T10:00:00Z",
    lastUsedAt: "2026-04-23T08:30:00Z",
  },
  {
    id: "item_2",
    title: "Code Review Prompt",
    contentType: "text",
    content: `You are an expert code reviewer. Review the following code and provide:
1. A summary of what the code does
2. Potential bugs or issues
3. Security concerns
4. Performance improvements
5. Code style and readability suggestions

Be specific and actionable. Format your response with clear sections.

Code to review:
\`\`\`
{{code}}
\`\`\``,
    language: null,
    description: null,
    isFavorite: false,
    isPinned: true,
    tags: ["ai", "review"],
    itemTypeId: "type_prompt",
    collectionIds: ["col_2"],
    createdAt: "2026-04-19T14:00:00Z",
    lastUsedAt: "2026-04-22T16:00:00Z",
  },
  {
    id: "item_3",
    title: "Docker Compose — Postgres + Redis",
    contentType: "text",
    content: `version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
    language: "yaml",
    description: "Local dev stack with Postgres and Redis",
    isFavorite: true,
    isPinned: false,
    tags: ["docker", "postgres", "redis"],
    itemTypeId: "type_command",
    collectionIds: ["col_4"],
    createdAt: "2026-04-18T09:00:00Z",
    lastUsedAt: "2026-04-21T11:00:00Z",
  },
  {
    id: "item_4",
    title: "React Query Setup",
    contentType: "text",
    content: `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}`,
    language: "typescript",
    description: null,
    isFavorite: false,
    isPinned: false,
    tags: ["react", "react-query"],
    itemTypeId: "type_snippet",
    collectionIds: ["col_1"],
    createdAt: "2026-04-17T12:00:00Z",
    lastUsedAt: "2026-04-20T09:00:00Z",
  },
  {
    id: "item_5",
    title: "Tailwind CSS Docs",
    contentType: "url",
    url: "https://tailwindcss.com/docs",
    content: null,
    language: null,
    description: "Official Tailwind CSS documentation",
    isFavorite: true,
    isPinned: false,
    tags: ["css", "tailwind"],
    itemTypeId: "type_link",
    collectionIds: ["col_6"],
    createdAt: "2026-04-16T10:00:00Z",
    lastUsedAt: "2026-04-23T07:00:00Z",
  },
  {
    id: "item_6",
    title: "Git — Undo Last Commit",
    contentType: "text",
    content: "git reset --soft HEAD~1",
    language: "bash",
    description: "Undo last commit but keep changes staged",
    isFavorite: false,
    isPinned: false,
    tags: ["git"],
    itemTypeId: "type_command",
    collectionIds: ["col_4"],
    createdAt: "2026-04-15T08:00:00Z",
    lastUsedAt: "2026-04-22T14:00:00Z",
  },
  {
    id: "item_7",
    title: "System Design Interview Notes",
    contentType: "text",
    content: `## Key Topics

- **Scalability**: horizontal vs vertical scaling
- **Load balancing**: round-robin, least connections
- **Caching**: Redis, CDN, browser cache
- **Database**: SQL vs NoSQL, sharding, replication
- **Message queues**: Kafka, RabbitMQ, async processing
- **CAP theorem**: consistency, availability, partition tolerance

## Common Questions
- Design Twitter / Instagram
- Design a URL shortener
- Design a rate limiter`,
    language: null,
    description: null,
    isFavorite: false,
    isPinned: false,
    tags: ["interviews", "system-design"],
    itemTypeId: "type_note",
    collectionIds: ["col_3"],
    createdAt: "2026-04-14T16:00:00Z",
    lastUsedAt: "2026-04-19T10:00:00Z",
  },
  {
    id: "item_8",
    title: "Explain Code Prompt",
    contentType: "text",
    content: `Explain the following code in plain English. Assume the reader is a junior developer.

- What does it do?
- How does it work step by step?
- Are there any gotchas or edge cases?

\`\`\`
{{code}}
\`\`\``,
    language: null,
    description: null,
    isFavorite: false,
    isPinned: false,
    tags: ["ai", "explain"],
    itemTypeId: "type_prompt",
    collectionIds: ["col_2"],
    createdAt: "2026-04-13T11:00:00Z",
    lastUsedAt: "2026-04-18T13:00:00Z",
  },
];