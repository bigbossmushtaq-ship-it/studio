

"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Palette, PlayCircle, Bell, User, ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const sidebarNavItems = [
     {
      title: "Account",
      href: "/settings/account",
      icon: User,
    },
    {
      title: "Customization",
      href: "/settings/customization",
      icon: Palette,
    },
    {
      title: "Playback",
      href: "/settings/playback",
      icon: PlayCircle,
    },
    {
      title: "Notifications",
      href: "/settings/notifications",
      icon: Bell,
    },
  ]
  
  if (pathname === '/settings') {
    return (
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-6">
        <aside className="-mx-4 lg:w-1/5">
          <nav
            className={cn(
              "flex flex-col space-y-1"
            )}
          >
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    )
  }


  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 mt-6">
        <aside className="-mx-4 lg:w-1/5">
          <nav
            className={cn(
              "flex flex-col space-y-1"
            )}
          >
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </>
  )
}
