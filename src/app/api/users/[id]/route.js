import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// ─── DELETE: Permanently Delete User Account ──────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Check target user
    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (targetUser.role === "SUPER_ADMIN" || targetUser._id.toString() === "super-admin-root") {
      return NextResponse.json(
        { error: "Super Administrator root accounts cannot be deleted." },
        { status: 403 }
      );
    }

    // Delete user from users collection
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });

    // Forcibly terminate any active session logs for this user
    await db.collection("session_logs").updateMany(
      {
        $or: [{ userId: id.toString() }, { username: targetUser.username }],
        isTerminated: false,
      },
      {
        $set: {
          isTerminated: true,
          terminatedAt: new Date().toISOString(),
          terminatedBy: "Super Admin",
          endReason: "ACCOUNT_DELETED",
        },
      }
    );

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "USER_ACCOUNT_DELETED",
      performedBy: "Super Admin",
      targetUser: targetUser.username,
      details: `Permanently deleted user account ${targetUser.username} (${targetUser.email})`,
      createdAt: new Date().toISOString(),
    });

    // Notification Entry
    await db.collection("notifications").insertOne({
      title: "User Account Deleted",
      message: `User account for ${targetUser.fullName} (@${targetUser.username}) was permanently deleted by Super Admin.`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `User account @${targetUser.username} permanently deleted.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
