import { NextResponse } from "next/server";
import { verifyAdmin, AuthError } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    const { email } = await verifyAdmin(req.headers.get("authorization"));

    const adminEmail = process.env.ADMIN_EMAIL;
    if (email !== adminEmail) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

    const diagnostics = {
      firebaseAdminConfigured: Boolean(projectId && clientEmail && privateKey),
      projectId: projectId ? "set" : "missing",
      clientEmail: clientEmail ? "set" : "missing",
      privateKey: privateKey ? "set" : "missing",
      adminEmail: adminEmail ? "set" : "missing",
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? "set" : "missing",
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing",
    };

    return NextResponse.json(diagnostics);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
