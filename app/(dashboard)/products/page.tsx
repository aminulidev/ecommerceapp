
"use client"

import { useProducts } from "@/hooks/use-products"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    ExternalLink,
    Package,
    AlertCircle
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export default function ProductsPage() {
    const { data: products, isLoading } = useProducts()

    if (isLoading) {
        return <ProductsSkeleton />
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">
                        Manage your product catalog and inventory
                    </p>
                </div>
                <Button asChild>
                    <Link href="/products/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products</CardTitle>
                    <CardDescription>A list of all products in your inventory</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Product</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">SKU</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Category</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Stock</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {products?.map((product: any) => (
                                    <tr key={product.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-muted">
                                                    {product.image ? (
                                                        /* eslint-disable-next-line @next/next/no-img-element */
                                                        <img
                                                            src={product.image}
                                                            alt={product.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 m-auto mt-2 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle font-mono text-xs text-muted-foreground">
                                            {product.sku}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="secondary">
                                                {product.category?.name}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            ${product.price.toFixed(2)}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <span className={product.stock <= 5 ? "text-destructive font-bold" : ""}>
                                                    {product.stock}
                                                </span>
                                                {product.stock <= 5 && (
                                                    <AlertCircle className="h-4 w-4 text-destructive" />
                                                )}
                                            </div>
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
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/products/${product.id}`} className="flex items-center gap-2">
                                                            <Pencil className="h-4 w-4" /> Edit Product
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="flex items-center gap-2">
                                                        <ExternalLink className="h-4 w-4" /> View Store
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="flex items-center gap-2 text-destructive">
                                                        <Trash2 className="h-4 w-4" /> Delete Product
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function ProductsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[150px]" />
                    <Skeleton className="h-4 w-[250px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
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
