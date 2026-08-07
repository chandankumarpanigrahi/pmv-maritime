import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { SYSTEM_ROLES } from "@/lib/permissions";

export const dynamic = "force-dynamic";

// ─── GET: List Users & Audit Logs ───────────────────────────────────────────
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const auditLogs = await db
      .collection("audit_logs")
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      users: users.map((u) => ({ ...u, _id: u._id.toString() })),
      auditLogs: auditLogs.map((l) => ({ ...l, _id: l._id.toString() })),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST: Create New User Account ──────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      username,
      email,
      mobileNumber,
      password,
      role,
      sessionDurationHours,
      permissions,
      createdByName,
    } = body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Username, Email, and Password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    // Check existing username or email case-insensitively
    const existing = await db.collection("users").findOne({
      $or: [
        { username: normalizedUsername },
        { email: normalizedEmail },
        { email: email.trim() },
      ],
    });

    if (existing) {
      if (existing.email.toLowerCase() === normalizedEmail) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "An account with this username already exists." },
        { status: 400 }
      );
    }

    const newUser = {
      fullName: fullName?.trim() || username.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      mobileNumber: mobileNumber?.trim() || "",
      password: password.trim(),
      plainRef: password.trim(),
      role: role || SYSTEM_ROLES.ASSOCIATE,
      sessionDurationHours: Number(sessionDurationHours) || 12,
      permissions: Array.isArray(permissions) ? permissions : [],
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("users").insertOne(newUser);

    // Activity Notification
    await db.collection("notifications").insertOne({
      title: "New User Account Created",
      message: `Account for ${newUser.fullName} (${newUser.role}) was created by ${createdByName || "Super Admin"}.`,
      category: "CONTENT",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "USER_CREATED",
      performedBy: createdByName || "Super Admin",
      targetUser: newUser.username,
      details: `Created account for ${newUser.username} with role ${newUser.role}`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `User ${newUser.username} created successfully.`,
      insertedId: result.insertedId.toString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
