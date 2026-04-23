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
  FolderOpen,
  HelpCircle,
  Settings,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockCollections, mockItemTypes, mockUser } from "@/lib/mock-data";
import { useSidebar } from "./sidebar-context";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

const favoriteCollections = mockCollections.filter((c) => c.isFavorite);
const recentCollections = mockCollections
  .filter((c) => !c.isFavorite)
  .slice(0, 2);
const sidebarCollections = [...favoriteCollections, ...recentCollections].slice(0, 5);

function SidebarContent({ collapsed }: { collapsed: boolean }) {
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
            {mockItemTypes.map((type) => {
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
                        <span className="text-xs text-muted-foreground">{type.count}</span>
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
            {sidebarCollections.map((col) => (
              <li key={col.id}>
                <Link
                  href={`/collections/${col.id}`}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? col.name : undefined}
                >
                  <FolderOpen className="h-4 w-4 shrink-0" style={{ color: col.dominantColor }} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{col.name}</span>
                      {col.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
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
              View all ({mockCollections.length})
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </section>
      </nav>

      {/* Bottom */}
      <div className="border-t border-border px-2 py-3 space-y-0.5">
        <Link
          href="/help"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Help & Support" : undefined}
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Help &amp; Support</span>}
        </Link>

        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2 py-1.5",
            collapsed && "justify-center"
          )}
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold uppercase">
            {mockUser.name.charAt(0)}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 leading-tight">
                <p className="text-sm font-medium truncate">{mockUser.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {mockUser.isPro ? "Pro" : "Free Plan"}
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

export function Sidebar() {
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
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile: rendered via MobileSidebar below */}
    </>
  );
}

export function MobileSidebar() {
  const { mobileOpen, closeMobile } = useSidebar();

  return (
    <Sheet open={mobileOpen} onOpenChange={closeMobile}>
      <SheetContent side="left" className="w-60 p-0 bg-background">
        <SidebarContent collapsed={false} />
      </SheetContent>
    </Sheet>
  );
}
