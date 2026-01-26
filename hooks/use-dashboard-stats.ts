
import { useQuery } from "@tanstack/react-query"

export interface DashboardStats {
    totalSales: number
    totalCustomers: number
    totalProducts: number
    revenueData: {
        month: string
        earning: number
        expense: number
    }[]
    popularProducts: {
        id: string
        name: string
        price: number
        image?: string
        sales: number
    }[]
    categoryData: {
        name: string
        value: number
    }[]
    orderStatusData: {
        name: string
        value: number
    }[]
    customerGrowthData: {
        month: string
        customers: number
    }[]
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
    const response = await fetch("/api/dashboard/stats")
    if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats")
    }
    return response.json()
}

export function useDashboardStats() {
    return useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: fetchDashboardStats,
        refetchInterval: 30000, // Poll every 30 seconds
    })
}
