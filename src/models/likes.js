import mongoose from "mongoose";

const likesSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  voteId: { type: Number, required: true },
});

export const Likes = mongoose.models.likes || mongoose.model("likes", likesSchema);