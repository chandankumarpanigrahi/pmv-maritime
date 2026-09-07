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

    // Check if email already belongs to ANOTHER user account
    if (normalizedEmail) {
      const existingConflict = await db.collection("users").findOne({
        _id: { $ne: new ObjectId(id) },
        email: normalizedEmail,
      });

      if (existingConflict) {
        return NextResponse.json(
          { error: "This email address is already assigned to another user account." },
          { status: 400 }
        );
      }
    }

    const updateDoc = {
      fullName: fullName?.trim() || targetUser.fullName,
      email: normalizedEmail || targetUser.email,
      mobileNumber: mobileNumber?.trim() || "",
      role: role || targetUser.role,
      sessionDurationHours: Number(sessionDurationHours) || 12,
      permissions: Array.isArray(permissions) ? permissions : [],
      isActive: isActive !== undefined ? !!isActive : true,
      updatedAt: new Date().toISOString(),
    };

    await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: updateDoc,
        $unset: { plainRef: "", username: "" },
      }
    );

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "USER_UPDATED",
      performedBy: updatedByName || "Super Admin",
      targetUser: updateDoc.email,
      details: `Updated details and permissions matrix for ${updateDoc.fullName} (${updateDoc.email})`,
      createdAt: new Date().toISOString(),
    });

    // Activity Notification
    await db.collection("notifications").insertOne({
      title: "User Permissions Updated",
      message: `Account settings for ${updateDoc.fullName} (${updateDoc.email}) were updated by ${updatedByName || "Super Admin"}.`,
      category: "CONTENT",
      targetRole: "SUPER_ADMIN",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Settings updated for ${updateDoc.fullName}.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
