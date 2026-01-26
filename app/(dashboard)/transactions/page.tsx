
"use client"

import * as React from "react"
import { useInfiniteTransactions } from "@/hooks/use-transactions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MoreHorizontal,
    Search,
    RotateCcw,
    CreditCard,
    Wallet,
    Landmark,
    Trash2,
    Download
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { cn } from "@/lib/utils"

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
    WALLET: { label: "Wallet", icon: Wallet, color: "text-blue-500" },
    BANK_TRANSFER: { label: "Bank", icon: Landmark, color: "text-purple-500" },
    PAYPAL: { label: "PayPal", icon: CreditCard, color: "text-info" },
    MASTERCARD: { label: "MasterCard", icon: CreditCard, color: "text-warning" },
}

export default function TransactionsPage() {
    const [search, setSearch] = React.useState("")
    const [debouncedSearch, setDebouncedSearch] = React.useState("")
    const [selectedIds, setSelectedIds] = React.useState<string[]>([])
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
    const [confirmAction, setConfirmAction] = React.useState<{
        title: string
        description: string
        onConfirm: () => void
    } | null>(null)

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
    } = useInfiniteTransactions({ search: debouncedSearch })

    const handleReset = () => {
        setSearch("")
        setSelectedIds([])
    }

    const transactions = data?.pages.flatMap((page) => page.transactions) || []

    const onSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const onSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(transactions.map(t => t.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleBulkExport = () => {
        toast.info(`Exporting ${selectedIds.length} transactions...`, {
            description: "Your download will begin shortly."
        })
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        setConfirmAction({
            title: `Delete ${selectedIds.length} transactions?`,
            description: "This action cannot be undone. These records will be permanently removed.",
            onConfirm: () => {
                toast.success(`Successfully deleted ${selectedIds.length} transactions`)
                setSelectedIds([])
                setIsConfirmOpen(false)
            }
        })
        setIsConfirmOpen(true)
    }

    const bulkActions = [
        {
            label: "Export",
            icon: Download,
            onClick: handleBulkExport,
            variant: "secondary" as const
        },
        {
            label: "Delete",
            icon: Trash2,
            onClick: handleBulkDelete,
            variant: "destructive" as const
        }
    ]

    const isAllSelected = transactions.length > 0 && selectedIds.length === transactions.length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
                    <p className="text-muted-foreground">
                        Monitor all financial activities and history
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Filter Transactions</CardTitle>
                    <CardDescription>Search by invoice number or description</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transactions..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon" onClick={handleReset}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Showing {transactions.length} transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            <InfiniteScroll
                                fetchNextPage={fetchNextPage}
                                hasNextPage={!!hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            >
                                <div className="relative w-full overflow-auto">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="[&_tr]:border-b">
                                            <tr className="border-b transition-colors hover:bg-muted/50">
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[40px]">
                                                    <Checkbox
                                                        checked={isAllSelected}
                                                        onChange={(e) => onSelectAll(e.target.checked)}
                                                    />
                                                </th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Invoice</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Amount</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="[&_tr:last-child]:border-0">
                                            {transactions.map((tx: any) => {
                                                const config = typeConfig[tx.type] || { label: tx.type, icon: CreditCard, color: "" }
                                                const isSelected = selectedIds.includes(tx.id)
                                                return (
                                                    <tr key={tx.id} className={cn(
                                                        "border-b transition-colors hover:bg-muted/50",
                                                        isSelected && "bg-muted/50"
                                                    )}>
                                                        <td className="p-4 align-middle">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                onChange={() => onSelect(tx.id)}
                                                            />
                                                        </td>
                                                        <td className="p-4 align-middle font-medium">{tx.invoiceNumber}</td>
                                                        <td className="p-4 align-middle">
                                                            <div className="flex items-center gap-2">
                                                                <config.icon className={cn("h-4 w-4", config.color)} />
                                                                <span>{config.label}</span>
                                                            </div>
                                                        </td>
                                                        <td className="p-4 align-middle text-muted-foreground">{tx.description}</td>
                                                        <td className="p-4 align-middle font-bold text-success">
                                                            +${tx.amount.toLocaleString()}
                                                        </td>
                                                        <td className="p-4 align-middle">
                                                            <Badge variant={tx.status === "COMPLETED" ? "default" : tx.status === "PENDING" ? "secondary" : "destructive"}>
                                                                {tx.status}
                                                            </Badge>
                                                        </td>
                                                        <td className="p-4 align-middle text-muted-foreground">
                                                            {format(new Date(tx.date), "MMM dd, yyyy")}
                                                        </td>
                                                        <td className="p-4 align-middle text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuItem>View Receipt</DropdownMenuItem>
                                                                    <DropdownMenuItem>Refund</DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
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
                                variant={confirmAction?.title.includes("Delete") ? "destructive" : "default"}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
