import mongoose, { Schema, InferSchemaType } from "mongoose";
const ReferralCodeSchema = new Schema({
  code: { type: String, unique:true, index:true },
  ownerUserId: { type: Schema.Types.ObjectId, ref:"User", index:true },
  role: { type: String, enum:["shopper","retailer","mall"], required:true },
  rewardSpirals: { type: Number, default: 50 },
  redeemedByUserId: { type: Schema.Types.ObjectId, ref:"User" },
  redeemedAt: { type: Date },
  status: { type: String, enum:["active","redeemed","disabled"], default:"active" }
}, { timestamps:true });
export type TReferral = InferSchemaType<typeof ReferralCodeSchema>;
export default mongoose.models.ReferralCode || mongoose.model("ReferralCode", ReferralCodeSchema);