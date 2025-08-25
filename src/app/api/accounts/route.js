import { NextResponse } from "next/server";
import { query } from "@/lib/database";

export async function POST(request) {
  try {
    const { accountId, password, name, icon } = await request.json();

    const existingAccount = await query(
      `SELECT * FROM accounts WHERE account_id = $1`,
      [accountId]
    );

    if (existingAccount.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: "Account ID already exists." },
        { status: 400 }
      );
    }

    await query(
      `INSERT INTO accounts (account_id, password, name, icon) VALUES ($1, $2, $3, $4)`,
      [accountId, password, name, icon || 0]
    );

    return NextResponse.json(
      { success: true, message: "Account successfully created." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { accountId, token, name, icon, password } = await request.json();

    if (!accountId || !token) {
      return NextResponse.json(
        { success: false, message: "accountId and token are required." },
        { status: 400 }
      );
    }

    const account = await query(
      `SELECT * FROM accounts WHERE account_id = $1 AND token = $2`,
      [accountId, token]
    );

    if (account.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Account not found or invalid token." },
        { status: 404 }
      );
    }

    const updateFields = [];
    const updateValues = [];

    if (name !== undefined) {
      updateFields.push(`name = $${updateValues.length + 1}`);
      updateValues.push(name);
    }

    if (icon !== undefined) {
      updateFields.push(`icon = $${updateValues.length + 1}`);
      updateValues.push(icon);
    }

    if (password !== undefined) {
      updateFields.push(`password = $${updateValues.length + 1}`);
      updateValues.push(password);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: "No fields to update." },
        { status: 400 }
      );
    }

    updateValues.push(accountId, token);

    await query(
      `UPDATE accounts SET ${updateFields.join(", ")} WHERE account_id = $${
        updateValues.length - 1
      } AND token = $${updateValues.length}`,
      updateValues
    );

    return NextResponse.json({
      success: true,
      message: "Account updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}