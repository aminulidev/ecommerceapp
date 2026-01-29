
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const product = await prisma.product.findUnique({
            where: {
                id: productId
            },
            include: {
                category: true
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCT_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, description, price, stock, sku, categoryId, image, isArchived } = body

        const updateData: any = {
            name,
            description,
            sku,
            categoryId,
            image,
            isArchived
        }

        if (price !== undefined && price !== "") {
            const parsedPrice = parseFloat(price)
            if (isNaN(parsedPrice)) return new NextResponse("Invalid price", { status: 400 })
            updateData.price = parsedPrice
        }

        if (stock !== undefined && stock !== "") {
            const parsedStock = parseInt(stock)
            if (isNaN(parsedStock)) return new NextResponse("Invalid stock", { status: 400 })
            updateData.stock = parsedStock
        }

        const product = await prisma.product.update({
            where: {
                id: productId
            },
            data: updateData
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCT_PATCH]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params;
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const product = await prisma.product.delete({
            where: {
                id: productId
            }
        })

        // Update category product count
        await prisma.category.update({
            where: { id: product.categoryId },
            data: {
                totalProducts: { decrement: 1 }
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCT_DELETE]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
