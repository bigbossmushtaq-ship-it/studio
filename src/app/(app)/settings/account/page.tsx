
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

export default function AccountSettingsPage() {
  return (
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Username</Label>
              <p className="text-muted-foreground">313nvhd7km2j4e33zebherh4qx3u</p>
            </div>
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-muted-foreground">novamusic0987@gmail.com</p>
                </div>
                <Button variant="ghost" size="icon"><ExternalLink className="h-5 w-5"/></Button>
            </div>
             <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Label>Account overview</Label>
                    <p className="text-sm text-muted-foreground">View more account details on the web.</p>
                </div>
                <Button variant="ghost" size="icon"><ExternalLink className="h-5 w-5"/></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="bg-muted p-3 rounded-md">
                     <svg
                        viewBox="0 0 100 100"
                        className="h-10 w-10 text-foreground"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M25 40C25 31.7157 31.7157 25 40 25H60C68.2843 25 75 31.7157 75 40V60C75 68.2843 68.2843 75 60 75H40C31.7157 75 25 68.2843 25 60V40Z"
                          stroke="currentColor"
                          strokeWidth="10"
                        />
                        <circle cx="50" cy="50" r="10" fill="currentColor" />
                      </svg>
                </div>
                <div>
                    <p className="font-semibold">Free plan</p>
                    <a href="#" className="text-sm text-primary underline">View your plan</a>
                </div>
             </div>
          </CardContent>
        </Card>
         <div>
            <p className="text-center text-sm text-muted-foreground">
                To delete your data permanently, <a href="#" className="underline text-primary">close your account</a>.
            </p>
        </div>
      </div>
  )
}
