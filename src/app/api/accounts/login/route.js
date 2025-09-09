import { connectDB } from "@/lib/db";
import { Accounts } from "@/models/accounts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  try {
    const { accountId, password } = body;

    // アカウントを検索
    const account = await Accounts.findOne({ accountId });
    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 401 });
    }

    // バンフラグが存在しない場合は false に初期化
    if (typeof account.banned === "undefined") {
      account.banned = false;
      await account.save();
    }

    // バンされている場合
    if (account.banned === true) {
      return NextResponse.json({ success: false, message: 'This account has been banned.' }, { status: 403 });
    }

    if (typeof account.password !== "string") {
      return NextResponse.json({ success: false, message: 'Account password is invalid.' }, { status: 500 });
    }

    let isMatch = false;

    try {
      // bcrypt比較（ハッシュ済みならここで通る）
      isMatch = await bcrypt.compare(password, account.password);
    } catch (e) {
      isMatch = false;
    }

    // bcryptで一致しなかった場合 → 平文として比較してみる
    if (!isMatch && account.password === password) {
      // 平文で保存されていたので、ハッシュ化して更新
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      account.password = hashedPassword;
      await account.save();
      isMatch = true;
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Wrong password.' }, { status: 401 });
    }

    // JWTトークン生成
    const token = jwt.sign({ aid: account.accountId }, secret, {
      expiresIn: '24h'
    });

    // トークンを保存して更新
    account.token = token;
    await account.save();

    // 成功レスポンス（パスワードは返さない）
    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      account: {
        accountId: account.accountId,
        name: account.name,
        icon: account.icon,
        token: account.token
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}