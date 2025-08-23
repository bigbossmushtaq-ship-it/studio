
import Image from "next/image";
import { Play } from "lucide-react";
import { Song } from "@/lib/data";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import AlbumArt from "./album-art";
import { useApp } from "@/hooks/use-app";

export function SongCard({ song }: { song: Song }) {
  const { setCurrentSong, setIsPlaying } = useApp();

  const handlePlay = () => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <Card className="group flex flex-col gap-2 p-4 bg-card hover:bg-muted/80 transition-colors">
      <div className="relative">
        <AlbumArt
          src={song.album_art_url || song.albumArt || ''}
          alt={`Album art for ${song.title}`}
          className="w-full rounded-md aspect-square object-cover"
        />
        <Button
          size="icon"
          onClick={handlePlay}
          className="absolute bottom-2 right-2 h-12 w-12 rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 group-hover:bottom-3 scale-0 group-hover:scale-100"
        >
          <Play className="h-6 w-6 fill-current" />
        </Button>
      </div>
      <div className="truncate pt-2">
        <p className="font-semibold truncate">{song.title}</p>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
      </div>
    </Card>
  );
}
