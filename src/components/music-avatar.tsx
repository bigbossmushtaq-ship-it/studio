
"use client"

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type MusicAvatarProps = {
    isPlaying: boolean;
    src: string;
    size?: 'sm' | 'lg';
}

export function MusicAvatar({ isPlaying, src, size = 'sm' }: MusicAvatarProps) {
    const sizeClasses = size === 'sm' ? "h-8 w-8" : "h-20 w-20";
    const padding = size === 'sm' ? "p-0.5" : "p-1";

    return (
        <div className={cn(
            "rgb-border-bg", 
            !isPlaying && "rgb-border-bg-paused",
            padding
        )}>
            <div className={cn(
                "rgb-border-content",
                padding
            )}>
                 <Avatar className={sizeClasses}>
                    <AvatarImage src={src} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </div>
        </div>
    )
}
