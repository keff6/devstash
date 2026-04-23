import {
  Archive,
  FolderOpen,
  Pin,
  Star,
} from "lucide-react";
import { getCollectionsForDashboard, getDashboardStats } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemCard } from "@/components/dashboard/item-card";

export default async function DashboardPage() {
  const [collectionsWithTypes, stats, pinnedItems, recentItems] = await Promise.all([
    getCollectionsForDashboard(),
    getDashboardStats(),
    getPinnedItems(),
    getRecentItems(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your developer knowledge hub</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Items" value={stats.totalItems} icon={Archive} iconColor="#3b82f6" />
        <StatsCard label="Collections" value={stats.totalCollections} icon={FolderOpen} iconColor="#8b5cf6" />
        <StatsCard label="Favorite Items" value={stats.favoriteItems} icon={Star} iconColor="#f59e0b" />
        <StatsCard label="Favorite Collections" value={stats.favoriteCollections} icon={Star} iconColor="#10b981" />
      </div>

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Collections</h2>
          </div>
          <a href="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            View All
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {collectionsWithTypes.map((col) => (
            <CollectionCard
              key={col.id}
              name={col.name}
              description={col.description}
              itemCount={col.itemCount}
              isFavorite={col.isFavorite}
              dominantColor={col.dominantColor}
              itemTypes={col.itemTypes}
            />
          ))}
        </div>
      </section>

      {/* Items */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Archive className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold">Items</h2>
            <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5">
              {stats.totalItems}
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            {["All", "Pinned", "Favorites"].map((tab) => (
              <button
                key={tab}
                className={`text-xs px-3 py-1 rounded-md transition-colors ${
                  tab === "All"
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned */}
        {pinnedItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3">
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Pinned</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {pinnedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  typeIcon={item.typeIcon}
                  typeColor={item.typeColor}
                  typeName={item.typeName}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  isFavorite={item.isFavorite}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-medium text-muted-foreground">Recent</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentItems.map((item) => (
              <ItemCard
                key={item.id}
                title={item.title}
                typeIcon={item.typeIcon}
                typeColor={item.typeColor}
                typeName={item.typeName}
                tags={item.tags}
                isPinned={item.isPinned}
                isFavorite={item.isFavorite}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
