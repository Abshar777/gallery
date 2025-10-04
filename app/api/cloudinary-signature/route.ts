import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const folder = typeof body?.folder === "string" && body.folder.length ? body.folder : "v0-uploads"
    const timestamp = Math.floor(Date.now() / 1000)

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error:
            "Missing Cloudinary env vars. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in Project Settings.",
        },
        { status: 500 },
      )
    }

    // Signature per Cloudinary: sha1 of "folder=...&timestamp=...{API_SECRET}"
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}`
    const signature = crypto
      .createHash("sha1")
      .update(paramsToSign + apiSecret)
      .digest("hex")

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    })
  } catch (e) {
    return NextResponse.json({ error: "Failed to sign upload" }, { status: 500 })
  }
}
