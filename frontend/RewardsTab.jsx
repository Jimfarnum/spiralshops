import React, { useState, useEffect } from "react";

export default function RewardsTab({ shopperId = "demo-user-001" }) {
  const [rewards, setRewards] = useState(null);

  async function fetchRewards() {
    const res = await fetch(`/api/rewards/${shopperId}`, {
      headers: { "X-Staff-Token": "spiral-staff" },
    });
    const data = await res.json();
    setRewards(data.rewards || null);
  }

  useEffect(() => { fetchRewards(); }, []);

  if (!rewards) return <p>Loading rewards...</p>;

  return (
    <div>
      <h2>My SPIRALS Dashboard</h2>
      <p><strong>Balance:</strong> {rewards.balance} SPIRALS</p>
      <p><strong>Lifetime Earned:</strong> {rewards.lifetimeEarned} SPIRALS</p>
      <p><strong>Lifetime Redeemed:</strong> {rewards.lifetimeRedeemed} SPIRALS</p>

      <h3>Recent Activity</h3>
      <ul>
        {rewards.recent.map((txn, idx) => (
          <li key={idx}>
            {txn.txnType === "earn" ? "Earned" : "Redeemed"} 
            {" "}{txn.earned || txn.redeemed} SPIRALS 
            at {txn.store} — {new Date(txn.ts).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}