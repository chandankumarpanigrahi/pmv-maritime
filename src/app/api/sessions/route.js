import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// ─── GET: List Active Sessions for Super Admin ──────────────────────────────
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const sessions = await db
      .collection("session_logs")
      .find({})
      .sort({ loginTime: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json(
      sessions.map((s) => ({ ...s, _id: s._id.toString() }))
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST: Check Session Validity / Active Status ───────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionToken } = body;

    if (!sessionToken) {
      return NextResponse.json({ valid: false, message: "No token provided." }, { status: 400 });
    }

    // Super Admin root session bypass
    if (sessionToken.startsWith("sess_super_admin")) {
      return NextResponse.json({ valid: true });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const session = await db.collection("session_logs").findOne({ sessionToken });

    if (!session) {
      return NextResponse.json({ valid: false, message: "Session not found." });
    }

    if (session.isTerminated) {
      return NextResponse.json({ valid: false, message: "Session terminated by Super Admin." });
    }

    let freshUser = null;
    if (session.userId && ObjectId.isValid(session.userId)) {
      const dbUser = await db.collection("users").findOne({ _id: new ObjectId(session.userId) });
      if (dbUser) {
        if (dbUser.isActive === false) {
          return NextResponse.json({ valid: false, message: "User account access has been restricted." });
        }
        freshUser = {
          _id: dbUser._id.toString(),
          username: dbUser.username,
          fullName: dbUser.fullName || dbUser.username,
          email: dbUser.email,
          mobileNumber: dbUser.mobileNumber || "",
          role: dbUser.role,
          permissions: Array.isArray(dbUser.permissions) ? dbUser.permissions : [],
          sessionDurationHours: dbUser.sessionDurationHours || 12,
        };
      }
    }

    return NextResponse.json({ valid: true, user: freshUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── DELETE: Clear Inactive / Ended Sessions (Keep Active Sessions) ─────────
export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const nowIso = new Date().toISOString();

    const result = await db.collection("session_logs").deleteMany({
      $or: [
        { isTerminated: true },
        { expiresAt: { $lt: nowIso } },
      ],
    });

    // Audit Log Entry
    await db.collection("audit_logs").insertOne({
      action: "SESSIONS_CLEARED",
      performedBy: "Super Admin",
      details: `Cleared ${result.deletedCount} ended session records`,
      createdAt: nowIso,
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleared ${result.deletedCount} ended session records.`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
