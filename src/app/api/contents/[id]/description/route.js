import { NextResponse } from "next/server";
import { query } from "@/lib/database";
import { convertLinkToDownloadable } from "@/lib/converter";

export async function GET(request, { params }) {
  const id = params.id;
  const result = await query(
    `SELECT description, download_url, image_url FROM contents WHERE id = $1`,
    [id]
  );
  let content = result.rows[0];
  if (content) {
    content = {
      description: content.description,
      downloadUrl: convertLinkToDownloadable(content.download_url),
      imageUrl: content.image_url,
    };
  }
  return NextResponse.json(content);
}