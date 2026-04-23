"use client";

import { Menu, PanelLeft, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "./sidebar-context";

export function TopBar() {
  const { toggle } = useSidebar();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-border bg-background px-4">
      {/* Mobile: hamburger to open drawer */}
      <Button variant="ghost" size="icon" className="shrink-0 md:hidden" onClick={toggle}>
        <Menu className="h-5 w-5" />
      </Button>
      {/* Desktop: collapse/expand sidebar */}
      <Button variant="ghost" size="icon" className="shrink-0 hidden md:flex" onClick={toggle}>
        <PanelLeft className="h-5 w-5" />
      </Button>

      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search items, collections, tags..."
          className="pl-9 bg-muted/40 border-muted"
        />
      </div>

      <div className="ml-auto">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
