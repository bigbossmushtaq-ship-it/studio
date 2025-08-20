
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

function SidebarNav() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');
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
         <Link href="/upload" className={`flex flex-col items-center gap-1 ${isActive('/upload') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Plus className="h-6 w-6" />
          <span className="text-xs">Create</span>
        </Link>
      </div>
    </div>
  )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { theme, customColors } = useTheme();
  const { username, setProfilePic, logout, session } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    // Wait for session to be determined
    if (session === undefined) return;
    
    if (!session) {
      router.replace('/');
    } else {
      setIsCheckingAuth(false);
    }
  }, [session, router]);
  
  
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
  
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
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
                  <Link href="/settings" className={cn(buttonVariants({ variant: "ghost" }), isActive('/settings') && "bg-muted", "justify-start")}>
                    <Settings className="mr-2"/> Settings
                  </Link>
                </div>
                 <SidebarSeparator />
                 <div className="flex items-center justify-between p-2">
                     <p className="font-semibold truncate">{username}</p>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                      <LogOut className="mr-2"/>Logout
                    </Button>
                 </div>
              </div>

            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-10">
             {pathname !== '/home' && (
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
                  <ArrowLeft />
                </Button>
              )}
              <SidebarTrigger className="p-0 rounded-full h-8 w-8">
                 <MusicAvatar size={32} ringWidth={2}/>
              </SidebarTrigger>
              {!isSettingsPage && (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search songs, artists, or podcasts..." className="pl-10 w-full max-w-sm" />
                </div>
              )}
            </header>
            <main className={cn("flex-1 overflow-y-auto p-4 md:p-8 pt-6", !isSettingsPage && "pb-40 md:pb-32")}>
              {children}
            </main>
          </SidebarInset>
        </div>
        {!isSettingsPage && (
           <div className="fixed bottom-[63px] md:bottom-2 left-0 right-0 md:left-auto md:right-2 w-full md:w-[calc(100%-4rem)] group-data-[state=expanded]:md:w-[calc(100%-17rem)] z-40 transition-all duration-200 ease-linear">
             <div className="p-2 md:p-0">
               <MusicPlayer />
             </div>
           </div>
        )}
         {!isSettingsPage && <BottomNavBar />}
      </div>
    </SidebarProvider>
  );
}
