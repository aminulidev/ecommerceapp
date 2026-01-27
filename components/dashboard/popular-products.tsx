"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Package } from "lucide-react"

interface Product {
    id: string
    name: string
    sales: number
    price: number
    image?: string
}

interface PopularProductsProps {
    products: Product[]
}

export function PopularProducts({ products }: PopularProductsProps) {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Popular Products</CardTitle>
                <CardDescription>Top selling items this month</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                    <div className="space-y-6">
                        {products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 rounded-lg bg-muted overflow-hidden flex items-center justify-center">
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
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none line-clamp-1">{product.name}</p>
                                        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="font-medium text-sm">
                                    {product.sales} sales
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
