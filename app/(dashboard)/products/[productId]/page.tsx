
"use client"

import { useProduct, useProducts } from "@/hooks/use-products"
import { useCategories } from "@/hooks/use-categories"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    ChevronLeft,
    Save,
    Loader2,
    Trash2,
    X
} from "lucide-react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ImageDropzone } from "@/components/image-dropzone"
import { toast } from "sonner"

export default function ProductFormPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const productId = params.productId as string
    const isNew = productId === "new"

    const { data: product, isLoading: isLoadingProduct } = useProduct(productId)
    const { data: categoriesData } = useCategories({ limit: 100 })

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        categoryId: "",
        image: ""
    })

    useEffect(() => {
        if (product && !isNew) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                sku: product.sku,
                categoryId: product.categoryId,
                image: product.image || ""
            })
        }
    }, [product, isNew])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = isNew ? "/api/products" : `/api/products/${productId}`
            const method = isNew ? "POST" : "PATCH"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || "Something went wrong")
            }

            queryClient.invalidateQueries({ queryKey: ["products"] })
            toast.success(isNew ? "Product created" : "Product updated")
            router.push("/products")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        if (!window.confirm("Are you sure?")) return
        setLoading(true)

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE"
            })

            if (!response.ok) throw new Error("Something went wrong")

            queryClient.invalidateQueries({ queryKey: ["products"] })
            router.push("/products")
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (isLoadingProduct && !isNew) {
        return <div className="flex items-center justify-center h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/products">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isNew ? "Create Product" : "Edit Product"}
                        </h2>
                        <p className="text-muted-foreground">
                            {isNew ? "Add a new product to your catalog" : "Manage product details and inventory"}
                        </p>
                    </div>
                </div>
                {!isNew && (
                    <Button variant="destructive" size="icon" onClick={onDelete} disabled={loading}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <form onSubmit={onSubmit} className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Describe your product"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price ($)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock">Stock Quantity</Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        placeholder="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sku">SKU</Label>
                                    <Input
                                        id="sku"
                                        placeholder="Enter product SKU"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        key={formData.categoryId}
                                        value={formData.categoryId}
                                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                        required
                                    >
                                        <SelectTrigger id="category" className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categoriesData?.categories?.map((cat: any) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImageDropzone
                                value={formData.image}
                                onChange={(value) => setFormData({ ...formData, image: value })}
                                disabled={loading}
                            />
                        </CardContent>
                    </Card>

                    <Button type="submit" className="w-full gap-2" disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isNew ? "Create Product" : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
