import { connectDB } from "@/lib/db";
import { Ranking } from "@/models/ranking";
import { Accounts } from "@/models/accounts";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const chartHash = searchParams.get('chartHash');
  const difficulty = searchParams.get('difficulty');

  // パラメータチェック
  if (!chartHash || !difficulty) {
    return NextResponse.json({
      error: "chartHash and difficulty are required"
    }, { status: 400 });
  }

  const query = {
    chartHash: String(chartHash).trim(),
    difficulty: Number(difficulty),
  };

  try {
    const ranking = await Ranking.aggregate([
      // 対象の譜面のスコアを絞り込み
      { $match: query },

      // スコア降順 → abCount降順
      { $sort: { score: -1, abCount: -1 } },

      // アカウント情報を結合
      {
        $lookup: {
          from: "accounts",         // コレクション名（モデル名の複数形）
          localField: "accountId",  // ranking のフィールド
          foreignField: "accountId",// accounts のフィールド
          as: "account"
        }
      },

      // account は配列で入るので展開
      { $unwind: { path: "$account", preserveNullAndEmptyArrays: true } },

      // banned が true のものを除外（カラムが無い or false は許可）
      {
        $match: {
          $or: [
            { "account.banned": { $exists: false } },
            { "account.banned": false }
          ]
        }
      },

      // 必要なフィールドだけ返す
      {
        $project: {
          _id: 0,
          score: 1,
          abCount: 1,
          date: 1,
          "account.name": 1,
          "account.icon": 1
        }
      },

      // 上位200件に制限
      { $limit: 200 }
    ]);

    return NextResponse.json({ ranking: ranking });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  try {
    const { songTitle, difficulty, chartHash, accountId, accountToken, score, maxScore } = body;

    // 必須チェック
    if (!songTitle || !chartHash || !accountId || !accountToken || score == null || maxScore == null) {
      return NextResponse.json({ error: "songTitle, chartHash, accountId, accountToken, score, and maxScore are required" }, { status: 400 });
    }

    // トークンの検証とアカウントのバンチェック
    const account = await Accounts.findOne({ accountId });
    if (!account || account.token !== accountToken) {
      return NextResponse.json({ error: "Your account login token is invalid" }, { status: 403 });
    }

    if (account.banned) {
      return NextResponse.json({ error: "You cannot perform this action because your account is banned." }, { status: 403 });
    }

    // 今日の日付を "YYYY-MM-DD" 形式で取得
    const today = new Date().toISOString().split("T")[0];

    // 既存データを検索
    const existing = await Ranking.findOne({ songTitle, difficulty, chartHash, accountId });

    if (existing) {
      
      let updated = false;

      // スコアが更新された場合のみ更新
      if (score > (existing.score ?? 0)) {
        existing.score = score;
        existing.date = today;  // 更新した日付を記録
        updated = true;
      }

      // 満点を取った場合はABカウンター加算
      if (score === maxScore) {
        existing.abCount = (existing.abCount ?? 0) + 1;
        existing.date = today;  // プレイ日を更新
        updated = true;
      }

      // 更新があった場合のみ保存
      if (updated) {
        await existing.save();
        return NextResponse.json({ message: "Ranking updated successfully." });
      } else {
        return NextResponse.json({ message: "No ranking update needed." });
      }
    }

    // データが存在しない場合 → 新規登録
    const rankingData = new Ranking({
      songTitle,
      difficulty,
      chartHash,
      accountId,
      score,
      abCount: score === maxScore ? 1 : 0, // 満点なら初期値1
      date: today
    });
    await rankingData.save();

    return NextResponse.json({ message: "Ranking created successfully." }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}