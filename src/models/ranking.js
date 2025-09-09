import mongoose from "mongoose";

const rankingSchema = new mongoose.Schema({
  songTitle: { type: String, required: true },
  difficulty: { type: Number, required: true },
  chartHash: { type: String, required: true },
  accountId: { type: String, required: false },
  score: { type: Number, required: false },
  abCount: { type: Number, required: false },
  date: { type: String, required: true }
});

export const Ranking = mongoose.models.ranking || mongoose.model("ranking", rankingSchema);