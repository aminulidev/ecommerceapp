
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Billing</h2>
                <p className="text-muted-foreground">Manage your subscription and payment methods</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>You are currently on the Enterprise plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Plus className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Enterprise Plan</p>
                                <p className="text-sm text-muted-foreground">$199.00 / month</p>
                            </div>
                        </div>
                        <Button variant="outline">Upgrade Plan</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Add and manage your payment cards</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Visa ending in 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/26</p>
                            </div>
                        </div>
                        <Badge variant="secondary">Default</Badge>
                    </div>
                    <Button variant="ghost" className="mt-4 gap-2">
                        <Plus className="h-4 w-4" /> Add Payment Method
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
