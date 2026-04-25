import { File, Pin, Star } from "lucide-react";
import { ICON_MAP } from "@/lib/icon-map";

interface ItemCardProps {
  title: string;
  typeIcon: string;
  typeColor: string;
  typeName: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
}

export function ItemCard({
  title,
  typeIcon,
  typeColor,
  typeName,
  tags,
  isPinned,
  isFavorite,
}: ItemCardProps) {
  const Icon = ICON_MAP[typeIcon] ?? File;

  return (
    <div className="relative rounded-lg border border-border bg-card flex flex-col overflow-hidden hover:border-border/80 transition-colors cursor-pointer">
      {/* Top color bar */}
      <div className="h-[3px] w-full" style={{ backgroundColor: typeColor }} />

      <div className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Icon className="h-4 w-4 shrink-0" style={{ color: typeColor }} />
            <span className="text-sm font-medium truncate">{title}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isPinned && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
            {isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span
              className="text-[11px] rounded px-1.5 py-0.5 font-medium capitalize"
              style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
            >
              {typeName}
            </span>
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] rounded px-1.5 py-0.5 bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
