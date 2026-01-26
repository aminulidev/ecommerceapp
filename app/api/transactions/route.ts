
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

        const where: any = {}
        if (search) {
            where.OR = [
                { invoiceNumber: { contains: search } },
                { description: { contains: search } },
            ]
        }

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    date: 'desc'
                }
            }),
            prisma.transaction.count({ where }),
        ])

        return NextResponse.json({
            transactions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[TRANSACTIONS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
