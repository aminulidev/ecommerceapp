
"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { PopularProducts } from "@/components/dashboard/popular-products"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Users, ShoppingBag, DollarSign, Package } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetErrorBoundary } from "@/components/shared/error-boundary"
import { CustomerGrowthChart, DistributionChart } from "@/components/dashboard/overview-charts"

export default function DashboardPage() {
    const { data, isLoading } = useDashboardStats()

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (!data) return null

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-4">
                <WidgetErrorBoundary fallbackTitle="Sales Stats">
                    <StatsCard
                        title="Total Sales"
                        value={`$${data.totalSales.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        icon={DollarSign}
                        trend={12.5}
                        color="primary"
                        description="Total revenue"
                    />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary fallbackTitle="Customer Stats">
                    <StatsCard
                        title="Customers"
                        value={data.totalCustomers.toLocaleString()}
                        icon={Users}
                        trend={8.2}
                        color="success"
                        description="Active users"
                    />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary fallbackTitle="Product Stats">
                    <StatsCard
                        title="Products"
                        value={data.totalProducts.toLocaleString()}
                        icon={Package}
                        trend={-2.4}
                        color="warning"
                        description="In inventory"
                    />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary fallbackTitle="Revenue Stats">
                    <StatsCard
                        title="Revenue"
                        value="$42,500" // Mock
                        icon={ShoppingBag}
                        trend={18.2}
                        color="info"
                        description="This month"
                    />
                </WidgetErrorBoundary>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 md:grid-cols-7">
                <div className="col-span-4">
                    <WidgetErrorBoundary fallbackTitle="Revenue Chart">
                        <RevenueChart data={data.revenueData} />
                    </WidgetErrorBoundary>
                </div>
                <div className="col-span-3">
                    <WidgetErrorBoundary fallbackTitle="Popular Products">
                        <PopularProducts products={data.popularProducts} />
                    </WidgetErrorBoundary>
                </div>
            </div>

            {/* Extra Charts Grid */}
            <div className="grid gap-6 md:grid-cols-7">
                <div className="col-span-4">
                    <WidgetErrorBoundary fallbackTitle="Customer Growth">
                        <CustomerGrowthChart data={data.customerGrowthData} />
                    </WidgetErrorBoundary>
                </div>
                <div className="col-span-3">
                    <WidgetErrorBoundary fallbackTitle="Category Distribution">
                        <DistributionChart
                            data={data.categoryData}
                            title="Categories"
                            description="Product distribution by category"
                            legend={false}
                        />
                    </WidgetErrorBoundary>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <div className="col-span-3">
                    <WidgetErrorBoundary fallbackTitle="Order Status">
                        <DistributionChart
                            data={data.orderStatusData}
                            title="Order Status"
                            description="Distribution of all orders by status"
                        />
                    </WidgetErrorBoundary>
                </div>
                <div className="col-span-4 flex items-center justify-center border-2 border-dashed rounded-xl p-8 text-muted-foreground italic">
                    More widgets coming soon...
                </div>
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
