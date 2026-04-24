import { prisma } from "@/lib/prisma"
import type { Prisma } from "../../../generated/prisma/client"

const DEMO_EMAIL = "demo@devstash.io"

export type ItemTypeForSidebar = {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

export async function getItemTypesWithCounts(): Promise<ItemTypeForSidebar[]> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    select: { id: true },
  })

  if (!user) return []

  const TYPE_ORDER = ["snippet", "prompt", "command", "note", "file", "image", "link"]

  const [itemTypes, counts] = await Promise.all([
    prisma.itemType.findMany({
      where: { isSystem: true },
    }),
    prisma.item.groupBy({
      by: ["itemTypeId"],
      where: { userId: user.id },
      _count: { id: true },
    }),
  ])

  const countMap = new Map(counts.map((c) => [c.itemTypeId, c._count.id]))

  return itemTypes
    .sort((a, b) => {
      const ai = TYPE_ORDER.indexOf(a.name)
      const bi = TYPE_ORDER.indexOf(b.name)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })
    .map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    count: countMap.get(t.id) ?? 0,
  }))
}

const itemInclude = {
  itemType: true,
  tags: true,
} satisfies Prisma.ItemInclude

type ItemWithRelations = Prisma.ItemGetPayload<{ include: typeof itemInclude }>

export type ItemForCard = {
  id: string
  title: string
  isPinned: boolean
  isFavorite: boolean
  typeIcon: string
  typeColor: string
  typeName: string
  tags: string[]
}

function mapItem(item: ItemWithRelations): ItemForCard {
  return {
    id: item.id,
    title: item.title,
    isPinned: item.isPinned,
    isFavorite: item.isFavorite,
    typeIcon: item.itemType.icon,
    typeColor: item.itemType.color,
    typeName: item.itemType.name,
    tags: item.tags.map((t) => t.name),
  }
}

export async function getPinnedItems(): Promise<ItemForCard[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_EMAIL }, isPinned: true },
    include: itemInclude,
    orderBy: { updatedAt: "desc" },
  })
  return items.map(mapItem)
}

export async function getRecentItems(limit = 10): Promise<ItemForCard[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_EMAIL } },
    include: itemInclude,
    orderBy: { lastUsedAt: { sort: "desc", nulls: "last" } },
    take: limit,
  })
  return items.map(mapItem)
}
