import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { query } from "@/lib/database";

export async function POST(request) {
  try {
    const { accountId, password } = await request.json();

    const result = await query(
      `SELECT * FROM accounts WHERE account_id = $1`,
      [accountId]
    );
    const account = result.rows[0];

    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 401 }
      );
    }

    if (account.password !== password) {
      return NextResponse.json(
        { success: false, message: "Wrong password." },
        { status: 401 }
      );
    }

    console.log(`ENV token: ${process.env.JWT_TOKEN}`);

    const token = jwt.sign({ aid: account.account_id }, process.env.JWT_TOKEN, {
      expiresIn: "30d",
    });

    await query(`UPDATE accounts SET token = $1 WHERE account_id = $2`, [
      token,
      accountId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Authentication successful.",
      account: {
        accountId: account.account_id,
        token,
        password: account.password,
        name: account.name,
        icon: account.icon,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}