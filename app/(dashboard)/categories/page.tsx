
"use client"

import * as React from "react"
import { useInfiniteCategories, useDeleteCategory, useBulkDeleteCategories } from "@/hooks/use-categories"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    LayoutGrid,
    DollarSign,
    Search,
    RotateCcw,
    Archive
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { CategoryDialog } from "@/components/dashboard/category-dialog"
import { InfiniteScroll } from "@/components/shared/infinite-scroll"
import { Checkbox } from "@/components/ui/checkbox"
import { BulkActionBar } from "@/components/shared/bulk-action-bar"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { cn } from "@/lib/utils"

export default function CategoriesPage() {
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
    } = useInfiniteCategories({ search: debouncedSearch })

    const deleteCategory = useDeleteCategory()
    const bulkDelete = useBulkDeleteCategories()

    const handleReset = () => {
        setSearch("")
        setSelectedIds([])
    }

    const categories = data?.pages.flatMap((page) => page.categories) || []

    const onSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const onSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(categories.map(c => c.id))
        } else {
            setSelectedIds([])
        }
    }

    const handleBulkArchive = () => {
        toast.info(`Archiving ${selectedIds.length} categories...`)
        setSelectedIds([])
    }

    const handleBulkDelete = () => {
        setConfirmAction({
            title: `Delete ${selectedIds.length} categories?`,
            description: "This will remove categories and may affect associated products. This action cannot be undone.",
            onConfirm: () => {
                bulkDelete.mutate(selectedIds, {
                    onSuccess: () => {
                        toast.success(`Successfully deleted ${selectedIds.length} categories`)
                        setSelectedIds([])
                        setIsConfirmOpen(false)
                    },
                    onError: (error: any) => {
                        toast.error(error.message || "Failed to delete categories")
                    }
                })
            }
        })
        setIsConfirmOpen(true)
    }

    const bulkActions = [
        {
            label: "Archive",
            icon: Archive,
            onClick: handleBulkArchive,
            variant: "secondary" as const
        },
        {
            label: "Delete",
            icon: Trash2,
            onClick: handleBulkDelete,
            variant: "destructive" as const
        }
    ]

    const onDelete = (id: string) => {
        setConfirmAction({
            title: "Delete category?",
            description: "This might affect products in this category. Are you sure?",
            onConfirm: () => {
                deleteCategory.mutate(id, {
                    onSuccess: () => {
                        toast.success("Category deleted successfully")
                        setIsConfirmOpen(false)
                    },
                    onError: (error: any) => {
                        toast.error(error.message || "Failed to delete category")
                    }
                })
            }
        })
        setIsConfirmOpen(true)
    }

    const isAllSelected = categories.length > 0 && selectedIds.length === categories.length

    function CategoriesSkeleton() {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
                    <p className="text-muted-foreground">
                        Organize your products into categories
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Checkbox
                            id="select-all"
                            checked={isAllSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                        />
                        <label htmlFor="select-all" className="cursor-pointer">Select All</label>
                    </div>
                    <CategoryDialog />
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Filter Categories</CardTitle>
                    <CardDescription>Search by name or description</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
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

            {isLoading ? (
                <CategoriesSkeleton />
            ) : (
                <div className="relative">
                    <InfiniteScroll
                        fetchNextPage={fetchNextPage}
                        hasNextPage={!!hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    >
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map((category: any) => {
                                const isSelected = selectedIds.includes(category.id)
                                return (
                                    <Card
                                        key={category.id}
                                        className={cn(
                                            "overflow-hidden transition-all relative group",
                                            isSelected ? "border-primary ring-1 ring-primary" : "hover:border-primary/50"
                                        )}
                                        onClick={() => onSelect(category.id)}
                                    >
                                        <div className="absolute top-3 right-3 z-10" onClick={e => e.stopPropagation()}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => onSelect(category.id)}
                                            />
                                        </div>
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer">
                                            <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="group-hover:bg-muted">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" onClick={e => e.stopPropagation()}>
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <CategoryDialog category={category}>
                                                        <DropdownMenuItem onSelect={e => e.preventDefault()} className="gap-2 focus:bg-accent focus:text-accent-foreground">
                                                            <Pencil className="h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                    </CategoryDialog>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="gap-2 text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onDelete(category.id);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </CardHeader>
                                        <CardContent className="cursor-pointer">
                                            <div className="flex flex-col gap-4">
                                                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                                                    {category.description}
                                                </p>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                                                        <LayoutGrid className="h-4 w-4 text-primary" />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground">Products</span>
                                                            <span className="font-bold">{category.totalProducts || 0}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 rounded-lg bg-muted p-2">
                                                        <DollarSign className="h-4 w-4 text-success" />
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-muted-foreground">Earnings</span>
                                                            <span className="font-bold">${category.totalEarning?.toLocaleString() || 0}</span>
                                                        </div>
                                                    </div>
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
                        variant={confirmAction?.title?.includes("Delete") ? "destructive" : "default"}
                    />
                </div>
            )}
        </div>
    )
}
