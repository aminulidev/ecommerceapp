
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
        const status = searchParams.get("status") // Added status filter

        const skip = (page - 1) * limit

        const where: any = {}
        if (status && status !== "ALL") {
            where.status = status
        } else {
            // Only show orders that are relevant to shipping
            where.status = {
                in: ["READY_TO_PICKUP", "OUT_FOR_DELIVERY", "DELIVERED", "PENDING"]
            }
        }

        const [shipments, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    shippingAddress: true,
                    shippingActivity: {
                        orderBy: {
                            timestamp: 'desc'
                        },
                        take: 1
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    updatedAt: 'desc'
                }
            }),
            prisma.order.count({ where }),
        ])

        return NextResponse.json({
            shipments,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[SHIPPING_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
