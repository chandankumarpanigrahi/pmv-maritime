import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyPassword, hashPassword, isBcryptHash } from "@/lib/authCrypto";
import { getTransporter } from "@/lib/nodemailer";
import { generatePasswordChangedEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, email, currentPassword, newPassword } = body;

    if (!newPassword || newPassword.trim().length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    if (!currentPassword?.trim()) {
      return NextResponse.json(
        { error: "Current password is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Locate user by userId or email
    const query = {};
    if (userId) {
      try {
        query._id = new ObjectId(userId);
      } catch {
        query._id = userId;
      }
    } else if (email) {
      query.email = email.trim().toLowerCase();
    } else {
      return NextResponse.json(
        { error: "User identification (ID or Email) is required." },
        { status: 400 }
      );
    }

    const dbUser = await db.collection("users").findOne(query);
    if (!dbUser) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Verify current password
    let isCurrentMatch = false;
    if (isBcryptHash(dbUser.password)) {
      isCurrentMatch = await verifyPassword(currentPassword, dbUser.password);
    } else if (dbUser.password === currentPassword.trim()) {
      isCurrentMatch = true;
    }

    if (!isCurrentMatch) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    // Hash new password
    const hashedNewPass = await hashPassword(newPassword.trim());

    await db.collection("users").updateOne(
      { _id: dbUser._id },
      {
        $set: {
          password: hashedNewPass,
          updatedAt: new Date().toISOString(),
        },
        $unset: {
          plainRef: "",
          username: "",
        },
      }
    );

    // Audit Log
    await db.collection("audit_logs").insertOne({
      action: "PASSWORD_CHANGED_BY_USER",
      performedBy: dbUser.fullName || dbUser.email,
      targetUser: dbUser.email,
      details: `${dbUser.fullName || dbUser.email} updated their account password`,
      createdAt: new Date().toISOString(),
    });

    // Notification
    await db.collection("notifications").insertOne({
      title: "Password Changed",
      message: `${dbUser.fullName || dbUser.email} updated their password.`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Send confirmation security email (WITHOUT new password)
    try {
      const transporter = getTransporter();
      const changeDateTime = new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      const emailHtml = generatePasswordChangedEmailHTML({
        fullName: dbUser.fullName,
        email: dbUser.email,
        dateTime: changeDateTime,
        loginUrl: "https://pmvmaritime.com/admin",
      });

      const smtpUser = process.env.SMTP_USER;
      await transporter.sendMail({
        from: `"PMV Maritime Solutions" <${smtpUser}>`,
        to: dbUser.email,
        subject: "Your PMV Maritime Password Has Been Changed",
        html: emailHtml,
      });
    } catch (mailErr) {
      console.error("Failed to send password changed email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
