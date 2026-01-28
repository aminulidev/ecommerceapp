
"use client"

import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { PopularProducts } from "@/components/dashboard/popular-products"
import { useDashboardStats } from "@/hooks/use-dashboard-stats"
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { WidgetErrorBoundary } from "@/components/shared/error-boundary"
import { CustomerGrowthChart, DistributionChart, RevenueByCategoryChart } from "@/components/dashboard/overview-charts"
import { SalesTrendsChart } from "@/components/dashboard/sales-trends"

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
                <WidgetErrorBoundary fallbackTitle="Order Value">
                    <StatsCard
                        title="Avg Order Value"
                        value={`$${data.averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
                        icon={TrendingUp}
                        trend={5.4}
                        color="info"
                        description="Per transaction"
                    />
                </WidgetErrorBoundary>
            </div>

            {/* Sales Trends Section */}
            <WidgetErrorBoundary fallbackTitle="Sales Trends">
                <SalesTrendsChart data={data.salesTrendData} />
            </WidgetErrorBoundary>

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

            {/* distribution Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <WidgetErrorBoundary fallbackTitle="Category Distribution">
                    <DistributionChart
                        data={data.categoryData}
                        title="Categories"
                        description="Product distribution"
                        legend={true}
                    />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary fallbackTitle="Payment Methods">
                    <DistributionChart
                        data={data.paymentMethodData}
                        title="Payment Methods"
                        description="Preferred checkout options"
                        innerRadius={50}
                    />
                </WidgetErrorBoundary>
                <WidgetErrorBoundary fallbackTitle="Order Status">
                    <DistributionChart
                        data={data.orderStatusData}
                        title="Order Status"
                        description="Fulfillment stages"
                        innerRadius={0}
                    />
                </WidgetErrorBoundary>
            </div>

            {/* Additional Analytics */}
            <div className="grid gap-6 md:grid-cols-7">
                <div className="col-span-4">
                    <WidgetErrorBoundary fallbackTitle="Revenue by Category">
                        <RevenueByCategoryChart data={data.revenueByCategory} />
                    </WidgetErrorBoundary>
                </div>
                <div className="col-span-3">
                    <WidgetErrorBoundary fallbackTitle="Customer Growth">
                        <CustomerGrowthChart data={data.customerGrowthData} />
                    </WidgetErrorBoundary>
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
