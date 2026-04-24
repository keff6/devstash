"use client";

import Link from "next/link";
import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Settings,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface ItemTypeItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

interface SidebarCollectionItem {
  id: string;
  name: string;
  isFavorite: boolean;
  dominantColor: string;
}

interface SidebarUser {
  name: string | null;
  isPro: boolean;
}

interface SidebarDataProps {
  itemTypes: ItemTypeItem[];
  collections: SidebarCollectionItem[];
  collectionCount: number;
  user: SidebarUser;
}

function SidebarContent({
  collapsed,
  itemTypes,
  collections,
  collectionCount,
  user,
}: { collapsed: boolean } & SidebarDataProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-600 text-white">
          <Code className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">DevStash</span>
            <span className="text-[11px] text-muted-foreground">Developer Hub</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        {/* Item Types */}
        <section>
          {!collapsed && (
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Item Types
            </p>
          )}
          <ul className="space-y-0.5">
            {itemTypes.map((type) => {
              const Icon = ICON_MAP[type.icon] ?? File;
              return (
                <li key={type.id}>
                  <Link
                    href={`/items/${type.name}s`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      collapsed && "justify-center"
                    )}
                    title={collapsed ? `${type.name}s` : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" style={{ color: type.color }} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 capitalize">{type.name}s</span>
                        {(type.name === "file" || type.name === "image") ? (
                          <Badge variant="outline" className="h-4 px-1 text-[10px] font-semibold text-muted-foreground border-muted-foreground/30">
                            PRO
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">{type.count}</span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Collections */}
        <section>
          {!collapsed && (
            <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Collections
            </p>
          )}
          <ul className="space-y-0.5">
            {collections.map((col) => (
              <li key={col.id}>
                <Link
                  href={`/collections/${col.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? col.name : undefined}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: col.dominantColor }}
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{col.name}</span>
                      {col.isFavorite && (
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          {!collapsed && (
            <Link
              href="/collections"
              className="mt-1 flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              View all collections ({collectionCount})
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </section>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-3 space-y-0.5">
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-1.5",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase">
            {user.name?.charAt(0) ?? "D"}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {user.isPro ? "Pro" : "Free Plan"}
                </p>
              </div>
              <Link href="/settings" className="text-muted-foreground hover:text-foreground">
                <Settings className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarDataProps) {
  const { collapsed } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col shrink-0 border-r border-border bg-background transition-all duration-200",
          collapsed ? "w-14" : "w-60"
        )}
      >
        <SidebarContent collapsed={collapsed} {...props} />
      </aside>
    </>
  );
}

export function MobileSidebar(props: SidebarDataProps) {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={closeMobile}>
      <SheetContent side="left" className="w-60 p-0 bg-background">
        <SidebarContent collapsed={false} {...props} />
      </SheetContent>
    </Sheet>
  );
}
