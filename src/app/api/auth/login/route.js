import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { SYSTEM_ROLES } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Client IP & User Agent
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown Device";

    const envSuperUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
    const envSuperPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    const input = username.trim();
    const inputLower = input.toLowerCase();

    let userObj = null;

    // Check if Super Admin login credentials match (by username or email)
    if (
      (inputLower === envSuperUser.toLowerCase() || inputLower === "admin@pmvmaritime.com") &&
      password.trim() === envSuperPass
    ) {
      userObj = {
        _id: "super-admin-root",
        username: envSuperUser,
        fullName: "Super Administrator",
        email: "admin@pmvmaritime.com",
        role: SYSTEM_ROLES.SUPER_ADMIN,
        sessionDurationHours: 24,
        permissions: ["ALL"],
      };
    } else {
      // Search in MongoDB users collection by username OR email
      const dbUser = await db.collection("users").findOne({
        $or: [
          { username: input },
          { username: inputLower },
          { email: inputLower },
        ],
        password: password.trim(),
      });

      if (!dbUser) {
        return NextResponse.json(
          { error: "Invalid username/email or password." },
          { status: 401 }
        );
      }

      if (dbUser.isActive === false) {
        return NextResponse.json(
          { error: "Access Denied: Your account login has been restricted by Super Admin." },
          { status: 403 }
        );
      }

      userObj = {
        _id: dbUser._id.toString(),
        username: dbUser.username,
        fullName: dbUser.fullName || dbUser.username,
        email: dbUser.email,
        mobileNumber: dbUser.mobileNumber || "",
        role: dbUser.role || SYSTEM_ROLES.ASSOCIATE,
        sessionDurationHours: Number(dbUser.sessionDurationHours) || 12,
        permissions: Array.isArray(dbUser.permissions) ? dbUser.permissions : [],
      };
    }

    // Calculate expiry timestamp based on sessionDurationHours
    const durationHours = userObj.sessionDurationHours || 12;
    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000).toISOString();
    const loginTime = new Date().toISOString();
    const sessionToken = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Store Session Log in MongoDB
    await db.collection("session_logs").insertOne({
      sessionToken,
      userId: userObj._id,
      username: userObj.username,
      fullName: userObj.fullName,
      email: userObj.email,
      role: userObj.role,
      ipAddress,
      userAgent,
      loginTime,
      expiresAt,
      isTerminated: false,
    });

    // Create System Notification for Login Activity
    await db.collection("notifications").insertOne({
      title: "User Logged In",
      message: `${userObj.fullName} (${userObj.role}) logged in from ${ipAddress}.`,
      category: "LOGIN",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      session: {
        loggedIn: true,
        sessionToken,
        user: userObj,
        expiresAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
