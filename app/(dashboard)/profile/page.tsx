
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
    const { data: session } = useSession()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">Manage your personal information and account settings</p>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile details and avatar</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="text-xl">
                                {session?.user?.name?.slice(0, 2).toUpperCase() || "US"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h4 className="text-lg font-medium">{session?.user?.name}</h4>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
                                {session?.user?.role}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
