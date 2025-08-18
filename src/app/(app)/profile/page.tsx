
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Profile Picture</CardTitle>
          <CardDescription>
            Click on the image to upload a new profile picture.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <Label
              htmlFor="avatar-upload"
              className="cursor-pointer"
            >
                <Avatar className="h-48 w-48">
                <AvatarImage src="https://placehold.co/200x200.png" alt="User" data-ai-hint="user avatar" />
                <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                <span>Upload</span>
                </div>
            </Label>
             <Input id="avatar-upload" type="file" accept="image/*" className="hidden" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
