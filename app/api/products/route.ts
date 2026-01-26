
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
                { name: { contains: search } },
                { description: { contains: search } },
                { sku: { contains: search } },
            ]
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.product.count({ where }),
        ])

        return NextResponse.json({
            products,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[PRODUCTS_GET]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { name, description, price, stock, sku, categoryId, image } = body

        if (!name || !description || !price || !stock || !sku || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                sku,
                categoryId,
                image
            }
        })

        // Update category product count
        await prisma.category.update({
            where: { id: categoryId },
            data: {
                totalProducts: { increment: 1 }
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("[PRODUCTS_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
