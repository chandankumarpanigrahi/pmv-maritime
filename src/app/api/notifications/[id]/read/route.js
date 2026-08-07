import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: "Notification ID required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    await db.collection("notifications").updateOne(
      { _id: new ObjectId(id) },
      { $set: { isRead: true, readAt: new Date().toISOString() } }
    );

    return NextResponse.json({ success: true, message: "Marked as read." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
