import { getAdminAuth, getAdminDb } from "./firebase-admin";

export async function verifyAdmin(
  authHeader: string | null
): Promise<{ uid: string; email: string }> {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AuthError("Missing authorization token", 401);
  }

  const idToken = authHeader.slice(7);
  let decoded;
  try {
    decoded = await getAdminAuth().verifyIdToken(idToken);
  } catch (err) {
    console.error("[admin-auth] Token verification failed:", err);
    throw new AuthError("Invalid or expired token", 401);
  }

  if (!decoded.email) {
    throw new AuthError("No email associated with token", 403);
  }

  // Check authorization: user must be in blogUsers, match contactEmail,
  // or match ADMIN_EMAIL env var
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && decoded.email === adminEmail) {
    return { uid: decoded.uid, email: decoded.email };
  }

  try {
    const db = getAdminDb();
    const snap = await db.doc("siteContent/main").get();
    const data = snap.data();

    if (!data) {
      // No siteContent doc yet — allow any authenticated user (they'll create it)
      return { uid: decoded.uid, email: decoded.email };
    }

    const blogUsers: { email: string }[] = data.blogUsers || [];
    const contactEmail: string = data.contactEmail || "";

    const isAdmin =
      blogUsers.some((u) => u.email === decoded.email) ||
      decoded.email === contactEmail;

    if (!isAdmin) {
      throw new AuthError(
        `Unauthorized: ${decoded.email} is not an admin. Contact email: ${contactEmail}, blogUsers: ${blogUsers.length}`,
        403
      );
    }
  } catch (err) {
    if (err instanceof AuthError) throw err;
    // If Firestore read fails, fall back to ADMIN_EMAIL check (already done above)
    // If that didn't match, re-throw as auth error
    console.error("[admin-auth] Firestore check failed:", err);
    throw new AuthError("Could not verify admin status", 500);
  }

  return { uid: decoded.uid, email: decoded.email };
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
