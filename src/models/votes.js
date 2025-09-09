import mongoose from "mongoose";

const votesSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  contentId: { type: Number, required: true },
  userId: { type: String, required: true },
  name: { type: String },
  score: { type: Number },
  comment: { type: String },
  like: { type: Number },
  date: { type: String, required: true },
});

export const Votes = mongoose.models.votes || mongoose.model("votes", votesSchema);