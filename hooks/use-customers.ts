
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

export interface Customer {
    id: string
    name: string
    email: string
    avatar: string | null
    createdAt: string
    _count: {
        orders: number
    }
}

export interface CustomersResponse {
    customers: Customer[]
    total: number
    page: number
    totalPages: number
}

interface FetchCustomersParams {
    page?: number
    limit?: number
    search?: string
}

const fetchCustomers = async ({ page = 1, limit = 10, search = "" }: FetchCustomersParams): Promise<CustomersResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    })
    const response = await fetch(`/api/customers?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch customers")
    }
    return response.json()
}

export function useInfiniteCustomers(params: Omit<FetchCustomersParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ["customers", "infinite", params],
        queryFn: ({ pageParam = 1 }) => fetchCustomers({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })
}

export function useCustomers(params?: FetchCustomersParams) {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: () => fetchCustomers(params || {}),
    })
}
