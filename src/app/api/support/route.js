import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    contents: true,
    accounts: true,
    ranking: true,
  });
}
