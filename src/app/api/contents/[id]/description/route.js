import { connectDB } from "@/lib/db";
import { Contents } from "@/models/contents";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const id = params.id;
  const content = await Contents.findOne({ id: id });
  return NextResponse.json({
    description: content?.description,
    downloadUrl: content?.downloadUrl,
    imageUrl: content?.imageUrl,
  });
}