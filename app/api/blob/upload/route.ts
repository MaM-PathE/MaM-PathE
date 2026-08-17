import { handleUpload } from "@vercel/blob/client"
import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/middleware"

export async function POST(request: Request) {
  const auth = await verifyAuth(request)
  if (!auth.authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => ({
        allowedContentTypes: ["audio/*", "video/*", "image/*"],
        addRandomSuffix: true,
        maximumSizeInBytes: 1024 * 1024 * 1024,
      }),
      onUploadCompleted: async () => undefined,
    })
    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("[v0] Direct media upload failed:", error)
    return NextResponse.json({ error: "Upload authorization failed" }, { status: 500 })
  }
}
