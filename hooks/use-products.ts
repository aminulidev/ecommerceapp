
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useProducts() {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const response = await fetch("/api/products")
            if (!response.ok) {
                throw new Error("Failed to fetch products")
            }
            return response.json()
        }
    })
}

export function useProduct(productId: string) {
    return useQuery({
        queryKey: ["products", productId],
        queryFn: async () => {
            if (productId === "new") return null
            const response = await fetch(`/api/products/${productId}`)
            if (!response.ok) {
                throw new Error("Failed to fetch product")
            }
            return response.json()
        },
        enabled: !!productId && productId !== "new"
    })
}
