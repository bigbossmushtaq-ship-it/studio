import Image from "next/image";
import { Clock, Dot } from "lucide-react";
import { Song } from "@/lib/data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AlbumArt from "./album-art";

function SongItemRow({ song, index }: { song: Song; index: number }) {
  return (
    <TableRow className="group">
      <TableCell className="w-12 text-center">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-4">
          <AlbumArt
            src={song.albumArt}
            width={40}
            height={40}
            alt={song.title}
            className="rounded"
          />
          <div className="truncate">
            <p className="font-medium truncate">{song.title}</p>
            <p className="text-muted-foreground truncate">{song.artist}</p>
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell truncate">{song.album}</TableCell>
      <TableCell className="text-right">{song.duration}</TableCell>
    </TableRow>
  );
}

export function SongList({ songs }: { songs: Song[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead>Track</TableHead>
          <TableHead className="hidden md:table-cell">Album</TableHead>
          <TableHead className="text-right">
            <Clock className="h-4 w-4 inline-block" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {songs.map((song, index) => (
          <SongItemRow key={song.id} song={song} index={index} />
        ))}
      </TableBody>
    </Table>
  );
}
