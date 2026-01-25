
import { useQuery } from "@tanstack/react-query"

export function useOrders() {
    return useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await fetch("/api/orders")
            if (!response.ok) {
                throw new Error("Failed to fetch orders")
            }
            return response.json()
        }
    })
}
