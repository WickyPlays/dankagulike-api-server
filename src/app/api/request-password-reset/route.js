import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  try {
    const { email } = body;

    // 受け取った場合のサンプルコード
    // メール送信のサンプルコードはコメントアウトしています
    /*
    // アカウントをメールアドレスで検索
    const account = await Accounts.findOne({ email });
    if (!account) {
      return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 });
    }
    // パスワードリセット用のトークンを生成（有効期限1時間）
    const resetToken = jwt.sign({ aid: account.accountId }, secret,
    {
      expiresIn: '1h'
    });
    
    // メール送信（nodemailerなどを使用）
    // 例: await sendPasswordResetEmail(email, resetToken);
    */

    // 実際にはメールを送信するが、ここでは常に成功レスポンスを返す
    return NextResponse.json({
      success: true,
      message: 'If the email is registered, a password reset link has been sent.'
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}