import { connectDB } from "@/lib/db";
import { Contents } from "@/models/contents";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  const contents = await Contents.find();
  var list = [];

  contents.forEach((c) =>
    list.push({
      id: c.id,
      contentType: c.contentType,
      title: c.title,
      publisher: c.publisher,
      date: c.date,
      downloadCount: c.downloadCount,
      voteAverageScore: c.voteAverageScore,
      songInfo: c.songInfo,
    })
  );

  return NextResponse.json({ contents: list });
}