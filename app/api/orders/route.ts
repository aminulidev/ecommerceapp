
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "10")
        const status = searchParams.get("status")
        const search = searchParams.get("search")

        const skip = (page - 1) * limit

        const where: any = {}
        if (status && status !== "ALL") {
            where.status = status
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search } },
                { customerName: { contains: search } },
                { customerEmail: { contains: search } },
            ]
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { orderDate: "desc" },
            }),
            prisma.order.count({ where }),
        ])

        return NextResponse.json({
            orders,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[ORDERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
