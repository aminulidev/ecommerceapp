"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your application preferences and notifications</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Configure how you receive alerts and updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Checkbox id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <Checkbox id="push-notifications" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="dark-mode">Enable Dark Mode (System Sync)</Label>
                            <Checkbox id="dark-mode" defaultChecked />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
