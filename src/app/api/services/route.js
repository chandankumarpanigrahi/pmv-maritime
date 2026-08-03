import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─── GET ────────────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const allParam = searchParams.get("all");   // admin: include archived
    const slugParam = searchParams.get("slug"); // inner page: single service
    const idParam = searchParams.get("id");     // edit form: single service by _id

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Single by ID (edit form)
    if (idParam) {
      const service = await db.collection("services").findOne({ _id: new ObjectId(idParam) });
      if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
      return NextResponse.json({ ...service, _id: service._id.toString(), id: service._id.toString() });
    }

    // Single by slug (inner page)
    if (slugParam) {
      const service = await db.collection("services").findOne({ slug: slugParam, archived: false });
      if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });
      return NextResponse.json({ ...service, _id: service._id.toString(), id: service._id.toString() });
    }

    // Build query
    const query = allParam === "true" ? {} : { archived: false };

    const services = await db
      .collection("services")
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(
      services.map((s) => ({ ...s, _id: s._id.toString(), id: s._id.toString() }))
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST ───────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, icon, shortDesc, longDesc, highlights, deliverables, promise } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Service Name is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const lastService = await db.collection("services").findOne({}, { sort: { order: -1 } });
    const nextOrder = (lastService?.order || 0) + 1;

    const newService = {
      name: name.trim(),
      slug: generateSlug(name),
      category: category || "Maritime Consultancy",
      icon: icon || "MdOutlineAnchor",
      shortDesc: shortDesc || "",
      longDesc: longDesc || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      promise: promise || "",
      archived: false,
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("services").insertOne(newService);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      data: { ...newService, _id: result.insertedId.toString(), id: result.insertedId.toString() },
      message: "Service created successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PUT ────────────────────────────────────────────────────────────────────
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, category, icon, shortDesc, longDesc, highlights, deliverables, promise } = body;

    if (!id || !name?.trim()) {
      return NextResponse.json({ error: "ID and Name are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const updateData = {
      name: name.trim(),
      slug: generateSlug(name),
      category: category || "Maritime Consultancy",
      icon: icon || "MdOutlineAnchor",
      shortDesc: shortDesc || "",
      longDesc: longDesc || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      promise: promise || "",
      updatedAt: new Date().toISOString(),
    };

    await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true, message: "Service updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PATCH (archive / restore) ───────────────────────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, archived } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    await db.collection("services").updateOne(
      { _id: new ObjectId(id) },
      { $set: { archived: !!archived, updatedAt: new Date().toISOString() } }
    );

    return NextResponse.json({
      success: true,
      message: archived ? "Service archived." : "Service restored to Published.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── DELETE ─────────────────────────────────────────────────────────────────
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    await db.collection("services").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, message: "Service deleted permanently." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
