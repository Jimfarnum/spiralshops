import React, { useState, useEffect } from "react";

export default function EntitiesTab() {
  const [entities, setEntities] = useState([]);
  const [category, setCategory] = useState("");
  const [zip, setZip] = useState("");

  async function fetchEntities() {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (zip) params.append("zip", zip);
    const res = await fetch(`/api/entities?${params.toString()}`, {
      headers: { "X-Staff-Token": "spiral-staff" },
    });
    const data = await res.json();
    setEntities(data.entities || []);
  }

  useEffect(() => { fetchEntities(); }, []);

  return (
    <div>
      <h2>Stores & Malls</h2>
      <div style={{ marginBottom: "1em" }}>
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input placeholder="Zip Code" value={zip} onChange={e => setZip(e.target.value)} />
        <button onClick={fetchEntities}>Filter</button>
      </div>
      <ul>
        {entities.map(e => (
          <li key={e.id}>
            <strong>{e.name}</strong> ({e.type}) — {e.category || ""}, {e.location}, Rewards: {e.rewards || "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}