
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        const { orderId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { status } = body

        if (!status) {
            return new NextResponse("Status is required", { status: 400 })
        }

        const order = await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                status
            }
        })

        return NextResponse.json(order)
    } catch (error) {
        console.error("[ORDER_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
