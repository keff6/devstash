import {
  Archive,
  FolderOpen,
  Pin,
  Star,
} from "lucide-react";
import { mockCollections, mockItems, mockItemTypes } from "@/lib/mock-data";
import { StatsCard } from "@/components/dashboard/stats-card";
import { CollectionCard } from "@/components/dashboard/collection-card";
import { ItemCard } from "@/components/dashboard/item-card";

const totalItems = mockItemTypes.reduce((sum, t) => sum + t.count, 0);
const totalCollections = mockCollections.length;
const favoriteItems = mockItems.filter((i) => i.isFavorite).length;
const favoriteCollections = mockCollections.filter((c) => c.isFavorite).length;

const collectionsWithTypes = mockCollections.map((col) => {
  const items = mockItems.filter((item) => item.collectionIds.includes(col.id));
  const seenTypeIds = new Set<string>();
  const types = items
    .map((item) => mockItemTypes.find((t) => t.id === item.itemTypeId))
    .filter((t): t is NonNullable<typeof t> => !!t && !seenTypeIds.has(t.id) && !!seenTypeIds.add(t.id));
  return { ...col, itemTypes: types };
});

const pinnedItems = mockItems.filter((i) => i.isPinned);
const recentItems = [...mockItems]
  .sort((a, b) => new Date(b.lastUsedAt ?? 0).getTime() - new Date(a.lastUsedAt ?? 0).getTime())
  .slice(0, 10);

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your developer knowledge hub</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Items" value={totalItems} icon={Archive} iconColor="#3b82f6" />
        <StatsCard label="Collections" value={totalCollections} icon={FolderOpen} iconColor="#8b5cf6" />
        <StatsCard label="Favorite Items" value={favoriteItems} icon={Star} iconColor="#f59e0b" />
        <StatsCard label="Favorite Collections" value={favoriteCollections} icon={Star} iconColor="#10b981" />
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
              description={col.description ?? null}
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
              {mockItems.length}
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
              {pinnedItems.map((item) => {
                const type = mockItemTypes.find((t) => t.id === item.itemTypeId)!;
                return (
                  <ItemCard
                    key={item.id}
                    title={item.title}
                    typeIcon={type.icon}
                    typeColor={type.color}
                    typeName={type.name}
                    tags={item.tags}
                    isPinned={item.isPinned}
                    isFavorite={item.isFavorite}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs font-medium text-muted-foreground">Recent</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {recentItems.map((item) => {
              const type = mockItemTypes.find((t) => t.id === item.itemTypeId)!;
              return (
                <ItemCard
                  key={item.id}
                  title={item.title}
                  typeIcon={type.icon}
                  typeColor={type.color}
                  typeName={type.name}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  isFavorite={item.isFavorite}
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
