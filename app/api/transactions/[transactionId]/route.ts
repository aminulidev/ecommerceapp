import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    try {
        const { transactionId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { status, description, amount, type } = body

        if (!transactionId) {
            return new NextResponse("Transaction ID is required", { status: 400 })
        }

        const transaction = await prisma.transaction.update({
            where: {
                id: transactionId,
            },
            data: {
                status,
                description,
                amount,
                type,
            },
        })

        return NextResponse.json(transaction)
    } catch (error) {
        console.error("[TRANSACTION_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ transactionId: string }> }
) {
    try {
        const { transactionId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if (!transactionId) {
            return new NextResponse("Transaction ID is required", { status: 400 })
        }

        const transaction = await prisma.transaction.delete({
            where: {
                id: transactionId,
            },
        })

        return NextResponse.json(transaction)
    } catch (error) {
        console.error("[TRANSACTION_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
