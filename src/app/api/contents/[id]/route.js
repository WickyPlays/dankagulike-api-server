import { connectDB } from "@/lib/db";
import { Contents } from "@/models/contents";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const id = params.id;
  const contents = await Contents.find({ id: id });
  return NextResponse.json({ contents: contents });
}