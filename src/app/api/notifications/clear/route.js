import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const result = await db.collection("notifications").deleteMany({ isRead: true });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleared ${result.deletedCount} read notifications.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
