import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifyOTP, hashPassword } from "@/lib/authCrypto";
import { getTransporter } from "@/lib/nodemailer";
import { generatePasswordChangedEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp, newPassword } = body;

    if (!email?.trim()) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    if (!otp?.trim() || otp.trim().length !== 6) {
      return NextResponse.json({ error: "Please provide a valid 6-digit verification code." }, { status: 400 });
    }

    if (!newPassword || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();
    const cleanNewPass = newPassword.trim();

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // 1. Find the target user
    const user = await db.collection("users").findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    if (user.isActive === false) {
      return NextResponse.json(
        { error: "This account has been restricted by Super Admin." },
        { status: 403 }
      );
    }

    // 2. Find the active, non-expired OTP record
    const resetDoc = await db.collection("password_resets").findOne({
      email: normalizedEmail,
      used: false,
      expiresAt: { $gt: new Date() },
    }, { sort: { createdAt: -1 } });

    if (!resetDoc) {
      return NextResponse.json(
        { error: "Verification code has expired or is invalid. Please request a new code." },
        { status: 400 }
      );
    }

    // 3. Check rate limiting / brute-force attempts
    if (resetDoc.attempts >= 5) {
      await db.collection("password_resets").updateOne(
        { _id: resetDoc._id },
        { $set: { used: true, invalidatedReason: "MAX_ATTEMPTS_EXCEEDED" } }
      );
      return NextResponse.json(
        { error: "Too many incorrect attempts. This code has been invalidated. Please request a new one." },
        { status: 429 }
      );
    }

    // 4. Verify OTP
    const isValidOtp = await verifyOTP(cleanOtp, resetDoc.otpHash);
    if (!isValidOtp) {
      await db.collection("password_resets").updateOne(
        { _id: resetDoc._id },
        { $inc: { attempts: 1 } }
      );
      const remainingAttempts = 5 - (resetDoc.attempts + 1);
      return NextResponse.json(
        { error: `Invalid verification code. ${remainingAttempts} attempts remaining.` },
        { status: 400 }
      );
    }

    // 5. Hash new password with bcrypt (10 rounds)
    const hashedPassword = await hashPassword(cleanNewPass);

    // 6. Update user document (removing any plainRef and username)
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
        },
        $unset: {
          plainRef: "",
          username: "",
        },
      }
    );

    // 7. Mark OTP as used
    await db.collection("password_resets").updateOne(
      { _id: resetDoc._id },
      { $set: { used: true, usedAt: new Date() } }
    );

    // 8. Invalidate any existing active sessions for security
    await db.collection("session_logs").updateMany(
      {
        $or: [{ userId: user._id.toString() }, { email: normalizedEmail }],
        isTerminated: false,
      },
      {
        $set: {
          isTerminated: true,
          terminatedAt: new Date().toISOString(),
          endReason: "PASSWORD_RESET",
        },
      }
    );

    // 9. Audit Log
    await db.collection("audit_logs").insertOne({
      action: "PASSWORD_RESET_OTP",
      performedBy: user.fullName || normalizedEmail,
      targetUser: normalizedEmail,
      details: `Password reset successfully completed via email OTP for ${normalizedEmail}`,
      createdAt: new Date().toISOString(),
    });

    // 10. Notification
    await db.collection("notifications").insertOne({
      title: "Password Reset Completed",
      message: `Password was successfully reset via verification code for ${user.fullName || normalizedEmail} (${normalizedEmail}).`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // 11. Dispatch confirmation email (WITHOUT plain password)
    try {
      const transporter = getTransporter();
      const changeDateTime = new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const emailHtml = generatePasswordChangedEmailHTML({
        fullName: user.fullName,
        email: user.email,
        dateTime: changeDateTime,
        loginUrl: "https://pmvmaritime.com/admin",
      });

      const smtpUser = process.env.SMTP_USER;
      await transporter.sendMail({
        from: `"PMV Maritime Solutions" <${smtpUser}>`,
        to: user.email,
        subject: "Your PMV Maritime Password Has Been Reset",
        html: emailHtml,
      });
    } catch (mailErr) {
      console.error("Failed to send password reset confirmation email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
