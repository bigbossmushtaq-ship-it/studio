
import { Button } from "@/components/ui/button";
import { SongList } from "@/components/song-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";

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
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">Create your first playlist</h3>
            <p className="text-muted-foreground mt-2 mb-4">It's easy, we'll help you.</p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create playlist
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="songs" className="mt-6">
           <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg text-center">
            <h3 className="text-xl font-semibold">Songs you like will appear here</h3>
            <p className="text-muted-foreground mt-2">Save songs by tapping the heart icon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
