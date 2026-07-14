import { NextResponse } from "next/server";

export async function GET() {
  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  const diagnostics = {
    firebaseAdminConfigured: Boolean(projectId && clientEmail && privateKey),
    projectId: projectId ? "set" : "missing",
    clientEmail: clientEmail ? "set" : "missing",
    privateKey: privateKey ? `set (${privateKey.length} chars)` : "missing",
    adminEmail: adminEmail ? "set" : "missing",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ? "set" : "missing",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing",
  };

  return NextResponse.json(diagnostics);
}
