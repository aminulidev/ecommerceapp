
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
        const search = searchParams.get("search") || ""

        const skip = (page - 1) * limit

        const where: any = {
            role: "VIEWER" // Customers usually have VIEWER role
        }

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ]
        }

        const [customers, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatar: true,
                    createdAt: true,
                    _count: {
                        select: { orders: true }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.user.count({ where }),
        ])

        return NextResponse.json({
            customers,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[CUSTOMERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
