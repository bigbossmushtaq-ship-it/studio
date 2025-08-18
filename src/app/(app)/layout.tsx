"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Library,
  PanelLeft,
  Plus,
  Search,
  Settings,
  User,
  Upload,
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
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/icons/logo";
import { MusicPlayer } from "@/components/music-player";

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
         <Link href="/library" className={`flex flex-col items-center gap-1 ${isActive('/library') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Library />
          <span className="text-xs">Library</span>
        </Link>
        <Link href="/upload" className={`flex flex-col items-center gap-1 ${isActive('/upload') ? 'text-primary' : 'text-muted-foreground'}`}>
          <Upload />
          <span className="text-xs">Upload</span>
        </Link>
      </div>
    </div>
  )
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen w-full flex-col bg-background">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
                  TuneFlow
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarNav />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6 sticky top-0 z-10">
              <SidebarTrigger className="md:hidden" />
              <div className="flex-1">
                {/* Header content like search bar can go here */}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://placehold.co/100x100.png"
                        alt="User"
                        data-ai-hint="user avatar"
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">Logout</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-6 pb-24 md:pb-8">
              {children}
            </main>
          </SidebarInset>
        </div>
        <MusicPlayer />
        <BottomNavBar />
      </div>
    </SidebarProvider>
  );
}
