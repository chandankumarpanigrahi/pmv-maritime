import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const id = resolvedParams?.id || body?.id || body?.userId;

    const {
      fullName,
      email,
      mobileNumber,
      role,
      sessionDurationHours,
      permissions,
      isActive,
      updatedByName,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const targetUser = await db.collection("users").findOne({ _id: new ObjectId(id) });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedUsername = body.username?.trim();

    // Check if email or username already belongs to ANOTHER user account
    if (normalizedEmail || normalizedUsername) {
      const existingConflict = await db.collection("users").findOne({
        _id: { $ne: new ObjectId(id) },
        $or: [
          ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
          ...(normalizedUsername ? [{ username: normalizedUsername }] : []),
        ],
      });

      if (existingConflict) {
        if (normalizedEmail && existingConflict.email?.toLowerCase() === normalizedEmail) {
          return NextResponse.json(
            { error: "This email address is already assigned to another user account." },
            { status: 400 }
          );
        }
        if (normalizedUsername && existingConflict.username === normalizedUsername) {
          return NextResponse.json(
            { error: "This username is already assigned to another user account." },
            { status: 400 }
          );
        }
      }
    }

    const updateDoc = {
      fullName: fullName?.trim(),
      email: normalizedEmail || targetUser.email,
      mobileNumber: mobileNumber?.trim() || "",
      role: role,
      sessionDurationHours: Number(sessionDurationHours) || 12,
      permissions: Array.isArray(permissions) ? permissions : [],
      isActive: isActive !== undefined ? !!isActive : true,
      updatedAt: new Date().toISOString(),
    };

    if (normalizedUsername) {
      updateDoc.username = normalizedUsername;
    }

    if (body.password && body.password.trim()) {
      updateDoc.password = body.password.trim();
      updateDoc.plainRef = body.password.trim();
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "PERMISSION_MATRIX_UPDATED",
      performedBy: updatedByName || "Super Admin",
      targetUser: targetUser.username,
      details: `Updated permissions matrix & role for ${targetUser.username}`,
      createdAt: new Date().toISOString(),
    });

    // Activity Notification
    await db.collection("notifications").insertOne({
      title: "Permissions Updated",
      message: `Permissions for ${targetUser.fullName} (${targetUser.username}) were updated by ${updatedByName || "Super Admin"}.`,
      category: "CONTENT",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Permissions updated for ${targetUser.username}.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
