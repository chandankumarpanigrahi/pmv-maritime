import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { generatePasswordChangedEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

async function sendPasswordChangedEmail({ user, newPassword }) {
  if (!user || !user.email) return;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 465;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) return;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const changeDateTime = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const emailHtml = generatePasswordChangedEmailHTML({
    fullName: user.fullName,
    username: user.username,
    newPassword: newPassword.trim(),
    dateTime: changeDateTime,
    loginUrl: "https://pmvmaritime.com/admin",
  });

  await transporter.sendMail({
    from: `"PMV Maritime Solutions" <${smtpUser}>`,
    to: user.email,
    subject: "Your PMV Maritime Password Has Been Changed",
    html: emailHtml,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { userId, username, currentPassword, newPassword, isSuperAdminReset, performedBy } = body;

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json(
        { error: "New password must be at least 4 characters long." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Case 1: Super Admin Direct Reset
    if (isSuperAdminReset && userId) {
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            password: newPassword.trim(),
            plainRef: newPassword.trim(),
            updatedAt: new Date().toISOString(),
          },
        }
      );

      // Audit Log
      await db.collection("audit_logs").insertOne({
        action: "PASSWORD_RESET_BY_ADMIN",
        performedBy: performedBy || "Super Admin",
        targetUser: user.username,
        details: `Super Admin reset password for ${user.username}`,
        createdAt: new Date().toISOString(),
      });

      // Notification
      await db.collection("notifications").insertOne({
        title: "User Password Reset",
        message: `Password for ${user.fullName} (${user.username}) was reset by ${performedBy || "Super Admin"}.`,
        category: "CONTENT",
        targetRole: "SUPER_ADMIN",
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      // Automatically dispatch security notification email
      try {
        await sendPasswordChangedEmail({ user, newPassword });
      } catch (mailErr) {
        console.error("Failed to send admin reset email:", mailErr);
      }

      return NextResponse.json({
        success: true,
        message: `Password for ${user.username} reset successfully.`,
      });
    }

    // Case 2: Self-Service Password Change
    if (!username || !currentPassword) {
      return NextResponse.json(
        { error: "Current password and username are required." },
        { status: 400 }
      );
    }

    const dbUser = await db.collection("users").findOne({
      username: username.trim(),
      password: currentPassword.trim(),
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    await db.collection("users").updateOne(
      { _id: dbUser._id },
      {
        $set: {
          password: newPassword.trim(),
          plainRef: newPassword.trim(),
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // Audit Log
    await db.collection("audit_logs").insertOne({
      action: "PASSWORD_CHANGED_BY_USER",
      performedBy: dbUser.username,
      targetUser: dbUser.username,
      details: `${dbUser.username} updated their own password`,
      createdAt: new Date().toISOString(),
    });

    // Notification
    await db.collection("notifications").insertOne({
      title: "Password Changed",
      message: `${dbUser.fullName} (${dbUser.username}) changed their password.`,
      category: "CONTENT",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Automatically dispatch security notification email
    try {
      await sendPasswordChangedEmail({ user: dbUser, newPassword });
    } catch (mailErr) {
      console.error("Failed to send password changed email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

