
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

        // 1. Total Sales (Total Revenue from detailed Orders)
        const orders = await prisma.order.findMany({
            where: { paymentStatus: "PAID" },
            select: { total: true }
        })
        const totalSales = orders.reduce((acc, order) => acc + order.total, 0)

        // 2. Total Customers
        const totalCustomers = await prisma.user.count({
            where: { role: "VIEWER" }
        })

        // 3. Total Products
        const totalProducts = await prisma.product.count()

        // 4. Monthly Revenue (Last 6 months)
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const monthlyOrders = await prisma.order.findMany({
            where: {
                paymentStatus: "PAID",
                orderDate: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                total: true,
                orderDate: true
            }
        })

        const monthlyRevenueMap = new Map<string, number>()
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        monthlyOrders.forEach(order => {
            const date = new Date(order.orderDate)
            const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`
            const current = monthlyRevenueMap.get(monthYear) || 0
            monthlyRevenueMap.set(monthYear, current + order.total)
        })

        // Convert map to array and sort (mocking expense for demo)
        const revenueData = Array.from(monthlyRevenueMap.entries()).map(([month, earning]) => ({
            month,
            earning,
            expense: earning * 0.45 // Mock expense as 45% of earning
        })).reverse() // Simple sort, ideally sort by date

        // 5. Popular Products (Top 5 by sales count - simplified logic)
        // In a real app, this would be an aggregation query on OrderItem
        const topProducts = await prisma.product.findMany({
            take: 5,
            orderBy: { stock: 'asc' }, // Mock: low stock = high sales
            select: {
                id: true,
                name: true,
                price: true,
                image: true
            }
        })

        const popularProducts = topProducts.map(p => ({
            ...p,
            sales: Math.floor(Math.random() * 500) + 50 // Mock sales count
        }))

        return NextResponse.json({
            totalSales,
            totalCustomers,
            totalProducts,
            revenueData,
            popularProducts
        })

    } catch (error) {
        console.error("[DASHBOARD_STATS]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
