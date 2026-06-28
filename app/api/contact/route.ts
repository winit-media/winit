import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/smtp";
import {
  visitorAutoResponseTemplate,
  adminNotificationTemplate,
} from "@/lib/email/templates";
import { fetchSiteContent } from "@/lib/firebase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const siteDetails = await fetchSiteContent();
    const adminEmail = process.env.ADMIN_EMAIL || siteDetails.contactEmail;

    const adminMail = adminNotificationTemplate(
      { name, email, phone, message },
      siteDetails
    );

    await sendEmail({
      to: adminEmail,
      subject: adminMail.subject,
      html: adminMail.html,
      replyTo: email,
    });

    const visitorMail = visitorAutoResponseTemplate(
      { name, email, phone, message },
      siteDetails
    );

    await sendEmail({
      to: email,
      subject: visitorMail.subject,
      html: visitorMail.html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] /api/contact error:", err);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
