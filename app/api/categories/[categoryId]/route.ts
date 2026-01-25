
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Check if category has products
        const productsCount = await prisma.product.count({
            where: { categoryId: categoryId }
        })

        if (productsCount > 0) {
            return new NextResponse("Category cannot be deleted because it has products", { status: 400 })
        }

        const category = await prisma.category.delete({
            where: { id: categoryId }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
