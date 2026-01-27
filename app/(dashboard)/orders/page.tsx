
"use client"

import * as React from "react"
import { useInfiniteOrders, useUpdateOrderStatus, useBulkUpdateOrdersStatus, useBulkDeleteOrders } from "@/hooks/use-orders"
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
import { Search, RotateCcw, Trash2, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"
import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"

export default function OrdersPage() {
    const [search, setSearch] = React.useState("")
    const [status, setStatus] = React.useState("ALL")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [confirmAction, setConfirmAction] = React.useState<{
        title: string
        description: string
        onConfirm: () => void
    } | null>(null)

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
    const bulkUpdateStatus = useBulkUpdateOrdersStatus()
    const bulkDelete = useBulkDeleteOrders()

    const handleReset = () => {
        setSearch("")
        setStatus("ALL")
        setSelectedIds([])
    }

    const orders = data?.pages.flatMap((page) => page.orders) || []

    const onSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const onSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(orders.map(o => o.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleBulkDelete = () => {
        setConfirmAction({
            title: `Delete ${selectedIds.length} orders?`,
            description: "This action cannot be undone. All selected orders will be permanently removed.",
            onConfirm: () => {
                bulkDelete.mutate(selectedIds, {
                    onSuccess: () => {
                        toast.success(`Successfully deleted ${selectedIds.length} orders`)
                        setSelectedIds([])
                        setIsConfirmOpen(false)
                    },
                    onError: () => {
                        toast.error("Failed to delete orders")
                    }
                })
            }
        })
        setIsConfirmOpen(true)
    }

    const handleBulkUpdate = () => {
        // Since we don't have a status picker yet, we'll update to 'READY_TO_PICKUP' as a default "next" status
        // Or we could implement a logic to advance status, but for now let's just make it work with a fixed status
        // or ask the user. Given the prompt "update status and delete action", I'll set it to a reasonable next state.
        setConfirmAction({
            title: `Update status for ${selectedIds.length} orders?`,
            description: "The status of all selected orders will be updated to 'Ready to Pickup'.",
            onConfirm: () => {
                bulkUpdateStatus.mutate(
                    { ids: selectedIds, status: "READY_TO_PICKUP" },
                    {
                        onSuccess: () => {
                            toast.success(`Successfully updated ${selectedIds.length} orders`)
                            setSelectedIds([])
                            setIsConfirmOpen(false)
                        },
                        onError: () => {
                            toast.error("Failed to update orders")
                        }
                    }
                )
            }
        })
        setIsConfirmOpen(true)
    }

    const bulkActions = [
        {
            label: "Update Status",
            icon: CheckCircle2,
            onClick: handleBulkUpdate,
            variant: "secondary" as const
        },
        {
            label: "Delete",
            icon: Trash2,
            onClick: handleBulkDelete,
            variant: "destructive" as const
        }
    ]

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
                <div className="relative">
                    <InfiniteScroll
                        fetchNextPage={fetchNextPage}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    >
                        <OrdersTable
                            orders={orders}
                            onStatusUpdate={(id, s) => {
                                updateStatus.mutate(
                                    { orderId: id, status: s },
                                    { onSuccess: () => toast.success("Order status updated") }
                                )
                            }}
                            selectedIds={selectedIds}
                            onSelect={onSelect}
                            onSelectAll={onSelectAll}
                        />
                    </InfiniteScroll>

                    <BulkActionBar
                        selectedCount={selectedIds.length}
                        onClear={() => setSelectedIds([])}
                        actions={bulkActions}
                    />

                    <ConfirmDialog
                        isOpen={isConfirmOpen}
                        onClose={() => setIsConfirmOpen(false)}
                        onConfirm={confirmAction?.onConfirm || (() => { })}
                        title={confirmAction?.title || ""}
                        description={confirmAction?.description || ""}
                        variant={confirmAction?.title?.includes("Delete") ? "destructive" : "default"}
                        isLoading={bulkUpdateStatus.isPending || bulkDelete.isPending}
                    />
                </div>
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
