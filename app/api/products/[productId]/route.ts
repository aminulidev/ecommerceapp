
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

        const product = await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                name,
                description,
                price: price !== undefined ? parseFloat(price) : undefined,
                stock: stock !== undefined ? parseInt(stock) : undefined,
                sku,
                categoryId,
                image,
                isArchived
            }
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
