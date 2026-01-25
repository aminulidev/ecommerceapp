
"use client"

import { useCategories } from "@/hooks/use-categories"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    LayoutGrid,
    MessageSquare,
    DollarSign
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
import { useQueryClient } from "@tanstack/react-query"
import { CategoryDialog } from "@/components/dashboard/category-dialog"

export default function CategoriesPage() {
    const { data: categories, isLoading } = useCategories()
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState(false)

    const onDelete = async (id: string) => {
        if (!window.confirm("Are you sure? This might affect products in this category.")) return
        setLoading(true)
        try {
            // Delete API not implemented yet but follows pattern
            const response = await fetch(`/api/categories/${id}`, { method: "DELETE" })
            if (response.ok) {
                queryClient.invalidateQueries({ queryKey: ["categories"] })
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return <CategoriesSkeleton />
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
                <CategoryDialog />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category: any) => (
                    <Card key={category.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xl font-bold">{category.name}</CardTitle>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem className="gap-2">
                                        <Pencil className="h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => onDelete(category.id)}>
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent>
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
                                        <DollarSign className="h-4 w-4 text-success" color="green" />
                                        <div className="flex flex-col">
                                            <span className="text-xs text-muted-foreground">Earnings</span>
                                            <span className="font-bold">${category.totalEarning?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function CategoriesSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
