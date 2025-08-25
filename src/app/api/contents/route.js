import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { convertLinkToDownloadable } from "@/lib/converter";

export async function GET() {
  const result = await query(`SELECT * FROM contents`);
  const list = result.rows.map((c) => ({
    id: c.id,
    contentType: c.content_type,
    title: c.title,
    publisher: c.publisher,
    date: c.date,
    downloadCount: c.download_count,
    voteAverageScore: c.vote_average_score,
    songInfo: JSON.parse(c.song_info || "{}"),
    downloadUrl: convertLinkToDownloadable(c.download_url),
  }));
  return NextResponse.json({ contents: list });
}