
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
    ImagePlus,
    Trash2,
    X
} from "lucide-react"
import Link from "next/link"
import { useQueryClient } from "@tanstack/react-query"

export default function ProductFormPage() {
    const params = useParams()
    const router = useRouter()
    const queryClient = useQueryClient()
    const productId = params.productId as string
    const isNew = productId === "new"

    const { data: product, isLoading: isLoadingProduct } = useProduct(productId)
    const { data: categoriesData } = useCategories()

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

            if (!response.ok) throw new Error("Something went wrong")

            queryClient.invalidateQueries({ queryKey: ["products"] })
            router.push("/products")
        } catch (error) {
            console.error(error)
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
                                    <select
                                        id="category"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categoriesData?.categories?.map((cat: any) => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
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
                            <div className="space-y-4">
                                <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                                    {formData.image ? (
                                        <>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-6 w-6"
                                                onClick={() => setFormData({ ...formData, image: "" })}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground text-center p-4">
                                            <ImagePlus className="h-8 w-8" />
                                            <span className="text-xs">Provide a URL for the image</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="image">Image URL</Label>
                                    <Input
                                        id="image"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>
                            </div>
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
