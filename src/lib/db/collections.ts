import { prisma } from "@/lib/prisma"
import { DEMO_EMAIL } from "@/lib/constants"

type ItemTypeInfo = {
  id: string
  icon: string
  color: string
}

export type CollectionWithTypes = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  itemCount: number
  dominantColor: string
  itemTypes: ItemTypeInfo[]
}

export type DashboardStats = {
  totalItems: number
  totalCollections: number
  favoriteItems: number
  favoriteCollections: number
}

export async function getCollectionsForDashboard(): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_EMAIL } },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  })

  return collections.map((col) => {
    const typeCounts = new Map<string, { type: ItemTypeInfo; count: number }>()

    for (const ic of col.items) {
      const t = ic.item.itemType
      const entry = typeCounts.get(t.id)
      if (entry) {
        entry.count++
      } else {
        typeCounts.set(t.id, { type: { id: t.id, icon: t.icon, color: t.color }, count: 1 })
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count)
    const dominantColor = sorted[0]?.type.color ?? "#6b7280"
    const itemTypes = sorted.map((v) => v.type)

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantColor,
      itemTypes,
    }
  })
}

export type SidebarCollection = {
  id: string
  name: string
  isFavorite: boolean
  dominantColor: string
}

export type SidebarCollectionsData = {
  collections: SidebarCollection[]
  totalCount: number
}

export async function getSidebarCollections(): Promise<SidebarCollectionsData> {
  const [collections, totalCount] = await Promise.all([
    prisma.collection.findMany({
      where: { user: { email: DEMO_EMAIL } },
      include: {
        items: {
          include: { item: { include: { itemType: true } } },
        },
      },
      orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
      take: 5,
    }),
    prisma.collection.count({ where: { user: { email: DEMO_EMAIL } } }),
  ])

  return {
    collections: collections.map((col) => {
      const typeCounts = new Map<string, { color: string; count: number }>()
      for (const ic of col.items) {
        const t = ic.item.itemType
        const entry = typeCounts.get(t.id)
        if (entry) entry.count++
        else typeCounts.set(t.id, { color: t.color, count: 1 })
      }
      const dominant = [...typeCounts.values()].sort((a, b) => b.count - a.count)[0]
      return {
        id: col.id,
        name: col.name,
        isFavorite: col.isFavorite,
        dominantColor: dominant?.color ?? "#6b7280",
      }
    }),
    totalCount,
  }
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { user: { email: DEMO_EMAIL } } }),
    prisma.collection.count({ where: { user: { email: DEMO_EMAIL } } }),
    prisma.item.count({ where: { user: { email: DEMO_EMAIL }, isFavorite: true } }),
    prisma.collection.count({ where: { user: { email: DEMO_EMAIL }, isFavorite: true } }),
  ])

  return { totalItems, totalCollections, favoriteItems, favoriteCollections }
}
