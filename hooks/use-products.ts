
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
    isArchived: boolean
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
    isArchived?: boolean
}

const fetchProducts = async ({ page = 1, limit = 10, search = "", isArchived = false }: FetchProductsParams): Promise<ProductsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        isArchived: isArchived.toString()
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

export function useUpdateProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ productId, ...data }: { productId: string } & Partial<Product>) => {
            const response = await fetch(`/api/products/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })
            if (!response.ok) {
                throw new Error("Failed to update product")
            }
            return response.json()
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
            queryClient.invalidateQueries({ queryKey: ["products", data.id] })
        },
    })
}

export function useBulkArchiveProducts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ ids, isArchived }: { ids: string[]; isArchived: boolean }) => {
            const response = await fetch("/api/products", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids, isArchived }),
            })
            if (!response.ok) {
                throw new Error("Failed to archive products")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            })
            if (!response.ok) {
                throw new Error("Failed to delete product")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
    })
}

export function useBulkDeleteProducts() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (ids: string[]) => {
            const response = await fetch("/api/products", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            })
            if (!response.ok) {
                throw new Error("Failed to delete products")
            }
            return response.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
    })
}
