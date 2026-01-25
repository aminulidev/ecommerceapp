"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Trash2, CheckCircle2, XCircle, Clock, Truck, Package } from "lucide-react"
import { Order } from "@/hooks/use-orders"
import { format } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface OrdersTableProps {
    orders: Order[]
    onStatusUpdate: (orderId: string, status: string) => void
}

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    PENDING: { label: "Pending", icon: Clock, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
    DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" },
    CANCELLED: { label: "Cancelled", icon: XCircle, color: "bg-red-500/10 text-red-500 border-red-500/20" },
    READY_TO_PICKUP: { label: "Ready to Pickup", icon: Package, color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
}

export function OrdersTable({ orders, onStatusUpdate }: OrdersTableProps) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[100px]">Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const status = statusConfig[order.status] || { label: order.status, icon: Clock, color: "" }
                        return (
                            <TableRow key={order.id} className="group transition-colors">
                                <TableCell className="font-medium">
                                    <Link href={`/orders/${order.id}`} className="hover:text-primary transition-colors">
                                        {order.orderNumber}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{order.customerName}</span>
                                        <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={cn("gap-1 font-normal", status.color)}>
                                        <status.icon className="h-3 w-3" />
                                        {status.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{order.paymentMethod}</TableCell>
                                <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(order.orderDate), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/orders/${order.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                                                Update Status
                                            </DropdownMenuLabel>
                                            {Object.keys(statusConfig).map((s) => (
                                                <DropdownMenuItem
                                                    key={s}
                                                    disabled={order.status === s}
                                                    onClick={() => onStatusUpdate(order.id, s)}
                                                >
                                                    {statusConfig[s].label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
