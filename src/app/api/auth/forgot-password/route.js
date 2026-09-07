import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { generateNumericOTP, hashOTP } from "@/lib/authCrypto";
import { getTransporter } from "@/lib/nodemailer";
import { generatePasswordResetOTPEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const rawEmail = body.email || body.identifier;

    if (!rawEmail || typeof rawEmail !== "string" || !rawEmail.trim()) {
      return NextResponse.json(
        { error: "Registered email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = rawEmail.trim().toLowerCase();

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // 1. Verify user exists in database
    const user = await db.collection("users").findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return NextResponse.json(
        { error: "No user account was found with this email address." },
        { status: 404 }
      );
    }

    if (user.isActive === false) {
      return NextResponse.json(
        { error: "This account has been restricted. Please contact your Super Administrator." },
        { status: 403 }
      );
    }

    // 2. Rate limiting: Check if an OTP was already generated in the last 60 seconds
    const sixtySecondsAgo = new Date(Date.now() - 60 * 1000);
    const recentOtp = await db.collection("password_resets").findOne({
      email: normalizedEmail,
      createdAt: { $gte: sixtySecondsAgo },
      used: false,
    });

    if (recentOtp) {
      const remainingSecs = Math.max(
        1,
        60 - Math.floor((Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000)
      );
      return NextResponse.json(
        {
          error: `Please wait ${remainingSecs}s before requesting another verification code.`,
          retryAfterSeconds: remainingSecs,
        },
        { status: 429 }
      );
    }

    // 3. Invalidate any older active OTPs for this user
    await db.collection("password_resets").updateMany(
      { email: normalizedEmail, used: false },
      { $set: { used: true, invalidatedReason: "SUPERSEDED" } }
    );

    // 4. Generate 6-digit OTP and store hashed version
    const otp = generateNumericOTP(6);
    const otpHash = await hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.collection("password_resets").insertOne({
      email: normalizedEmail,
      userId: user._id,
      otpHash,
      attempts: 0,
      used: false,
      expiresAt,
      createdAt: new Date(),
    });

    // 5. Dispatch email via pooled connection
    try {
      const transporter = getTransporter();
      const emailHtml = generatePasswordResetOTPEmailHTML({
        fullName: user.fullName || "User",
        email: user.email,
        otp,
        expiryMinutes: 10,
        loginUrl: "https://pmvmaritime.com/admin",
      });

      const smtpUser = process.env.SMTP_USER;
      await transporter.sendMail({
        from: `"PMV Maritime Solutions" <${smtpUser}>`,
        to: user.email,
        subject: "Your PMV Maritime Password Reset Verification Code",
        html: emailHtml,
      });
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      return NextResponse.json(
        { error: "Failed to dispatch verification email. Please try again later." },
        { status: 500 }
      );
    }

    // 6. Security Notification Entry
    await db.collection("notifications").insertOne({
      title: "Password Reset Requested",
      message: `Password reset OTP was requested for ${user.fullName || user.email} (${user.email}).`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Mask email for display: e.g. "samir@shoolin.co.uk" -> "s***r@shoolin.co.uk"
    const [localPart, domain] = normalizedEmail.split("@");
    const maskedLocal =
      localPart.length <= 2
        ? localPart[0] + "***"
        : localPart[0] + "***" + localPart[localPart.length - 1];
    const maskedEmail = `${maskedLocal}@${domain}`;

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${maskedEmail}.`,
      maskedEmail,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
