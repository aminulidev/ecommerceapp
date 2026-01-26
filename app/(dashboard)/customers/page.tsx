
"use client"

import * as React from "react"
import { useInfiniteCustomers } from "@/hooks/use-customers"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    MoreHorizontal,
    Search,
    RotateCcw,
    Mail,
    Calendar,
    ShoppingBag,
    User,
    UserMinus,
    MessageSquare
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

export default function CustomersPage() {
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
    } = useInfiniteCustomers({ search: debouncedSearch })

    const handleReset = () => {
        setSearch("")
        setSelectedIds([])
    }

    const customers = data?.pages.flatMap((page) => page.customers) || []

    const onSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const onSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(customers.map(c => c.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleBulkMessage = () => {
        toast.success(`Opening conversation with ${selectedIds.length} customers`)
        setSelectedIds([])
    }

    const handleBulkBlock = () => {
        setConfirmAction({
            title: `Block ${selectedIds.length} customers?`,
            description: "Blocked customers will no longer be able to place orders or access their accounts.",
            onConfirm: () => {
                toast.success(`Successfully blocked ${selectedIds.length} customers`)
                setSelectedIds([])
                setIsConfirmOpen(false)
            }
        })
        setIsConfirmOpen(true)
    }

    const bulkActions = [
        {
            label: "Message",
            icon: MessageSquare,
            onClick: handleBulkMessage,
            variant: "secondary" as const
        },
        {
            label: "Block",
            icon: UserMinus,
            onClick: handleBulkBlock,
            variant: "destructive" as const
        }
    ]

    const isAllSelected = customers.length > 0 && selectedIds.length === customers.length

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">
                        Manage your customer base and view their activity
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
                    <CardTitle>Filter Customers</CardTitle>
                    <CardDescription>Search by name or email</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search customers..."
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

            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-48 w-full rounded-xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            <InfiniteScroll
                                fetchNextPage={fetchNextPage}
                                hasNextPage={!!hasNextPage}
                                isFetchingNextPage={isFetchingNextPage}
                            >
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {customers.map((customer: any) => {
                                        const isSelected = selectedIds.includes(customer.id)
                                        return (
                                            <Card
                                                key={customer.id}
                                                className={cn(
                                                    "overflow-hidden group transition-all relative",
                                                    isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                                                )}
                                                onClick={() => onSelect(customer.id)}
                                            >
                                                <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => onSelect(customer.id)}
                                                    />
                                                </div>
                                                <CardContent className="p-6 cursor-pointer">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <Avatar className="h-12 w-12 border">
                                                                <AvatarImage src={customer.avatar} alt={customer.name} />
                                                                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-lg">{customer.name}</span>
                                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Mail className="h-3 w-3" /> {customer.email}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                                <DropdownMenuItem>View Orders</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive">Block Customer</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>

                                                    <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Joined</span>
                                                            <span className="text-sm font-medium flex items-center gap-1">
                                                                <Calendar className="h-3 w-3 text-primary" />
                                                                {format(new Date(customer.createdAt), "MMM yyyy")}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Orders</span>
                                                            <span className="text-sm font-medium flex items-center gap-1">
                                                                <ShoppingBag className="h-3 w-3 text-success" />
                                                                {customer._count?.orders || 0}
                                                            </span>
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
                                variant={confirmAction?.title.includes("Block") ? "destructive" : "default"}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
