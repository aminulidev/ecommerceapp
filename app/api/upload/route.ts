
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { mkdir, writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { existsSync } from "fs"

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return new NextResponse("No file uploaded", { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create a unique filename
        const ext = file.name.split(".").pop()
        const fileName = `${uuidv4()}.${ext}`
        const uploadDir = join(process.cwd(), "public", "uploads")

        // Ensure directory exists
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }

        const path = join(uploadDir, fileName)

        await writeFile(path, buffer)

        const filePath = `/uploads/${fileName}`

        return NextResponse.json({ url: filePath })
    } catch (error) {
        console.error("[UPLOAD_POST]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
