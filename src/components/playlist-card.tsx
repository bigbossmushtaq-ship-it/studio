import Image from "next/image";
import { Play } from "lucide-react";
import { Playlist } from "@/lib/data";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Card className="group flex items-center gap-4 overflow-hidden rounded-md bg-muted/50 transition-colors hover:bg-muted">
      <Image
        src={playlist.coverArt}
        width={80}
        height={80}
        alt={`Cover art for ${playlist.name}`}
        className="h-20 w-20 object-cover"
        data-ai-hint="album cover"
      />
      <p className="flex-1 font-semibold truncate pr-2">{playlist.name}</p>
      <Button
        size="icon"
        className="mr-4 h-12 w-12 rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 scale-0 group-hover:scale-100"
      >
        <Play className="h-6 w-6 fill-current" />
      </Button>
    </Card>
  );
}
