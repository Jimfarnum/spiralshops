import React from "react";
import { AgentMetricsDemo } from "./AgentMetricsDemo";

export function MetricsIntegrationDemo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-spiral-teal mb-4">
          AI Team Performance Metrics
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Demonstrating the "PhD-level cognition + Navy SEAL efficiency" scoring system 
          that proves our AI agents think like PhDs, operate like SEALs, and work as a team.
        </p>
      </div>
      
      <AgentMetricsDemo />
    </div>
  );
}