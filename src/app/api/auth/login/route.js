import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { SYSTEM_ROLES } from "@/lib/permissions";
import { verifyPassword, hashPassword, isBcryptHash } from "@/lib/authCrypto";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const rawIdentifier = body.email || body.username;
    const password = body.password;

    if (!rawIdentifier?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "Email address and password are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Client IP & User Agent
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Unknown Device";

    const envSuperUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
    const envSuperPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

    const input = rawIdentifier.trim();
    const inputLower = input.toLowerCase();

    let userObj = null;

    // 1. Check if Super Admin login credentials match
    if (
      (inputLower === envSuperUser.toLowerCase() ||
        inputLower === "admin@pmvmaritime.com" ||
        inputLower === "admin") &&
      password.trim() === envSuperPass
    ) {
      userObj = {
        _id: "super-admin-root",
        fullName: "Super Administrator",
        email: "admin@pmvmaritime.com",
        role: SYSTEM_ROLES.SUPER_ADMIN,
        sessionDurationHours: 24,
        permissions: ["ALL"],
      };
    } else {
      // 2. Search standard users collection by email (with backward-compatible username fallback)
      const dbUser = await db.collection("users").findOne({
        $or: [
          { email: inputLower },
          { username: input },
          { username: inputLower },
        ],
      });

      if (!dbUser) {
        return NextResponse.json(
          { error: "Invalid email address or password." },
          { status: 401 }
        );
      }

      if (dbUser.isActive === false) {
        return NextResponse.json(
          { error: "Access Denied: Your account login has been restricted by Super Admin." },
          { status: 403 }
        );
      }

      // 3. Verify password
      let isMatch = false;
      if (isBcryptHash(dbUser.password)) {
        isMatch = await verifyPassword(password, dbUser.password);
      } else if (dbUser.password) {
        // Self-healing: if legacy plaintext, check match and auto-hash immediately
        if (dbUser.password === password.trim()) {
          isMatch = true;
          try {
            const newHash = await hashPassword(password.trim());
            await db.collection("users").updateOne(
              { _id: dbUser._id },
              {
                $set: { password: newHash, updatedAt: new Date().toISOString() },
                $unset: { plainRef: "", username: "" },
              }
            );
          } catch (migrateErr) {
            console.error("Auto-hash migration error on login:", migrateErr);
          }
        }
      }

      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid email address or password." },
          { status: 401 }
        );
      }

      userObj = {
        _id: dbUser._id.toString(),
        fullName: dbUser.fullName || dbUser.email,
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
    console.error("Login route error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
