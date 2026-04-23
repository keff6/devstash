import { prisma } from "@/lib/prisma"
import type { Prisma } from "../../../generated/prisma/client"

const DEMO_EMAIL = "demo@devstash.io"

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
