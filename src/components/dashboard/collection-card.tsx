import {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link as LinkIcon,
  File,
  Image as ImageIcon,
  Star,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Code,
  Sparkles,
  StickyNote,
  Terminal,
  Link: LinkIcon,
  File,
  Image: ImageIcon,
};

interface ItemType {
  id: string;
  icon: string;
  color: string;
}

interface CollectionCardProps {
  name: string;
  description: string | null;
  itemCount: number;
  isFavorite: boolean;
  dominantColor: string;
  itemTypes: ItemType[];
}

export function CollectionCard({
  name,
  description,
  itemCount,
  isFavorite,
  dominantColor,
  itemTypes,
}: CollectionCardProps) {
  return (
    <div className="relative rounded-lg border border-border bg-card p-5 flex flex-col gap-3 hover:border-border/80 transition-colors overflow-hidden">
      {/* Left color accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg"
        style={{ backgroundColor: dominantColor }}
      />

      <div className="pl-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{name}</h3>
          {isFavorite && <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 shrink-0" />}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
        )}
      </div>

      <div className="pl-1 flex items-center justify-between mt-auto">
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2.5 py-0.5">
          {itemCount} items
        </span>
        <div className="flex items-center gap-1.5">
          {itemTypes.map((type) => {
            const Icon = ICON_MAP[type.icon] ?? File;
            return <Icon key={type.id} className="h-3.5 w-3.5" style={{ color: type.color }} />;
          })}
        </div>
      </div>
    </div>
  );
}
