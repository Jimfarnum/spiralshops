import mongoose, { Schema, InferSchemaType } from "mongoose";

const LegalConsentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
  role: { type: String, enum: ["shopper", "retailer", "mall", "admin"], required: true },
  consentedAt: { type: Date, default: () => new Date(), index: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  termsVersion: { type: String, required: true },
  privacyVersion: { type: String, required: true },
  refundsVersion: { type: String, required: true },
  guaranteeVersion: { type: String, required: true },
  acceptedFrom: { type: String, enum: ["web", "ios", "android"], default: "web" }
}, { timestamps: true });

export type TLegalConsent = InferSchemaType<typeof LegalConsentSchema>;
export default mongoose.models.LegalConsent || mongoose.model("LegalConsent", LegalConsentSchema);