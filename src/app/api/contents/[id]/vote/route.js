import { connectDB } from "@/lib/db";
import { Votes } from "@/models/votes";
import { Likes } from "@/models/likes";
import { successMessage } from "@/utils/constants";
import { getNextSequence } from "@/utils/utilFunc";
import { updateVoteAverageScore } from "@/utils/utilFunc";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  const id = params.id;
  const votes = await Votes.find({ contentId: id });
  return NextResponse.json({ votes: votes });
}

export async function POST(request, { params }) {
  await connectDB();
  const contentId = params.id;
  const body = await request.json();
  const voteId = await getNextSequence('voteId');

  try {
    await Votes.updateOne(
      { userId: body.userId },
      {
        id: voteId,
        contentId: body.contentId,
        userId: body.userId,
        name: body.name,
        score: body.score,
        comment: body.comment,
        like: body.like,
        date: body.date,
      },
      { upsert: true }
    );
    updateVoteAverageScore(Number(contentId));
    return NextResponse.json(successMessage);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  const contentId = params.id;
  const body = await request.json();
  const voteId = body.id;

  try {
    await Votes.updateOne(
      {
        id: voteId,
        userId: body.userId
      },
      {
        contentId: body.contentId,
        userId: body.userId,
        name: body.name,
        score: body.score,
        comment: body.comment,
        like: 0, //いいね数を変えない場合はbody.like
        date: body.date,
      },
      { upsert: false }
    );

    // 編集されたVoteをいいね一覧から削除
    await Likes.deleteMany({ voteId: voteId });
    updateVoteAverageScore(Number(contentId));
    return NextResponse.json(successMessage);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}