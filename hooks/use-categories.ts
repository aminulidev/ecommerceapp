
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

export interface Category {
    id: string
    name: string
    description: string
    icon: string | null
    totalProducts: number
    totalEarning: number
    createdAt: string
    updatedAt: string
}

export interface CategoriesResponse {
    categories: Category[]
    total: number
    page: number
    totalPages: number
}

interface FetchCategoriesParams {
    page?: number
    limit?: number
    search?: string
}

const fetchCategories = async ({ page = 1, limit = 10, search = "" }: FetchCategoriesParams): Promise<CategoriesResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    })
    const response = await fetch(`/api/categories?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch categories")
    }
    return response.json()
}

export function useInfiniteCategories(params: Omit<FetchCategoriesParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ["categories", "infinite", params],
        queryFn: ({ pageParam = 1 }) => fetchCategories({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })
}

export function useCategories(params?: FetchCategoriesParams) {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => fetchCategories(params || {}),
    })
}
