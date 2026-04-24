import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { Sidebar, MobileSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, sidebarData, user] = await Promise.all([
    getItemTypesWithCounts(),
    getSidebarCollections(),
    prisma.user.findUnique({
      where: { email: "demo@devstash.io" },
      select: { name: true, isPro: true },
    }),
  ]);

  const sidebarProps = {
    itemTypes,
    collections: sidebarData.collections,
    collectionCount: sidebarData.totalCount,
    user: user ?? { name: "Demo", isPro: false },
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar {...sidebarProps} />
        <MobileSidebar {...sidebarProps} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
