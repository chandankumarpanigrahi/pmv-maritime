import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const id = resolvedParams?.id || body?.id || body?.userId;

    const { isActive, performedBy } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    if (isActive === undefined) {
      return NextResponse.json({ error: "isActive status boolean is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newStatus = !!isActive;

    // Update user active status in MongoDB
    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isActive: newStatus,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    // If restricting access (isActive === false), forcibly terminate all active sessions for this user
    if (!newStatus) {
      await db.collection("session_logs").updateMany(
        {
          $or: [{ userId: id.toString() }, { username: targetUser.username }],
          isTerminated: false,
        },
        {
          $set: {
            isTerminated: true,
            terminatedAt: new Date().toISOString(),
            terminatedBy: performedBy || "Super Admin (Access Denied)",
            endReason: "ACCESS_RESTRICTED",
          },
        }
      );
    }

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: newStatus ? "USER_ACCESS_RESTORED" : "USER_ACCESS_RESTRICTED",
      performedBy: performedBy || "Super Admin",
      targetUser: targetUser.username,
      details: newStatus
        ? `Restored login access for user ${targetUser.username}`
        : `Restricted login access (Access Denied) for user ${targetUser.username}`,
      createdAt: new Date().toISOString(),
    });

    // Notification Entry
    await db.collection("notifications").insertOne({
      title: newStatus ? "User Access Restored" : "User Access Restricted",
      message: newStatus
        ? `Login access for ${targetUser.fullName} (${targetUser.username}) was restored by ${performedBy || "Super Admin"}.`
        : `Login access for ${targetUser.fullName} (${targetUser.username}) was restricted (Access Denied) by ${performedBy || "Super Admin"}.`,
      category: "SECURITY",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      isActive: newStatus,
      message: newStatus
        ? `Access restored for ${targetUser.username}.`
        : `Login access restricted for ${targetUser.username}.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
