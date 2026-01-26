
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
    ChevronRight,
    Printer,
    FileText
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    PENDING: { label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-500/10" },
    READY_TO_PICKUP: { label: "Ready to Pickup", icon: Package, color: "text-blue-500 bg-blue-500/10" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", icon: Truck, color: "text-purple-500 bg-purple-500/10" },
    DELIVERED: { label: "Delivered", icon: CheckCircle2, color: "text-green-500 bg-green-500/10" },
}

export default function ShippingPage() {
    const [status, setStatus] = React.useState("ALL")
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [confirmAction, setConfirmAction] = React.useState<{
        title: string
        description: string
        onConfirm: () => void
    } | null>(null)

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteShipping({ status })

    const handleReset = () => {
        setStatus("ALL")
        setSelectedIds([])
    }

    const shipments = data?.pages.flatMap((page) => page.shipments) || []

    const onSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const onSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(shipments.map(s => s.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleBulkPrint = () => {
        toast.info(`Generating labels for ${selectedIds.length} shipments...`, {
            description: "They will be ready for printing in a few seconds."
        })
        setSelectedIds([])
    }

    const handleBulkDelivered = () => {
        setConfirmAction({
            title: `Mark ${selectedIds.length} shipments as delivered?`,
            description: "This will update the shipping status for all selected orders.",
            onConfirm: () => {
                toast.success(`Successfully updated ${selectedIds.length} shipments`)
                setSelectedIds([])
                setIsConfirmOpen(false)
            }
        })
        setIsConfirmOpen(true)
    }

    const bulkActions = [
        {
            label: "Print Labels",
            icon: Printer,
            onClick: handleBulkPrint,
            variant: "secondary" as const
        },
        {
            label: "Mark Delivered",
            icon: CheckCircle2,
            onClick: handleBulkDelivered,
            variant: "default" as const
        }
    ]

    const isAllSelected = shipments.length > 0 && selectedIds.length === shipments.length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Shipping</h2>
                    <p className="text-muted-foreground">
                        Track and manage all outgoing shipments
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                        />
                        <label htmlFor="select-all" className="cursor-pointer">Select All</label>
                    </div>
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
                    <div className="relative">
                        <InfiniteScroll
                            fetchNextPage={fetchNextPage}
                            hasNextPage={!!hasNextPage}
                            isFetchingNextPage={isFetchingNextPage}
                        >
                            <div className="grid gap-4">
                                {shipments.map((shipment: any) => {
                                    const config = statusConfig[shipment.status] || { label: shipment.status, icon: Package, color: "" }
                                    const lastActivity = shipment.shippingActivity?.[0]
                                    const isSelected = selectedIds.includes(shipment.id)

                                    return (
                                        <Card
                                            key={shipment.id}
                                            className={cn(
                                                "overflow-hidden transition-all relative",
                                                isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                                            )}
                                        >
                                            <div className="absolute top-2 left-2 z-10">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() => onSelect(shipment.id)}
                                                />
                                            </div>
                                            <CardContent className="p-0">
                                                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x">
                                                    <div className="p-6 md:w-[300px] bg-muted/30 pl-10">
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
                                                            <Link href={`/orders/${shipment.id}`}>
                                                                Manage <ChevronRight className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
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
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
