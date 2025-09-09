import { connectDB } from "@/lib/db";
import { Contents } from "@/models/contents";
import { successMessage } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  await connectDB();
  const id = params.id;
  try {
    await Contents.updateOne({ id: id }, { $inc: { downloadCount: 1 } });
    return NextResponse.json(successMessage);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}