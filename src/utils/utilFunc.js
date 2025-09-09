import { Counter } from "@/models/counter";
import { Votes } from "@/models/votes";
import { Contents } from "@/models/contents";

export async function getNextSequence(name) {
  const result = await Counter.findOneAndUpdate(
    { name }, // 条件: カウンター名
    { $inc: { seq: 1 } }, // 更新: seqをインクリメント
    {
      new: true, // 更新後のドキュメントを返す
      upsert: true, // 存在しない場合は新規作成
    }
  );

  return result.seq;
}

export const updateVoteAverageScore = async (contentId) => {
  const contentVotes = await Votes.find({ contentId: contentId });

  if (contentVotes.length == 0) {
    return;
  }

  let total = 0;
  contentVotes.forEach((v) => (total += Number(v.score)));
  const averageScore = total / contentVotes.length;
  await Contents.updateOne(
    { id: contentId },
    { $set: { voteAverageScore: averageScore } }
  );
};
