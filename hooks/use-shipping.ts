
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

export interface ShippingOrder {
    id: string
    orderNumber: string
    customerName: string
    status: string
    updatedAt: string
    shippingAddress: {
        city: string
        country: string
    } | null
    shippingActivity: {
        status: string
        description: string
        timestamp: string
        location: string | null
    }[]
}

export interface ShippingResponse {
    shipments: ShippingOrder[]
    total: number
    page: number
    totalPages: number
}

interface FetchShippingParams {
    page?: number
    limit?: number
    status?: string
}

const fetchShipping = async ({ page = 1, limit = 10, status = "ALL" }: FetchShippingParams): Promise<ShippingResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
    })
    const response = await fetch(`/api/shipping?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch shipping data")
    }
    return response.json()
}

export function useInfiniteShipping(params: Omit<FetchShippingParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ["shipping", "infinite", params],
        queryFn: ({ pageParam = 1 }) => fetchShipping({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })
}

export function useShipping(params?: FetchShippingParams) {
    return useQuery({
        queryKey: ["shipping", params],
        queryFn: () => fetchShipping(params || {}),
    })
}
