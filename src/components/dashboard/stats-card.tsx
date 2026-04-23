import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
}

export function StatsCard({ label, value, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
