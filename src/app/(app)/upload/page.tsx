import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Upload Song</h2>
        <p className="text-muted-foreground">
          Add your own music to TuneFlow.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Song Details</CardTitle>
          <CardDescription>
            Fill out the information for the song you want to upload.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter song title" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">Artist</Label>
              <Input id="artist" placeholder="Enter artist name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input id="album" placeholder="Enter album name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" placeholder="Enter genre" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Album Art</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="album-art-upload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or GIF (MAX. 800x800px)</p>
                </div>
                <Input id="album-art-upload" type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Song File</Label>
             <div className="flex items-center justify-center w-full">
              <label
                htmlFor="song-file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">MP3 or WAV (MAX. 10MB)</p>
                </div>
                <Input id="song-file-upload" type="file" className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Upload Song</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
