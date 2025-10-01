import { complianceCheck } from "./moderation.js";
import { classifyWithWatson } from "./watsonx.js";
import { verifyPresence } from "./verify.js";

export async function processRetailerSubmission(payload) {
  const { retailer={}, input={} } = payload;
  const { description="" } = input;

  // 1) Compliance
  const compliance = complianceCheck(description);
  if (!compliance.ok) {
    return { status: "rejected", reason: compliance.reason, ai: { decision: "rejected_auto" } };
  }

  // 2) Classification (watsonx)
  const clf = await classifyWithWatson({ description, photoHints: input.photoUrls || [] });

  // 3) Verification (presence)
  const ver = await verifyPresence({ name: retailer.name, address: retailer.address });

  // 4) Decision thresholds
  let status = "pending";
  let decision = "needs_review";
  if (clf.confidence > 0.9 && ver.onlinePresenceFound) {
    status = "approved";
    decision = "approved_auto";
  } else if (clf.confidence < 0.6) {
    status = "rejected";
    return { status, reason: "Category unclear—please clarify.", ai: { ...clf, verification: ver, decision: "rejected_auto" } };
  }

  return {
    status,
    category: clf.suggestedCategory,
    ai: { ...clf, verification: ver, decision }
  };
}