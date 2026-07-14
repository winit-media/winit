import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    await verifyAdmin(req.headers.get("authorization"));

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (!apiKey || !apiSecret || !cloudName) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const folder = body.folder || "winit";
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign: Record<string, string> = {
      folder,
      timestamp: String(timestamp),
    };

    const paramString = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&");

    const signature = createHash("sha1")
      .update(paramString + apiSecret)
      .digest("hex");

    return NextResponse.json({
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    console.error("[API] /api/cloudinary-sign error:", err);
    return NextResponse.json(
      { error: "Failed to sign upload" },
      { status: 500 }
    );
  }
}
