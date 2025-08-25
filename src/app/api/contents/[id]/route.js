import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { convertLinkToDownloadable } from "@/lib/converter";

export async function GET(request, { params }) {
  const id = params.id;
  const result = await query(`SELECT * FROM contents WHERE id = $1`, [id]);
  let content = result.rows[0];
  if (content) {
    content = {
      id: content.id,
      contentType: content.content_type,
      title: content.title,
      publisher: content.publisher,
      description: content.description,
      downloadUrl: convertLinkToDownloadable(content.download_url),
      imageUrl: content.image_url,
      date: content.date,
      downloadCount: content.download_count,
      voteAverageScore: content.vote_average_score,
      songInfo: JSON.parse(content.song_info || "{}"),
    };
  }
  return NextResponse.json({ contents: content });
}