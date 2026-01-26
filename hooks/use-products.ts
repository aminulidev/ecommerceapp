
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query"

export interface Product {
    id: string
    name: string
    description: string
    image: string | null
    categoryId: string
    price: number
    stock: number
    sku: string
    category: {
        id: string
        name: string
    }
    createdAt: string
    updatedAt: string
}

export interface ProductsResponse {
    products: Product[]
    total: number
    page: number
    totalPages: number
}

interface FetchProductsParams {
    page?: number
    limit?: number
    search?: string
}

const fetchProducts = async ({ page = 1, limit = 10, search = "" }: FetchProductsParams): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    })
    const response = await fetch(`/api/products?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch products")
    }
    return response.json()
}

export function useInfiniteProducts(params: Omit<FetchProductsParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ["products", "infinite", params],
        queryFn: ({ pageParam = 1 }) => fetchProducts({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })
}

export function useProducts(params?: FetchProductsParams) {
    return useQuery({
        queryKey: ["products", params],
        queryFn: () => fetchProducts(params || {}),
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
