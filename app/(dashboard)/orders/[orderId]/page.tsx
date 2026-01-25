"use client"

import { useOrder, useUpdateOrderStatus } from "@/hooks/use-orders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    XCircle,
    Truck,
    Package,
    MapPin,
    User,
    CreditCard,
    Mail,
    Phone,
    ArrowRight
} from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    PENDING: { label: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20" },
    READY_TO_PICKUP: { label: "Ready to Pickup", icon: Package, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
}

export default function OrderDetailsPage() {
    const params = useParams()
    const orderId = params.orderId as string
    const router = useRouter()

    const { data: order, isLoading } = useOrder(orderId)
    const updateStatus = useUpdateOrderStatus()

    if (isLoading) {
        return <OrderDetailsSkeleton />
    }

    if (!order) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed bg-card text-center">
                <h3 className="text-lg font-semibold">Order not found</h3>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/orders")}>
                    Back to Orders
                </Button>
            </div>
        )
    }

    const status = statusConfig[order.status] || { label: order.status, icon: Clock, color: "" }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/orders">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight">{order.orderNumber}</h1>
                            <Badge variant="outline" className={cn("gap-1 font-normal", status.color)}>
                                <status.icon className="h-3 w-3" />
                                {status.label}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(order.orderDate), "MMM dd, yyyy 'at' hh:mm a")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Select
                        value={order.status}
                        onValueChange={(s) => updateStatus.mutate({ orderId, status: s })}
                        disabled={updateStatus.isPending}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(statusConfig).map((s) => (
                                <SelectItem key={s} value={s}>
                                    {statusConfig[s].label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button>Print Invoice</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column: Items & Summary */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                            <CardDescription>Items purchased in this order</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                            {item.productImage ? (
                                                <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover rounded-lg" />
                                            ) : (
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">SKU: {item.sku || "N/A"}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className="text-sm font-medium">${item.price.toFixed(2)} x {item.quantity}</p>
                                            <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Separator className="my-6" />
                            <div className="space-y-1.5 ml-auto w-full md:w-[300px]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping Fee</span>
                                    <span>${order.shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-primary">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {order.shippingActivity.length ? order.shippingActivity.map((activity: any, i: number) => (
                                    <div key={activity.id} className="flex gap-4 relative">
                                        {i < order.shippingActivity.length - 1 && (
                                            <div className="absolute left-[11px] top-[24px] bottom-[-24px] w-0.5 bg-muted" />
                                        )}
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative z-10">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">{activity.status}</p>
                                            <p className="text-xs text-muted-foreground">{activity.location}</p>
                                            <p className="text-[10px] text-muted-foreground/60">{format(new Date(activity.timestamp), "MMM dd, hh:mm a")}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-sm text-muted-foreground italic">No shipping activity recorded yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Customer & Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{order.customerName}</p>
                                    <p className="text-xs text-muted-foreground">ID: {order.customerId.slice(-8)}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>+1 (234) 567-890</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-3 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p>{order.shippingAddress.addressLine1}</p>
                                    {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                    <p className="font-medium mt-1">{order.shippingAddress.country}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.paymentMethod}</span>
                                </div>
                                <Badge variant="outline" className={cn(
                                    order.paymentStatus === "PAID" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                )}>
                                    {order.paymentStatus}
                                </Badge>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Transaction ID</span>
                                <span>TXN_{order.id.slice(-8).toUpperCase()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function OrderDetailsSkeleton() {
    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-[200px]" />
                <Skeleton className="h-10 w-[150px]" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-[400px] w-full" />
                    <Skeleton className="h-[300px] w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-[150px] w-full" />
                    <Skeleton className="h-[150px] w-full" />
                </div>
            </div>
        </div>
    )
}
