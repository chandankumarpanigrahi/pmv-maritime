import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getPerformedBy } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const DEFAULT_HIGHLIGHTS = [
  {
    icon: "TbCompass",
    title: "Strategic Advisory",
    description: "Helping you define vision, strategy, and roadmap for long-term maritime success.",
  },
  {
    icon: "TbShip",
    title: "Operational Excellence",
    description: "Improving efficiency, reducing costs, and optimizing processes across your operations.",
  },
  {
    icon: "TbUserShield",
    title: "Risk & Compliance",
    description: "Ensuring adherence to international regulations, safety standards, and industry best practices.",
  },
];

const DEFAULT_DELIVERABLES = [
  "Maritime business strategy",
  "Feasibility studies",
  "Market-entry advisory",
  "Regulatory and compliance support",
  "Technical and operational audits",
  "Vessel acquisition and due diligence",
  "Risk assessment and mitigation",
  "Performance-improvement planning",
];

const DEFAULT_VALUE_DELIVERED =
  "Clear strategic direction, reduced operational risk, stronger decision-making, improved compliance, and practical implementation plans.";

// ─── GET ────────────────────────────────────────────────────────────────────
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const allParam = searchParams.get("all");   // admin: include archived
    const slugParam = searchParams.get("slug"); // inner page: single project
    const idParam = searchParams.get("id");     // edit form: single project by _id
    const seedParam = searchParams.get("seed"); // force re-seed if true

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Auto-seed default projects if collection is empty or seed=true requested
    const count = await db.collection("projects").countDocuments();
    if (count === 0 || seedParam === "true") {
      if (seedParam === "true") {
        await db.collection("projects").deleteMany({});
      }
      const initialDocs = DEFAULT_PROJECTS.map((proj, idx) => ({
        title: proj.title,
        name: proj.title,
        slug: generateSlug(proj.title),
        category: proj.category,
        imageUrl: proj.imageUrl,
        shortDesc: proj.shortDesc,
        longDesc: proj.shortDesc + " " + DEFAULT_VALUE_DELIVERED,
        highlights: DEFAULT_HIGHLIGHTS,
        deliverables: DEFAULT_DELIVERABLES,
        valueDelivered: DEFAULT_VALUE_DELIVERED,
        archived: false,
        order: idx + 1,
        createdAt: new Date().toISOString(),
      }));
      await db.collection("projects").insertMany(initialDocs);
    }

    // Single by ID (edit form)
    if (idParam) {
      const project = await db.collection("projects").findOne({ _id: new ObjectId(idParam) });
      if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
      return NextResponse.json({ ...project, _id: project._id.toString(), id: project._id.toString() });
    }

    // Single by slug (inner page)
    if (slugParam) {
      const project = await db.collection("projects").findOne({ slug: slugParam, archived: false });
      if (!project) return NextResponse.json({ error: "Project not found." }, { status: 404 });
      return NextResponse.json({ ...project, _id: project._id.toString(), id: project._id.toString() });
    }

    // Build query
    const query = allParam === "true" ? {} : { archived: false };

    const projects = await db
      .collection("projects")
      .find(query)
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(
      projects.map((p) => ({ ...p, _id: p._id.toString(), id: p._id.toString() }))
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── POST ───────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json();
    const { title, category, imageUrl, shortDesc, longDesc, highlights, deliverables, valueDelivered } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Project Title is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const lastProject = await db.collection("projects").findOne({}, { sort: { order: -1 } });
    const nextOrder = (lastProject?.order || 0) + 1;

    const newProject = {
      title: title.trim(),
      name: title.trim(), // alias for compatibility
      slug: generateSlug(title),
      category: category || "Port Operations",
      imageUrl: imageUrl || "",
      shortDesc: shortDesc || "",
      longDesc: longDesc || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      valueDelivered: valueDelivered || "",
      archived: false,
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("projects").insertOne(newProject);

    // Create Notification
    const performedBy = getPerformedBy(request);
    await db.collection("notifications").insertOne({
      title: "Project Created",
      message: `Project "${title.trim()}" was created by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      data: { ...newProject, _id: result.insertedId.toString(), id: result.insertedId.toString() },
      message: "Project created successfully.",
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PUT ────────────────────────────────────────────────────────────────────
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, category, imageUrl, shortDesc, longDesc, highlights, deliverables, valueDelivered } = body;

    if (!id || !title?.trim()) {
      return NextResponse.json({ error: "ID and Title are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const updateData = {
      title: title.trim(),
      name: title.trim(),
      slug: generateSlug(title),
      category: category || "Port Operations",
      imageUrl: imageUrl || "",
      shortDesc: shortDesc || "",
      longDesc: longDesc || "",
      highlights: Array.isArray(highlights) ? highlights : [],
      deliverables: Array.isArray(deliverables) ? deliverables : [],
      valueDelivered: valueDelivered || "",
      updatedAt: new Date().toISOString(),
    };

    await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    // Create Notification
    const performedBy = getPerformedBy(request);
    await db.collection("notifications").insertOne({
      title: "Project Updated",
      message: `Project "${title.trim()}" was updated by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Project updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ─── PATCH (archive / restore or bulk reorder) ───────────────────────────────
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, archived, orderedIds } = body;

    const client = await clientPromise;
    const db = client.db("pmv_maritime");
    const performedBy = getPerformedBy(request);

    // Bulk sequence reorder
    if (Array.isArray(orderedIds)) {
      const bulkOps = orderedIds.map((docId, index) => ({
        updateOne: {
          filter: { _id: new ObjectId(docId) },
          update: { $set: { order: index + 1, updatedAt: new Date().toISOString() } },
        },
      }));

      if (bulkOps.length > 0) {
        await db.collection("projects").bulkWrite(bulkOps);
      }

      // Create Notification
      await db.collection("notifications").insertOne({
        title: "Projects Reordered",
        message: `Projects sequence was updated by ${performedBy}.`,
        category: "CMS",
        targetRole: "ALL",
        isRead: false,
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "Projects sequence updated successfully.",
      });
    }

    if (!id) {
      return NextResponse.json({ error: "ID is required." }, { status: 400 });
    }

    // Get project title
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    const projectTitle = project ? project.title : "Unknown Project";

    await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      { $set: { archived: !!archived, updatedAt: new Date().toISOString() } }
    );

    // Create Notification
    await db.collection("notifications").insertOne({
      title: archived ? "Project Archived" : "Project Restored",
      message: `Project "${projectTitle}" was ${archived ? "archived" : "restored"} by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: archived ? "Project archived." : "Project restored to Published.",
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
    const performedBy = getPerformedBy(request);

    // Get project title
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) });
    const projectTitle = project ? project.title : "Unknown Project";

    await db.collection("projects").deleteOne({ _id: new ObjectId(id) });

    // Create Notification
    await db.collection("notifications").insertOne({
      title: "Project Deleted",
      message: `Project "${projectTitle}" was deleted permanently by ${performedBy}.`,
      category: "CMS",
      targetRole: "ALL",
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: "Project deleted permanently." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
