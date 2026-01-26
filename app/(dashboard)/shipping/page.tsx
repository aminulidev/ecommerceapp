
"use client"

import * as React from "react"
import { useInfiniteShipping } from "@/hooks/use-shipping"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Truck,
    MapPin,
    Package,
    Clock,
    CheckCircle2,
    RotateCcw,
    ChevronRight
} from "lucide-react"
import { format } from "date-fns"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
    READY_TO_PICKUP: { label: "Ready to Pickup", icon: Package, color: "text-blue-500 bg-blue-500/10" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "text-purple-500 bg-purple-500/10" },
    DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
}

export default function ShippingPage() {
    const [status, setStatus] = React.useState("ALL")

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteShipping({ status })

    const handleReset = () => {
        setStatus("ALL")
    }

    const shipments = data?.pages.flatMap((page) => page.shipments) || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Shipping</h2>
                    <p className="text-muted-foreground">
                        Track and manage all outgoing shipments
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Filter Shipments</CardTitle>
                    <CardDescription>Filter by shipping status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full md:w-[250px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="READY_TO_PICKUP">Ready to Pickup</SelectItem>
                                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-md" />
                        ))}
                    </div>
                ) : (
                    <InfiniteScroll
                        fetchNextPage={fetchNextPage}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    >
                        <div className="grid gap-4">
                            {shipments.map((shipment: any) => {
                                const config = statusConfig[shipment.status] || { label: shipment.status, icon: Package, color: "" }
                                const lastActivity = shipment.shippingActivity?.[0]

                                return (
                                    <Card key={shipment.id} className="overflow-hidden hover:border-primary transition-all">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                                                <div className="p-6 md:w-[300px] bg-muted/30">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="font-bold">{shipment.orderNumber}</span>
                                                        <Badge className={cn("gap-1 font-normal", config.color)}>
                                                            <config.icon className="h-3 w-3" />
                                                            {config.label}
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium">{shipment.customerName}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {shipment.shippingAddress?.city}, {shipment.shippingAddress?.country}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex-1 flex flex-col justify-center">
                                                    {lastActivity ? (
                                                        <div className="flex items-start gap-4">
                                                            <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <Truck className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <div className="flex-1 space-y-1">
                                                                <div className="flex items-center justify-between">
                                                                    <p className="font-bold">{lastActivity.status}</p>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {format(new Date(lastActivity.timestamp), "MMM dd, HH:mm")}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-muted-foreground">{lastActivity.description}</p>
                                                                {lastActivity.location && (
                                                                    <p className="text-xs font-medium flex items-center gap-1">
                                                                        <MapPin className="h-3 w-3" /> {lastActivity.location}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-4">
                                                            <p className="text-sm text-muted-foreground italic">No shipping activity recorded yet.</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-6 md:w-[150px] flex items-center justify-center">
                                                    <Button variant="ghost" className="w-full gap-2" asChild>
                                                        <a href={`/orders/${shipment.id}`}>
                                                            Manage <ChevronRight className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </InfiniteScroll>
                )}
            </div>
        </div>
    )
}
