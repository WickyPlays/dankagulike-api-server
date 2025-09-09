import { connectDB } from "@/lib/db";
import { Accounts } from "@/models/accounts";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  try {
    // メールアドレスも受け取るが、現状は使用しない
    const { email, accountId, password } = body;

    // アカウントIDの重複チェック
    const existingAccount = await Accounts.findOne({ accountId });
    if (existingAccount) {
      return NextResponse.json({
        success: false,
        message: 'Account ID already exists.'
      }, { status: 400 });
    }

    // パスワードをハッシュ化
    const saltRounds = 10; // コスト（強度）
    // 内部的にランダムなソルトを自動生成
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // アカウント作成
    const newAccount = new Accounts({ 
      accountId: accountId, 
      password: hashedPassword, 
      name: accountId, 
      icon: 0
    });
    await newAccount.save();

    return NextResponse.json({
      success: true,
      message: 'Account successfully created.',
      account: {
        accountId: newAccount.accountId,
        name: newAccount.name,
        icon: newAccount.icon
        // passwordは返さない
      }
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  await connectDB();
  const body = await request.json();
  try {
    const { accountId, token, name, icon, password } = body;

    // 必須チェック
    if (!accountId || !token) {
      return NextResponse.json({
        success: false,
        message: 'accountId and token are required.'
      }, { status: 400 });
    }

    // 更新データを明示的に定義（セキュリティ対策）
    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (icon !== undefined) updatedData.icon = icon;

    // パスワード更新がある場合はハッシュ化
    if (password !== undefined) {
      const saltRounds = 10;
      // 内部的にランダムなソルトを自動生成
      updatedData.password = await bcrypt.hash(password, saltRounds);
    }

    const result = await Accounts.updateOne(
      { accountId, token },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        success: false,
        message: 'Account not found or invalid token.'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Account updated successfully.'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}