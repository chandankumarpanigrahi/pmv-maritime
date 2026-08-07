import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const allNotifications = await db
      .collection("notifications")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const formatted = allNotifications.map((n) => ({ ...n, _id: n._id.toString() }));

    const unread = formatted.filter((n) => !n.isRead);
    const read = formatted.filter((n) => n.isRead);

    return NextResponse.json({
      unread,
      read,
      totalUnread: unread.length,
      totalRead: read.length,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PUT: Mark All Unread Notifications as Read ─────────────────────────────
export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const result = await db.collection("notifications").updateMany(
      { isRead: false },
      { $set: { isRead: true, readAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: `Marked all ${result.modifiedCount} notifications as read.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
