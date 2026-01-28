
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // 1. Total Sales & Orders
        const orders = await prisma.order.findMany({
            where: { paymentStatus: "PAID" },
            select: { total: true, orderDate: true, paymentMethod: true }
        })
        const totalSales = orders.reduce((acc, order) => acc + order.total, 0)
        const totalOrders = orders.length
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

        // 2. Total Customers
        const totalCustomers = await prisma.user.count({
            where: { role: "VIEWER" }
        })

        // 3. Total Products
        const totalProducts = await prisma.product.count()

        // 4. Monthly Revenue & Daily Trend (Last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentOrders = await prisma.order.findMany({
            where: {
                paymentStatus: "PAID",
                orderDate: { gte: thirtyDaysAgo }
            },
            select: { total: true, orderDate: true }
        })

        // Daily trend for 30 days
        const dailySalesMap = new Map<string, { date: string, sales: number, orders: number }>()
        for (let i = 0; i < 30; i++) {
            const d = new Date()
            d.setDate(d.getDate() - i)
            const dateStr = d.toISOString().split('T')[0]
            dailySalesMap.set(dateStr, { date: dateStr, sales: 0, orders: 0 })
        }

        recentOrders.forEach(order => {
            const dateStr = new Date(order.orderDate).toISOString().split('T')[0]
            if (dailySalesMap.has(dateStr)) {
                const current = dailySalesMap.get(dateStr)!
                dailySalesMap.set(dateStr, {
                    ...current,
                    sales: current.sales + order.total,
                    orders: current.orders + 1
                })
            }
        })

        const salesTrendData = Array.from(dailySalesMap.values()).reverse()

        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyOrders = await prisma.order.findMany({
            where: {
                paymentStatus: "PAID",
                orderDate: { gte: sixMonthsAgo }
            },
            select: { total: true, orderDate: true }
        })

        const monthlyRevenueMap = new Map<string, number>()
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        monthlyOrders.forEach(order => {
            const date = new Date(order.orderDate)
            const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`
            const current = monthlyRevenueMap.get(monthYear) || 0
            monthlyRevenueMap.set(monthYear, current + order.total)
        })

        const revenueData = Array.from(monthlyRevenueMap.entries()).map(([month, earning]) => ({
            month,
            earning,
            expense: earning * 0.45
        }))

        // 5. Popular Products 
        const topProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }, // Mocking popularity
            select: {
                id: true,
                name: true,
                price: true,
                image: true
            }
        })

        const popularProducts = topProducts.map(p => ({
            ...p,
            sales: Math.floor(Math.random() * 500) + 50
        }))

        // 6. Category Distribution & Revenue by Category
        const categories = await prisma.category.findMany({
            include: {
                products: {
                    select: {
                        id: true,
                        orderItems: {
                            select: {
                                total: true
                            }
                        }
                    }
                }
            }
        })

        const categoryData = categories.map(c => ({
            name: c.name,
            value: c.totalProducts
        }))

        const revenueByCategory = categories.map(c => {
            const revenue = c.products.reduce((acc, p) => acc + p.orderItems.reduce((itAcc, it) => itAcc + it.total, 0), 0)
            return {
                name: c.name,
                revenue
            }
        }).sort((a, b) => b.revenue - a.revenue)

        // 7. Order Status Distribution
        const orderStatusCounts = await prisma.order.groupBy({
            by: ['status'],
            _count: { _all: true }
        })
        const orderStatusData = orderStatusCounts.map(s => ({
            name: s.status,
            value: s._count._all
        }))

        // 8. Payment Method Distribution
        const paymentMethods = orders.reduce((acc: any, order) => {
            acc[order.paymentMethod] = (acc[order.paymentMethod] || 0) + 1
            return acc
        }, {})
        const paymentMethodData = Object.entries(paymentMethods).map(([name, value]) => ({
            name,
            value: value as number
        }))

        // 9. Customer Growth Mock (Last 6 months)
        const customerGrowthData = months.slice(0, 6).map((m, i) => ({
            month: m,
            customers: Math.floor(Math.random() * 100) + 200 + (i * 20)
        }))

        return NextResponse.json({
            totalSales,
            totalCustomers,
            totalProducts,
            averageOrderValue,
            revenueData,
            popularProducts,
            categoryData,
            orderStatusData,
            customerGrowthData,
            revenueByCategory,
            paymentMethodData,
            salesTrendData
        })

    } catch (error) {
        console.error("[DASHBOARD_STATS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
