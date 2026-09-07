import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getTransporter } from "@/lib/nodemailer";
import { generateUserCredentialsEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required to send access instructions." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Fetch target user
    let user = null;
    try {
      user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    } catch {
      user = await db.collection("users").findOne({ _id: userId });
    }

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "This user does not have an email address associated with their account." },
        { status: 400 }
      );
    }

    // Send access instructions email (NO raw passwords)
    const transporter = getTransporter();
    const emailHtml = generateUserCredentialsEmailHTML({
      fullName: user.fullName || "User",
      email: user.email,
      loginUrl: "https://pmvmaritime.com/admin",
    });

    const smtpUser = process.env.SMTP_USER;
    await transporter.sendMail({
      from: `"PMV Maritime Solutions" <${smtpUser}>`,
      to: user.email,
      subject: "Your PMV Maritime Admin Panel Access Instructions",
      html: emailHtml,
    });

    // Security Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "ACCESS_EMAIL_SENT",
      performedBy: "Super Admin",
      targetUser: user.email,
      details: `Sent admin access instructions to ${user.email}`,
      createdAt: new Date().toISOString(),
    });

    // Security Notification Entry
    await db.collection("notifications").insertOne({
      title: "Access Instructions Sent",
      message: `Admin access instructions for ${user.fullName || user.email} were sent to ${user.email}.`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Access instructions successfully sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Failed to send access email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send access email." },
      { status: 500 }
    );
  }
}
