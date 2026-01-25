"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { PopularProducts } from "@/components/dashboard/popular-products"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Users, ShoppingBag, DollarSign, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
    const { data, isLoading } = useDashboardStats()

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (!data) return null

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Sales"
                    value={`$${data.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    icon={DollarSign}
                    trend={12.5}
                    color="primary"
                    description="Total revenue"
                />
                <StatsCard
                    title="Customers"
                    value={data.totalCustomers.toLocaleString()}
                    icon={Users}
                    trend={8.2}
                    color="success"
                    description="Active users"
                />
                <StatsCard
                    title="Products"
                    value={data.totalProducts.toLocaleString()}
                    icon={Package}
                    trend={-2.4}
                    color="warning"
                    description="In inventory"
                />
                <StatsCard
                    title="Revenue"
                    value="$42,500" // Mock
                    icon={ShoppingBag}
                    trend={18.2}
                    color="info"
                    description="This month"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-7">
                <RevenueChart data={data.revenueData} />
                <PopularProducts products={data.popularProducts} />
            </div>
        </div>
    )
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[140px] rounded-xl" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="col-span-3 h-[400px] rounded-xl" />
            </div>
        </div>
    )
}
