import { NextResponse } from "next/server";
import { query } from "@/lib/database";

async function updateVoteAverageScore(contentId) {
  const votes = await query(`SELECT score FROM votes WHERE content_id = $1`, [
    contentId,
  ]);
  if (votes.rows.length === 0) return;
  const total = votes.rows.reduce((sum, v) => sum + v.score, 0);
  const averageScore = total / votes.rows.length;
  await query(`UPDATE contents SET vote_average_score = $1 WHERE id = $2`, [
    averageScore,
    contentId,
  ]);
}

export async function GET() {
  const result = await query(`SELECT * FROM votes`);
  const votes = result.rows.map((v) => ({
    id: v.id,
    contentId: v.content_id,
    userId: v.user_id,
    name: v.name,
    score: v.score,
    comment: v.comment,
    like: v.like,
    date: v.date,
  }));
  return NextResponse.json({ votes });
}