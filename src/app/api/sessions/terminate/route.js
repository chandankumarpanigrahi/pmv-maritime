import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, sessionToken, terminatedByName, isSelfLogout } = body;

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    let query = {};
    if (sessionId) {
      query._id = new ObjectId(sessionId);
    } else if (sessionToken) {
      query.sessionToken = sessionToken;
    } else {
      return NextResponse.json({ error: "Session ID or Token is required." }, { status: 400 });
    }

    const sessionDoc = await db.collection("session_logs").findOne(query);
    if (!sessionDoc) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    await db.collection("session_logs").updateOne(query, {
      $set: {
        isTerminated: true,
        terminatedAt: new Date().toISOString(),
        terminatedBy: isSelfLogout ? "Self Logout" : (terminatedByName || "Super Admin"),
        endReason: isSelfLogout ? "LOGOUT" : "TERMINATED",
      },
    });

    // Create Notification
    await db.collection("notifications").insertOne({
      title: isSelfLogout ? "User Logged Out" : "Session Terminated",
      message: isSelfLogout
        ? `${sessionDoc.fullName || sessionDoc.username} (${sessionDoc.role}) logged out.`
        : `Active session for ${sessionDoc.fullName || sessionDoc.username} (${sessionDoc.ipAddress}) was terminated by ${terminatedByName || "Super Admin"}.`,
      category: isSelfLogout ? "LOGIN" : "TERMINATE",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    // Audit Log
    await db.collection("audit_logs").insertOne({
      action: isSelfLogout ? "USER_LOGOUT" : "SESSION_TERMINATED",
      performedBy: sessionDoc.username,
      targetUser: sessionDoc.username,
      details: isSelfLogout
        ? `User ${sessionDoc.username} logged out from ${sessionDoc.ipAddress}`
        : `Remote terminated session token ${sessionDoc.sessionToken} for ${sessionDoc.username} (${sessionDoc.ipAddress})`,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Session for ${sessionDoc.username} terminated successfully.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
