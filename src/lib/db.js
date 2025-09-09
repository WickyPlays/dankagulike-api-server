import mongoose from "mongoose";
import { dbConfig } from "../config/db";

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(dbConfig.url, {
    dbName: dbConfig.dbName,
  });
}
