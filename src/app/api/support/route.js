import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  return NextResponse.json({
    contents: true,
    accounts: true,
    ranking: true,
    options: {
      requireAccountEmail: false, // アカウント登録にメールアドレスを必須にするか
    }
  });
}