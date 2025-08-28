
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Library,
  LogOut,
  Search,
  Upload,
  Settings,
  Bell,
  User,
  ArrowLeft,
  Pencil,
  Plus,
  Loader2,
  Music,
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
import { Button, buttonVariants } from "@/components/ui/button";
import { MusicPlayer } from "@/components/music-player";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { MusicAvatar } from "@/components/music-avatar";
import { useApp } from "@/hooks/use-app";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/icons/logo";

function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
  const { isMobile } = useSidebar();
  const router = useRouter();

  return (
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
          tooltip={isMobile ? undefined : "Create"}
        >
          <Link href="/upload">
            <Upload />
            Create
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
       <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive("/url-player")}
          tooltip={isMobile ? undefined : "URL Player"}
        >
          <Link href="/url-player">
            <Music />
            URL Player
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

const BottomNavBar = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  
  if (pathname.startsWith('/settings')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t z-30 md:hidden">
      <div className="flex justify-around h-16 items-center">
        <Link href="/home" className={`flex flex-col items-center gap-1 ${isActive('/home') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
         <Link href="/search" className={`flex flex-col items-center gap-1 ${isActive('/search') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Search className="h-6 w-6" />
          <span className="text-xs">Search</span>
        </Link>
        <Link href="/library" className={`flex flex-col items-center gap-1 ${isActive('/library') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Library className="h-6 w-6" />
          <span className="text-xs">Your Library</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}>
          <User className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { theme, customColors } = useTheme();
  const { username, setProfilePic, logout, session, loading, currentSong } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useSidebar();

  React.useEffect(() => {
    if (!loading && !session) {
      router.replace('/');
    }
  }, [session, loading, router]);
  
  const isActive = (path: string) => pathname.startsWith(path);
  const isSettingsPage = pathname.startsWith('/settings');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        toast({
          title: "Success!",
          description: "Profile picture updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const customStyle = theme === 'theme-custom' ? {
    '--primary': customColors.primary,
    '--background': customColors.background,
    '--accent': customColors.accent,
  } as React.CSSProperties : {};
  
  if (loading || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const mainContentPadding = currentSong ? "pb-44 md:pb-24" : "pb-24 md:pb-8";


  return (
     <div className={`grid h-screen w-full grid-rows-[1fr_auto] bg-background ${theme}`} style={customStyle}>
      <div className="flex overflow-hidden">
        <Sidebar>
          <SidebarContent className="flex flex-col p-2">
             <SidebarHeader className="flex flex-col items-center justify-center p-4 gap-2">
                <MusicAvatar size={64} ringWidth={4}/>
                <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" accept="image/*" />
                <Button variant="default" className="rounded-full" onClick={handleUploadClick}>
                  <Pencil className="mr-2 h-3 w-3"/>Change Profile
                </Button>
             </SidebarHeader>
             <div className="w-full">
              <SidebarNav />
            </div>

            <div className="mt-auto w-full space-y-2">
               <SidebarSeparator />
               <div className="flex flex-col gap-1 py-2">
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/profile")} tooltip={isMobile ? undefined : "Profile"}>
                      <Link href="/profile">
                        <User />
                        Profile
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                <Link href="/settings" className={cn(buttonVariants({ variant: "ghost" }), isActive('/settings') && "bg-muted", "justify-start")}>
                  <Settings className="mr-2"/> Settings
                </Link>
              </div>
               <SidebarSeparator />
               <div className="flex items-center justify-between p-2">
                   <p className="font-semibold text-sm truncate">{username}</p>
                  <Button variant="destructive" size="sm" onClick={handleLogout}>
                    <LogOut className="mr-2"/>Logout
                  </Button>
               </div>
            </div>

          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-10">
            <SidebarTrigger className="p-0 rounded-full h-8 w-8">
               <MusicAvatar size={32} ringWidth={2}/>
            </SidebarTrigger>
          </header>
          <main className={cn("flex-1 overflow-y-auto p-4 md:p-8 pt-6", mainContentPadding)}>
            {children}
          </main>
        </SidebarInset>
      </div>
       <div className="fixed inset-0 z-50 pointer-events-none">
          {currentSong && <MusicPlayer />}
       </div>
       {!isSettingsPage && <BottomNavBar />}
    </div>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
}
