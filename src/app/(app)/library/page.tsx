import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playlists, songs } from "@/lib/data";
import { PlaylistCard } from "@/components/playlist-card";
import { SongList } from "@/components/song-list";

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Your Library</h2>
      </div>
      <Tabs defaultValue="playlists" className="w-full">
        <TabsList>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
          <TabsTrigger value="songs">Liked Songs</TabsTrigger>
        </TabsList>
        <TabsContent value="playlists" className="mt-6">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlists.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="songs" className="mt-6">
          <SongList songs={songs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
