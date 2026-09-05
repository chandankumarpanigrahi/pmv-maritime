import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { generateUserCredentialsEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required to send credentials." },
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
      // In case ID is a custom string
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

    const passwordToSend = user.plainRef || user.password;
    if (!passwordToSend) {
      return NextResponse.json(
        { error: "No password reference found for this user account." },
        { status: 400 }
      );
    }

    // SMTP Configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { error: "SMTP credentials are not configured in environment variables." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const emailHtml = generateUserCredentialsEmailHTML({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      password: passwordToSend,
      loginUrl: "https://pmvmaritime.com/admin",
    });

    await transporter.sendMail({
      from: `"PMV Maritime Solutions" <${smtpUser}>`,
      to: user.email,
      subject: "Your PMV Maritime Admin Panel Credentials",
      html: emailHtml,
    });

    // Security Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "CREDENTIALS_EMAIL_SENT",
      performedBy: "Super Admin",
      targetUser: user.username,
      details: `Sent admin access credentials to ${user.email}`,
      createdAt: new Date().toISOString(),
    });

    // Security Notification Entry
    await db.collection("notifications").insertOne({
      title: "Credentials Email Sent",
      message: `Admin access credentials for ${user.fullName} (@${user.username}) were sent to ${user.email}.`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Credentials successfully sent to ${user.email}`,
    });
  } catch (error) {
    console.error("Failed to send credentials email:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send credentials email." },
      { status: 500 }
    );
  }
}
