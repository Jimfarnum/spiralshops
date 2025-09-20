import React, { useState } from "react";
import EntitiesTab from "./EntitiesTab";
import RewardsTab from "./RewardsTab";
import MallEventsTab from "./MallEventsTab";

export default function Dashboard() {
  const [tab, setTab] = useState("entities");

  const tabStyle = {
    padding: "12px 24px",
    margin: "0 8px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: "600"
  };

  const activeTabStyle = {
    ...tabStyle,
    backgroundColor: "#3b82f6",
    color: "white",
    borderColor: "#3b82f6"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ 
        fontSize: "2.5em", 
        color: "#1e40af", 
        marginBottom: "30px", 
        textAlign: "center",
        fontWeight: "bold"
      }}>
        🌀 SPIRAL Phase 2 Dashboard
      </h1>
      
      <nav style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        <button 
          onClick={() => setTab("entities")} 
          style={tab === "entities" ? activeTabStyle : tabStyle}
          data-testid="tab-entities"
        >
          🏪 Stores & Malls
        </button>
        <button 
          onClick={() => setTab("rewards")} 
          style={tab === "rewards" ? activeTabStyle : tabStyle}
          data-testid="tab-rewards"
        >
          🎁 My SPIRALS
        </button>
        <button 
          onClick={() => setTab("events")} 
          style={tab === "events" ? activeTabStyle : tabStyle}
          data-testid="tab-events"
        >
          🎉 Mall Events
        </button>
      </nav>

      <div style={{ 
        backgroundColor: "white", 
        padding: "30px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minHeight: "400px"
      }}>
        {tab === "entities" && <EntitiesTab />}
        {tab === "rewards" && <RewardsTab shopperId="demo-user-001" />}
        {tab === "events" && <MallEventsTab />}
      </div>
    </div>
  );
}