import mongoose, { Schema, InferSchemaType } from "mongoose";
const LoyaltyEventSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:"User", index:true },
  retailerId: { type: Schema.Types.ObjectId, ref:"Retailer", index:true },
  type: { type: String, enum:["earn","redeem","invite","pickup","seasonal"], required:true },
  spirals: { type: Number, required:true },
  orderId: { type: String },
  meta: { type: Object }
}, { timestamps:true });
export type TLoyaltyEvent = InferSchemaType<typeof LoyaltyEventSchema>;
export default mongoose.models.LoyaltyEvent || mongoose.model("LoyaltyEvent", LoyaltyEventSchema);