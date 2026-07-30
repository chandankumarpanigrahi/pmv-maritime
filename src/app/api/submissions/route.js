import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { generateSubmissionEmailHTML } from "@/lib/emailTemplate";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const submissions = await db
      .collection("submissions")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Map Mongo document _id to string for JSON serialization
    const formattedData = submissions.map((item) => ({
      ...item,
      _id: item._id.toString(),
      archived: Boolean(item.archived),
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: `Database connection error: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, query, message } = body;

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full Name, Email, and Message are required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const newSubmission = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      query: query || "general",
      message: message.trim(),
      archived: false,
      createdAt: new Date().toISOString(),
      dateTime: new Date().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };

    // 1. Insert into MongoDB database
    const result = await db.collection("submissions").insertOne(newSubmission);

    // 2. Send Email Notification (if SMTP environment variables are configured)
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const recipientEmail = process.env.NOTIFICATION_RECIPIENT || process.env.SMTP_USER;

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const port = Number(process.env.SMTP_PORT) || 465;
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: port,
          secure: port === 465, // true for 465, false for 587 or others
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const htmlContent = generateSubmissionEmailHTML({
          fullName: newSubmission.fullName,
          email: newSubmission.email,
          query: newSubmission.query,
          message: newSubmission.message,
          dateTime: newSubmission.dateTime,
        });

        await transporter.sendMail({
          from: `"PMV Contact Form" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: newSubmission.email,
          subject: `New Submission: ${newSubmission.fullName}`,
          html: htmlContent,
        });
      } catch (emailErr) {
        console.error("Failed to send email notification:", emailErr);
        // We log the error but still return success since it's saved in MongoDB
      }
    }

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      message: "Form submission saved successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to save submission: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const { id, action } = await request.json();
    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing id or action parameter." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const isArchived = action === "archive";
    const result = await db
      .collection("submissions")
      .updateOne({ _id: new ObjectId(id) }, { $set: { archived: isArchived } });

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const result = await db
      .collection("submissions")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
