import { connectDB } from "@/lib/db";
import { Likes } from "@/models/likes";
import { Votes } from "@/models/votes";
import { successMessage } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const userId = params.userId;
  const likes = await Likes.find({ userId: userId });
  return NextResponse.json({ likes: likes });
}

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();
  const voteId = body.voteId;

  try {
    await Likes.insertMany({
      userId: params.userId,
      voteId: voteId,
    });

    await Votes.updateOne(
      { id: voteId },
      { $inc: { like: 1 } }
    );
    return NextResponse.json(successMessage);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}