

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Library,
  LogOut,
  Search,
  Upload,
  Settings,
  Bell,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { MusicPlayer } from "@/components/music-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MusicAvatar } from "@/components/music-avatar";
import { useMusicPlayer } from "@/hooks/use-music-player";


function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { isMobile } = useSidebar();

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/home")}
            tooltip={isMobile ? undefined : "Home"}
          >
            <Link href="/home">
              <Home />
              Home
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/search")}
            tooltip={isMobile ? undefined : "Search"}
          >
            <Link href="/search">
              <Search />
              Search
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/library")}
            tooltip={isMobile ? undefined : "Your Library"}
          >
            <Link href="/library">
              <Library />
              Your Library
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
         <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={isActive("/upload")}
            tooltip={isMobile ? undefined : "Upload"}
          >
            <Link href="/upload">
              <Upload />
              Upload
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

const BottomNavBar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-20 md:hidden">
      <div className="flex justify-around h-16 items-center">
        <Link href="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home />
          <span className="text-xs">Home</span>
        </Link>
         <Link href="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Search />
          <span className="text-xs">Search</span>
        </Link>
         <Link href="/upload" className={`flex flex-col items-center gap-1 ${isActive('/upload') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Upload />
          <span className="text-xs">Upload</span>
        </Link>
        <Link href="/library" className={`flex flex-col items-center gap-1 ${isActive('/library') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Library />
          <span className="text-xs">Library</span>
        </Link>
      </div>
    </div>
  )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { profilePic, setProfilePic } = useMusicPlayer();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePic(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="grid h-screen w-full grid-rows-[1fr_auto] bg-background">
        <div className="flex overflow-hidden">
          <Sidebar>
            <SidebarContent className="flex flex-col items-center p-4">
              <div className="flex flex-col items-center py-4 border-b w-full">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profilePic} alt="Profile" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="mt-4">
                    <Button asChild size="sm" className="rounded-full text-xs h-8">
                      <label className="cursor-pointer">
                        Change Picture
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </Button>
                  </div>
                </div>
              
              <div className="w-full mt-4">
                <SidebarNav />
              </div>

              <div className="mt-auto w-full">
                <div className="flex flex-col gap-1 py-2 border-t">
                  <Button variant="ghost" className="justify-start"><Settings className="mr-2"/> Settings</Button>
                  <Button variant="ghost" className="justify-start"><Bell className="mr-2"/> Notifications</Button>
                </div>

                <Button variant="destructive" className="w-full justify-center mt-2" asChild>
                  <Link href="/"><LogOut className="mr-2" />Logout</Link>
                </Button>
              </div>

            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-10">
              <SidebarTrigger>
                 <MusicAvatar size={32} ringWidth={2}/>
              </SidebarTrigger>
              <div className="flex-1">
                {/* Header content like search bar can go here */}
              </div>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 pb-40 md:pb-32">
              {children}
            </main>
          </SidebarInset>
        </div>
        <div className="fixed bottom-0 w-full z-20 md:pl-[3rem] group-data-[state=expanded]:md:pl-[16rem] transition-all duration-200 ease-linear">
            <div className="md:px-2">
              <MusicPlayer />
            </div>
            <BottomNavBar />
        </div>
      </div>
    </SidebarProvider>
  );
}
