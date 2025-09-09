import { connectDB } from "@/lib/db";
import { Votes } from "@/models/votes";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  const votes = await Votes.find();
  return NextResponse.json({ votes: votes });
}