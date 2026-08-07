import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getPerformedBy } from "@/lib/permissions";

export const dynamic = "force-dynamic";

// GET: Fetch all careers directly from MongoDB (sorted by order, then createdAt)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const careers = await db
      .collection("careers")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    const formattedData = careers.map((item, idx) => ({
      ...item,
      _id: item._id.toString(),
      order: item.order ?? idx + 1,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST: Add new career position
export async function POST(request) {
  try {
    const body = await request.json();
    const { category, position, location, department, type, deadline, overview, responsibilities } = body;

    if (!position || !location || !department) {
      return NextResponse.json(
        { error: "Position, Location, and Department are required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Determine highest existing order
    const maxOrderDoc = await db
      .collection("careers")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const nextOrder =
      maxOrderDoc.length > 0 && typeof maxOrderDoc[0].order === "number"
        ? maxOrderDoc[0].order + 1
        : 1;

    const parsedResponsibilities = Array.isArray(responsibilities)
      ? responsibilities.map((r) => String(r).trim()).filter(Boolean)
      : typeof responsibilities === "string"
      ? responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

    const newCareer = {
      category: category === "shore" ? "shore" : "sea",
      position: position.trim(),
      location: location.trim(),
      department: department.trim(),
      type: type ? type.trim() : "Full Time",
      deadline: deadline ? deadline.trim() : "",
      overview: overview ? overview.trim() : "",
      responsibilities: parsedResponsibilities,
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("careers").insertOne(newCareer);

    // Create Notification
    const performedBy = getPerformedBy(request);
    await db.collection("notifications").insertOne({
      title: "Career Position Created",
      message: `Career position "${position.trim()}" was created by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      data: { ...newCareer, _id: result.insertedId.toString() },
      message: "Career position created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create career position: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT: Update career position
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, category, position, location, department, type, deadline, overview, responsibilities } = body;

    if (!id || !position || !location || !department) {
      return NextResponse.json(
        { error: "ID, Position, Location, and Department are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const parsedResponsibilities = Array.isArray(responsibilities)
      ? responsibilities.map((r) => String(r).trim()).filter(Boolean)
      : typeof responsibilities === "string"
      ? responsibilities
          .split("\n")
          .map((r) => r.trim())
          .filter(Boolean)
      : [];

    const updateData = {
      category: category === "shore" ? "shore" : "sea",
      position: position.trim(),
      location: location.trim(),
      department: department.trim(),
      type: type ? type.trim() : "Full Time",
      deadline: deadline ? deadline.trim() : "",
      overview: overview ? overview.trim() : "",
      responsibilities: parsedResponsibilities,
      updatedAt: new Date().toISOString(),
    };

    const result = await db
      .collection("careers")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    // Create Notification
    const performedBy = getPerformedBy(request);
    await db.collection("notifications").insertOne({
      title: "Career Position Updated",
      message: `Career position "${position.trim()}" was updated by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "Career position updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update career position: ${error.message}` },
      { status: 500 }
    );
  }
}

// PATCH: Archive, Restore, or Bulk update sequence / order
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, action, orderedIds } = body;

    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const performedBy = getPerformedBy(request);

    // Single item Archive or Restore
    if (id && action) {
      const isArchived = action === "archive";

      // Get position details before updating
      const career = await db.collection("careers").findOne({ _id: new ObjectId(id) });
      const careerPos = career ? career.position : "Unknown Position";

      await db.collection("careers").updateOne(
        { _id: new ObjectId(id) },
        { $set: { archived: isArchived, updatedAt: new Date().toISOString() } }
      );

      // Create Notification
      await db.collection("notifications").insertOne({
        title: isArchived ? "Career Position Archived" : "Career Position Restored",
        message: `Career position "${careerPos}" was ${isArchived ? "archived" : "restored"} by ${performedBy}.`,
        category: "CMS",
        targetRole: "ALL",
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: isArchived ? "Career position archived." : "Career position restored.",
      });
    }

    // Bulk reorder sequence
    if (Array.isArray(orderedIds)) {
      const bulkOps = orderedIds.map((itemId, index) => ({
        updateOne: {
          filter: { _id: new ObjectId(itemId) },
          update: { $set: { order: index + 1 } },
        },
      }));

      if (bulkOps.length > 0) {
        await db.collection("careers").bulkWrite(bulkOps);
      }

      // Create Notification
      await db.collection("notifications").insertOne({
        title: "Careers Reordered",
        message: `Careers sequence was updated by ${performedBy}.`,
        category: "CMS",
        targetRole: "ALL",
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Career sequence updated successfully.",
      });
    }

    return NextResponse.json(
      { error: "Invalid PATCH parameters." },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update status: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE: Delete career position
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID parameter." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const performedBy = getPerformedBy(request);

    // Get position details before deleting
    const career = await db.collection("careers").findOne({ _id: new ObjectId(id) });
    const careerPos = career ? career.position : "Unknown Position";

    const result = await db
      .collection("careers")
      .deleteOne({ _id: new ObjectId(id) });

    // Create Notification
    await db.collection("notifications").insertOne({
      title: "Career Position Deleted",
      message: `Career position "${careerPos}" was deleted permanently by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Career position deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete career position: ${error.message}` },
      { status: 500 }
    );
  }
}
