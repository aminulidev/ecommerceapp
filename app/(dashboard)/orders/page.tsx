"use client"

import * as React from "react"
import { useInfiniteOrders, useUpdateOrderStatus } from "@/hooks/use-orders"
import { OrdersTable } from "@/components/orders/orders-table"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, RotateCcw } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"

export default function OrdersPage() {
    const [search, setSearch] = React.useState("")
    const [status, setStatus] = React.useState("ALL")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteOrders({ search: debouncedSearch, status })

    const updateStatus = useUpdateOrderStatus()

    const handleReset = () => {
        setSearch("")
        setStatus("ALL")
    }

    const orders = data?.pages.flatMap((page) => page.orders) || []

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Manage and track customer orders</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Filter Orders</CardTitle>
                    <CardDescription>Search by order number, customer name or email</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="READY_TO_PICKUP">Ready to Pickup</SelectItem>
                                <SelectItem value="OUT_FOR_DELIVERY">Out for Delivery</SelectItem>
                                <SelectItem value="DELIVERED">Delivered</SelectItem>
                                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-md" />
                    ))}
                </div>
            ) : orders.length ? (
                <InfiniteScroll
                    fetchNextPage={fetchNextPage}
                    hasNextPage={!!hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                >
                    <OrdersTable
                        orders={orders}
                        onStatusUpdate={(id, s) => updateStatus.mutate({ orderId: id, status: s })}
                    />
                </InfiniteScroll>
            ) : (
                <div className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed bg-card text-center animate-in fade-in duration-500">
                    <div className="rounded-full bg-muted p-4">
                        <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or filters to find what you&apos;re looking for.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={handleReset}>
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    )
}
