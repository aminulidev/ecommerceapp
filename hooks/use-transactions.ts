
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"

export interface Transaction {
    id: string
    invoiceNumber: string
    type: string
    description: string
    amount: number
    status: string
    date: string
    createdAt: string
    updatedAt: string
}

export interface TransactionsResponse {
    transactions: Transaction[]
    total: number
    page: number
    totalPages: number
}

interface FetchTransactionsParams {
    page?: number
    limit?: number
    search?: string
}

const fetchTransactions = async ({ page = 1, limit = 10, search = "" }: FetchTransactionsParams): Promise<TransactionsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
    })
    const response = await fetch(`/api/transactions?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch transactions")
    }
    return response.json()
}

export function useInfiniteTransactions(params: Omit<FetchTransactionsParams, 'page'>) {
    return useInfiniteQuery({
        queryKey: ["transactions", "infinite", params],
        queryFn: ({ pageParam = 1 }) => fetchTransactions({ ...params, page: pageParam as number }),
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1
            }
            return undefined
        },
        initialPageParam: 1,
    })
}

export function useTransactions(params?: FetchTransactionsParams) {
    return useQuery({
        queryKey: ["transactions", params],
        queryFn: () => fetchTransactions(params || {}),
    })
}
