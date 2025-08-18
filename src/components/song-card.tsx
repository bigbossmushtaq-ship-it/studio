import Image from "next/image";
import { Play } from "lucide-react";
import { Song } from "@/lib/data";
import { Button } from "./ui/button";

export function SongCard({ song }: { song: Song }) {
  return (
    <div className="group flex flex-col gap-2">
      <div className="relative">
        <Image
          src={song.albumArt}
          width={200}
          height={200}
          alt={`Album art for ${song.title}`}
          className="w-full rounded-md aspect-square object-cover"
          data-ai-hint="album cover"
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 h-10 w-10 rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 group-hover:bottom-3"
        >
          <Play className="h-5 w-5 fill-current" />
        </Button>
      </div>
      <div className="truncate">
        <p className="font-semibold truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
    </div>
  );
}
