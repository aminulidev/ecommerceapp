
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

        const orders = await prisma.order.findMany({
            include: {
                items: true,
                customer: {
                    select: {
                        name: true,
                        email: true,
                        avatar: true,
                    }
                }
            },
            orderBy: {
                orderDate: 'desc'
            }
        })

        return NextResponse.json(orders)
    } catch (error) {
        console.error("[ORDERS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
