import mongoose from "mongoose";

const accountsSchema = new mongoose.Schema({
  accountId: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  name: { type: String, required: false },
  icon: { type: Number, required: false },
  banned: { type: Boolean, required: false, default: false },
});

export const Accounts = mongoose.models.accounts || mongoose.model("accounts", accountsSchema);
