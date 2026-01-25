
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface Order {
    id: string
    orderNumber: string
    customerId: string
    customerName: string
    customerEmail: string
    customerAvatar: string | null
    status: string
    paymentMethod: string
    paymentStatus: string
    total: number
    subtotal: number
    shippingFee: number
    tax: number
    orderDate: string
    createdAt: string
    updatedAt: string
}

export interface OrdersResponse {
    orders: Order[]
    total: number
    page: number
    totalPages: number
}

interface FetchOrdersParams {
    page?: number
    limit?: number
    status?: string
    search?: string
}

const fetchOrders = async ({ page = 1, limit = 10, status = "ALL", search = "" }: FetchOrdersParams): Promise<OrdersResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
        search,
    })
    const response = await fetch(`/api/orders?${params.toString()}`)
    if (!response.ok) {
        throw new Error("Failed to fetch orders")
    }
    return response.json()
}

const fetchOrder = async (orderId: string) => {
    const response = await fetch(`/api/orders/${orderId}`)
    if (!response.ok) {
        throw new Error("Failed to fetch order")
    }
    return response.json()
}

export function useOrders(params: FetchOrdersParams) {
    return useQuery({
        queryKey: ["orders", params],
        queryFn: () => fetchOrders(params),
    })
}

export function useOrder(orderId: string) {
    return useQuery({
        queryKey: ["orders", orderId],
        queryFn: () => fetchOrder(orderId),
        enabled: !!orderId,
    })
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (!response.ok) {
                throw new Error("Failed to update order status")
            }
            return response.json()
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders"] })
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] })
        },
    })
}
