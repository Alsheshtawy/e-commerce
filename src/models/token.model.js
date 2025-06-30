import { Schema, model, Types } from "mongoose";

const tokenSchema = new Schema(
  {
    token: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User", required: true },
    isValid: { type: Boolean, default: true },
    agent: { type: String }, // ممكن تخزن User-Agent أو IP
    expiredAt: { type: Date }, // تاريخ الانتهاء
  },
  { timestamps: true }
);

export const Token = model("Token", tokenSchema);
