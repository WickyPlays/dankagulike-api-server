import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function GET(request, { params }) {
  const userId = params.userId;
  const result = await query(`SELECT * FROM likes WHERE user_id = $1`, [
    userId,
  ]);
  const likes = result.rows.map((l) => ({
    userId: l.user_id,
    voteId: l.vote_id,
  }));
  return NextResponse.json({ likes });
}

export async function PUT(request, { params }) {
  const userId = await params.userId;
  const { voteId } = await request.json();
  try {
    await query(`INSERT INTO likes (user_id, vote_id) VALUES ($1, $2)`, [
      userId,
      voteId,
    ]);
    await query(`UPDATE votes SET "like" = "like" + 1 WHERE id = $1`, [
      voteId,
    ]);
    return NextResponse.json({ message: "Operation was successful." });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}