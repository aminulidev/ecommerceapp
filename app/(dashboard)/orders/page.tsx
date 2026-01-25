
"use client"

import { useOrders } from "@/hooks/use-orders"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    MoreHorizontal,
    Eye,
    Truck,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState } from "react"

const statusConfig = {
    PENDING: { label: "Pending", variant: "outline" as const, icon: Clock },
    READY_TO_PICKUP: { label: "Ready", variant: "secondary" as const, icon: Package },
    OUT_FOR_DELIVERY: { label: "Shipping", variant: "secondary" as const, icon: Truck },
    DELIVERED: { label: "Delivered", variant: "default" as const, icon: CheckCircle2 },
    CANCELLED: { label: "Cancelled", variant: "destructive" as const, icon: XCircle },
}

// Mocking Package icon because I'm not sure if it's imported correctly in sidecar but I'll add it to the imports
import { Package, Check, Loader2 } from "lucide-react"

export default function OrdersPage() {
    const { data: orders, isLoading } = useOrders()
    const queryClient = useQueryClient()
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const updateStatusMutation = useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string, status: string }) => {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            })
            if (!response.ok) throw new Error("Failed to update status")
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            setUpdatingId(null)
        },
        onError: () => {
            setUpdatingId(null)
        }
    })

    const handleStatusUpdate = (orderId: string, status: string) => {
        setUpdatingId(orderId)
        updateStatusMutation.mutate({ orderId, status })
    }

    if (isLoading) {
        return <OrdersSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">
                        Manage and track all customer orders
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>A list of orders from your store</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Customer</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Total</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {orders?.map((order: any) => {
                                    const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING
                                    return (
                                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">
                                                #{order.orderNumber}
                                            </td>
                                            <td className="p-4 align-middle">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{order.customerName}</span>
                                                    <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                <Badge variant={status.variant} className="gap-1 px-2">
                                                    <status.icon className="h-3 w-3" />
                                                    {status.label}
                                                </Badge>
                                            </td>
                                            <td className="p-4 align-middle text-muted-foreground">
                                                {new Date(order.orderDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="p-4 align-middle font-medium">
                                                ${order.total.toFixed(2)}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" disabled={updatingId === order.id}>
                                                            {updatingId === order.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="gap-2 text-primary">
                                                            <Eye className="h-4 w-4" /> View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground">Change Status</DropdownMenuLabel>
                                                        {Object.entries(statusConfig).map(([key, config]) => (
                                                            <DropdownMenuItem
                                                                key={key}
                                                                className="gap-2"
                                                                onClick={() => handleStatusUpdate(order.id, key)}
                                                                disabled={order.status === key}
                                                            >
                                                                <config.icon className="h-4 w-4" />
                                                                {config.label}
                                                                {order.status === key && <Check className="h-3 w-3 ml-auto" />}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function OrdersSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
