import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// GET: Fetch master records (optional module filter)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleParam = searchParams.get("module");

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Check count and seed if empty
    const totalCount = await db.collection("masters").countDocuments();
    if (totalCount === 0) {
      await db.collection("masters").insertMany(defaultMasterRecords);
    }

    const query = moduleParam ? { module: moduleParam } : {};
    const records = await db
      .collection("masters")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const formattedData = records.map((item) => ({
      ...item,
      _id: item._id.toString(),
      id: item._id.toString(),
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }
}

// POST: Add new master record
export async function POST(request) {
  try {
    const body = await request.json();
    const { module: targetModule, name, status } = body;

    if (!targetModule || !name) {
      return NextResponse.json(
        { error: "Module and Name are required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const newRecord = {
      module: targetModule.trim(),
      name: name.trim(),
      status: status ? status.trim() : "Active",
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("masters").insertOne(newRecord);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      data: { ...newRecord, _id: result.insertedId.toString(), id: result.insertedId.toString() },
      message: "Master record created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create master record: ${error.message}` },
      { status: 500 }
    );
  }
}

// PUT: Update master record
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, status } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and Name are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const updateData = {
      name: name.trim(),
      status: status ? status.trim() : "Active",
      updatedAt: new Date().toISOString(),
    };

    const result = await db
      .collection("masters")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "Master record updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update master record: ${error.message}` },
      { status: 500 }
    );
  }
}

// DELETE: Delete master record
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

    const result = await db
      .collection("masters")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "Master record deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete master record: ${error.message}` },
      { status: 500 }
    );
  }
}
