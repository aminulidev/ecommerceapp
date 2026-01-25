
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

        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(categories)
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
