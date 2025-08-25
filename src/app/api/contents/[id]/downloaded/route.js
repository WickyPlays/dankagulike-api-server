import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function PUT(request, { params }) {
  const id = params.id;
  try {
    await query(`UPDATE contents SET download_count = download_count + 1 WHERE id = $1`, [id]);
    return NextResponse.json({ message: "Operation was successful." });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}