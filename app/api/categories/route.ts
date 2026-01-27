
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
            ]
        }

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    name: 'asc'
                }
            }),
            prisma.category.count({ where }),
        ])

        return NextResponse.json({
            categories,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        })
    } catch (error) {
        console.error("[CATEGORIES_GET]", error)
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
        const { name, description, icon } = body

        if (!name || !description) {
            return new NextResponse("Name and description are required", { status: 400 })
        }

        const category = await prisma.category.create({
            data: {
                name,
                description,
                icon
            }
        })

        return NextResponse.json(category)
    } catch (error) {
        console.error("[CATEGORIES_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json()
        const { ids } = body

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return new NextResponse("IDs are required", { status: 400 })
        }

        // Check if any category has products
        const productsCount = await prisma.product.count({
            where: {
                categoryId: {
                    in: ids
                }
            }
        })

        if (productsCount > 0) {
            return new NextResponse("Some categories cannot be deleted because they have associated products", { status: 400 })
        }

        await prisma.category.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("[CATEGORIES_DELETE_BULK]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
