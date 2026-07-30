import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    let faqs = await db
      .collection("faqs")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    // If collection is empty, seed 1 initial default FAQ
    if (faqs.length === 0) {
      const initialFaq = {
        question: "What maritime services does PMV offer?",
        answer:
          "PMV Maritime Solutions provides comprehensive maritime consultancy services including fleet management, crew management, technical consultancy, maritime training, and digital transformation solutions for the maritime industry.",
        order: 1,
        createdAt: new Date().toISOString(),
      };
      const result = await db.collection("faqs").insertOne(initialFaq);
      faqs = [{ ...initialFaq, _id: result.insertedId }];
    }

    const formattedData = faqs.map((item, idx) => ({
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { question, answer } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and Answer are required fields." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    // Determine highest existing order
    const maxOrderDoc = await db
      .collection("faqs")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const nextOrder =
      maxOrderDoc.length > 0 && typeof maxOrderDoc[0].order === "number"
        ? maxOrderDoc[0].order + 1
        : 1;

    const newFaq = {
      question: question.trim(),
      answer: answer.trim(),
      order: nextOrder,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("faqs").insertOne(newFaq);

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      data: { ...newFaq, _id: result.insertedId.toString() },
      message: "FAQ created successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create FAQ: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, question, answer } = body;

    if (!id || !question || !answer) {
      return NextResponse.json(
        { error: "ID, Question, and Answer are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const result = await db
      .collection("faqs")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            question: question.trim(),
            answer: answer.trim(),
            updatedAt: new Date().toISOString(),
          },
        }
      );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: "FAQ updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update FAQ: ${error.message}` },
      { status: 500 }
    );
  }
}

// Bulk update order / sequence
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds array is required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));

    if (bulkOps.length > 0) {
      await db.collection("faqs").bulkWrite(bulkOps);
    }

    return NextResponse.json({
      success: true,
      message: "FAQ sequence updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to update sequence: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing FAQ ID parameter." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("pmv_maritime");

    const result = await db
      .collection("faqs")
      .deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
      message: "FAQ deleted successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to delete FAQ: ${error.message}` },
      { status: 500 }
    );
  }
}
