import mongoose from "mongoose";

const contentsSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  contentType: { type: Number, required: true },
  title: { type: String },
  publisher: { type: String },
  description: { type: String },
  downloadUrl: { type: String },
  imageUrl: { type: String },
  date: { type: String, required: true },
  downloadCount: { type: Number },
  voteAverageScore: { type: Number },
  songInfo: {
    difficulties: { type: [Number] },
    hasLua: { type: Boolean },
  },
});

export const Contents = mongoose.models.contents || mongoose.model("contents", contentsSchema);