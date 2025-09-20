import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Users2, ShieldCheck, Sparkles, ChevronDown, ExternalLink } from "lucide-react";

// --- Data Model -------------------------------------------------------------
export type Agent = {
  humanName: string;
  codeName: string;
  title: string;
  persona: string; // short bio line
  duties: string[];
  group: "Leadership" | "Task" | "Simulation" | "Security";
  avatar?: string; // URL or data URI
};

// Load agents from centralized staff.json
const useAgentsData = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  
  useEffect(() => {
    fetch('/staff.json')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || []);
      })
      .catch(err => {
        console.error('Failed to load staff data:', err);
        // Fallback to default data if needed
        setAgents([]);
      });
  }, []);
  
  return agents;
};

// Fallback hardcoded data (kept for backward compatibility)
const FALLBACK_AGENTS: Agent[] = [
  // Leadership
  {
    humanName: "Clara",
    codeName: "Command",
    title: "Chief Orchestrator",
    persona: "Coordinates missions end‑to‑end with calm precision.",
    duties: [
      "Owns mission plan and sign‑off",
      "Routes tasks to agents and resolves conflicts",
      "Sets SLAs and ensures objectives are met",
    ],
    group: "Leadership",
    avatar: "/avatars/clara.svg",
  },
  {
    humanName: "Elias",
    codeName: "Conductor",
    title: "Agent Orchestrator",
    persona: "Runs playbooks and sequences multi‑agent workflows.",
    duties: [
      "Sequences workflows",
      "Handles agent handoffs",
      "Manages dependencies",
    ],
    group: "Leadership",
    avatar: "/avatars/elias.svg",
  },

  // Task
  {
    humanName: "Michael",
    codeName: "Harbor",
    title: "Mall Import Agent",
    persona: "Ingests tenant directories with meticulous accuracy.",
    duties: ["Scrape tenants", "Normalize fields", "Upload to SPIRAL Core"],
    group: "Task",
    avatar: "/avatars/harbor.svg",
  },
  {
    humanName: "Amelia",
    codeName: "Librarian",
    title: "Classification Agent",
    persona: "Keeps the taxonomy clean and useful.",
    duties: ["Classify stores", "Deduplicate", "Assign tags"],
    group: "Task",
    avatar: "/avatars/librarian.svg",
  },
  {
    humanName: "David",
    codeName: "Sentry",
    title: "Product Validation",
    persona: "Guards against bad data entering the system.",
    duties: ["Validate products", "Check pricing", "Flag duplicates"],
    group: "Task",
    avatar: "/avatars/sentry.svg",
  },

  // Simulation
  {
    humanName: "Olivia",
    codeName: "Pathfinder",
    title: "Shopper Simulation",
    persona: "Walks every path your customers take.",
    duties: ["Run shopper flows", "Validate UX", "Surface friction"],
    group: "Simulation",
    avatar: "/avatars/pathfinder.svg",
  },
  {
    humanName: "Marcus",
    codeName: "Anvil",
    title: "Load Simulation",
    persona: "Black‑Friday‑proofs your stack.",
    duties: ["Stress tests", "Latency/error budgets", "Cache/index tips"],
    group: "Simulation",
    avatar: "/avatars/anvil.svg",
  },
  {
    humanName: "Samantha",
    codeName: "Integrator",
    title: "System Integration",
    persona: "Ensures all parts work together seamlessly.",
    duties: ["API testing", "Integration flows", "Error handling"],
    group: "Simulation",
    avatar: "/avatars/integrationsim.svg",
  },

  // Security & Intelligence
  {
    humanName: "Isabella",
    codeName: "Aegis",
    title: "Security Agent",
    persona: "Quiet guardian of APIs and data.",
    duties: ["Detect abuse", "WAF/rate limits", "Isolation & blocks"],
    group: "Security",
    avatar: "/avatars/aegis.svg",
  },
  {
    humanName: "Noah",
    codeName: "Sherlock",
    title: "Fraud Detection",
    persona: "Sees patterns others miss.",
    duties: ["Transaction anomalies", "Hold/review flow", "Coord with Aegis"],
    group: "Security",
    avatar: "/avatars/sherlock.svg",
  },
  {
    humanName: "Daniel",
    codeName: "Maestro",
    title: "Intelligence Analyst",
    persona: "Turns data into actionable insights.",
    duties: ["Competitive analysis", "Market intelligence", "Trend detection"],
    group: "Security",
    avatar: "/avatars/maestro.svg",
  },
];

// --- UI Helpers -------------------------------------------------------------
const groups = [
  { key: "Leadership", icon: Users2 },
  { key: "Task", icon: Sparkles },
  { key: "Simulation", icon: Search },
  { key: "Security", icon: ShieldCheck },
] as const;

type GroupKey = typeof groups[number]["key"];

function classNames(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

// --- Card Component ---------------------------------------------------------
function AgentCard({ agent, onSelect }: { agent: Agent; onSelect: (a: Agent) => void }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer"
      onClick={() => onSelect(agent)}
    >
      <div className="flex items-center gap-3">
        {agent.avatar ? (
          <img 
            src={agent.avatar}
            alt={agent.humanName}
            className="h-12 w-12 shrink-0 rounded-2xl"
          />
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-700">
              {agent.humanName.charAt(0)}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-slate-900">{agent.humanName}</div>
          <div className="text-xs font-mono text-slate-500">{agent.codeName}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-sm font-medium text-slate-800">{agent.title}</div>
        <div className="mt-1 text-xs text-slate-600 line-clamp-2">{agent.persona}</div>
      </div>
    </motion.div>
  );
}

// --- Detail Drawer ----------------------------------------------------------
function AgentDetail({ agent, onClose }: { agent: Agent | null; onClose: () => void }) {
  if (!agent) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="absolute bottom-0 left-0 right-0 mx-auto max-w-3xl rounded-t-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {agent.avatar ? (
              <img 
                src={agent.avatar}
                alt={agent.humanName}
                className="h-16 w-16 rounded-3xl"
              />
            ) : (
              <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-700">
                  {agent.humanName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="text-xl font-bold text-slate-900">{agent.humanName}</div>
              <div className="text-sm font-mono text-slate-500">{agent.codeName}</div>
              <div className="text-sm font-medium text-slate-600">{agent.title}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <div className="mt-6">
          <div className="text-slate-700">{agent.persona}</div>
        </div>

        <div className="mt-6">
          <div className="text-sm font-semibold text-slate-900 mb-2">Core Duties</div>
          <ul className="space-y-1">
            {agent.duties.map((duty, i) => (
              <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                {duty}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <a
            href="#clara-connect"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            Connect via Clara <ExternalLink size={16} />
          </a>
          <span className="text-xs text-slate-500">Clara routes your request to the right agent.</span>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Page --------------------------------------------------------------
export default function StaffRoster() {
  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState<GroupKey | "All">("All");
  const [selected, setSelected] = useState<Agent | null>(null);
  
  const agentsData = useAgentsData();
  const AGENTS = agentsData.length > 0 ? agentsData : FALLBACK_AGENTS;

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return AGENTS.filter((a) => {
      const inGroup = activeGroup === "All" || a.group === activeGroup;
      if (!inGroup) return false;
      if (!t) return true;
      return (
        a.humanName.toLowerCase().includes(t) ||
        a.codeName.toLowerCase().includes(t) ||
        a.title.toLowerCase().includes(t) ||
        a.persona.toLowerCase().includes(t) ||
        a.duties.some((d) => d.toLowerCase().includes(t))
      );
    });
  }, [q, activeGroup]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header / Philosophy */}
      <header className="mx-auto max-w-6xl px-4 pt-12 pb-6">
        <motion.h1 layout className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          AI Staff
        </motion.h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          <span className="font-semibold">For You!</span> — built for brick‑and‑mortar{" "}
          <span className="font-medium">retailers</span>,{" "}
          <span className="font-medium">malls</span>, and{" "}
          <span className="font-medium">shoppers</span>. Our AI agents handle
          everything from product imports to fraud detection with PhD-level
          intelligence and Navy SEAL efficiency.
        </p>
      </header>

      {/* Controls */}
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="col-span-2">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <Search size={18} className="text-slate-400" />
              <input
                placeholder="Search name, code‑name, or duty"
                className="w-full bg-transparent px-1 py-2 outline-none text-slate-800"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-2 pr-10 text-slate-800 shadow-sm"
                value={activeGroup}
                onChange={(e) => setActiveGroup(e.target.value as GroupKey | "All")}
              >
                <option value="All">All Groups</option>
                {groups.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.key}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Roster Grid */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {groups
          .filter((g) => activeGroup === "All" || g.key === activeGroup)
          .map((g) => {
            const members = filtered.filter((a) => a.group === g.key);
            if (!members.length && activeGroup !== "All") return null;
            return (
              <section key={g.key} className="mt-6">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-xl bg-slate-900 text-white p-2">
                    {React.createElement(g.icon, { size: 16 })}
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900">{g.key}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((agent) => (
                    <AgentCard
                      key={agent.humanName + agent.codeName}
                      agent={agent}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </section>
            );
          })}
      </main>

      {/* Detail Drawer */}
      <AgentDetail agent={selected} onClose={() => setSelected(null)} />

      {/* Footer CTA */}
      <footer className="border-t border-slate-200 bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-slate-900 font-semibold">Need something specific?</div>
            <div className="text-sm text-slate-600">
              Clara will route your request to the right specialist.
            </div>
          </div>
          <a
            id="clara-connect"
            href="#"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-white shadow hover:bg-slate-800"
          >
            Connect via Clara <ExternalLink size={16} />
          </a>
        </div>
      </footer>
    </div>
  );
}