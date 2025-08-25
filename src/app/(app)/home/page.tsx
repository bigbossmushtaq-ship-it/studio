
"use client";
import * as React from "react";
import { playlists, songs as mockSongs, Song } from "@/lib/data";
import { SongCard } from "@/components/song-card";
import { PlaylistCard } from "@/components/playlist-card";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/hooks/use-app";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user, setPlaylist } = useApp();
  const { toast } = useToast();
  const [uploadedSongs, setUploadedSongs] = React.useState<Song[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("all");

  const fetchSongs = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }
      
      const songs = data as Song[];
      setUploadedSongs(songs);
      setPlaylist(songs);

    } catch (error: any) {
      console.error("Error fetching songs:", error);
      toast({
        variant: 'destructive',
        title: "Failed to load uploaded songs",
        description: error.message || "Could not retrieve your uploaded songs.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, setPlaylist]);

  React.useEffect(() => {
    // Fetch songs on initial load of the component for the "recent" tab
    fetchSongs();
  }, [fetchSongs]);


  return (
    <div className="space-y-8">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="music">Music</TabsTrigger>
          <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
          <TabsTrigger value="recent">Recently Uploaded</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6 space-y-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Your Playlists</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {playlists.slice(0, 4).map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight mb-4">Jump back in</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        </TabsContent>
         <TabsContent value="music">
          <p className="text-center py-12">Music content will be displayed here.</p>
        </TabsContent>
        <TabsContent value="podcasts">
          <p className="text-center py-12">Podcast content will be displayed here.</p>
        </TabsContent>
        <TabsContent value="recent" className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : uploadedSongs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {uploadedSongs.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No songs uploaded by the community yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
