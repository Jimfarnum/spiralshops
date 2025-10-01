import React, { useState } from "react";

export default function ApiTest() {
  const [base, setBase] = useState<string>("");
  const [health, setHealth] = useState("");
  const [questions, setQuestions] = useState("");
  const [tier, setTier] = useState("");
  const [quote, setQuote] = useState("");
  const [agents, setAgents] = useState("");
  const [run, setRun] = useState("");

  const [volume, setVolume] = useState<number>(75000000);
  const [zip, setZip] = useState("55101");
  const [weightOz, setWeightOz] = useState<number>(16);
  const [speed, setSpeed] = useState<"economy"|"standard"|"expedited">("standard");
  const [mode, setMode] = useState<"outbound"|"inbound">("outbound");
  const [agentName, setAgentName] = useState("shoppingLogistics");

  const u = (p: string) => (base ? base : "") + p;

  return (
    <div style={{padding:20, fontFamily:"system-ui, sans-serif"}}>
      <h1>SPIRAL API Test (React)</h1>

      <section>
        <h2>Config</h2>
        <input value={base} onChange={e=>setBase(e.target.value)} placeholder="e.g. http://localhost:4000" style={{padding:6, width:320}}/>
        <div>Current BASE: <code>{base || "(relative)"}</code></div>
      </section>

      <section>
        <h2>Health</h2>
        <button onClick={async()=>{ const r=await fetch(u("/api/health")); setHealth(await r.text()); }}>GET /api/health</button>
        <pre>{health}</pre>
      </section>

      <section>
        <h2>Onboarding Questions</h2>
        <button onClick={async()=>{ const r=await fetch(u("/api/onboarding/questions")); setQuestions(await r.text()); }}>GET /api/onboarding/questions</button>
        <pre>{questions}</pre>
      </section>

      <section>
        <h2>Discount Tier</h2>
        <input type="number" value={volume} onChange={e=>setVolume(Number(e.target.value))} />
        <button onClick={async()=>{ 
          const r=await fetch(u("/api/discounts/calculate-tier"), {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ volumeAnnualUSD: volume })
          }); 
          setTier(await r.text()); 
        }}>POST /api/discounts/calculate-tier</button>
        <pre>{tier}</pre>
      </section>

      <section>
        <h2>Shipping Quote</h2>
        <div>
          ZIP <input value={zip} onChange={e=>setZip(e.target.value)} />
          Weight(oz) <input type="number" value={weightOz} onChange={e=>setWeightOz(Number(e.target.value))} />
          <select value={speed} onChange={e=>setSpeed(e.target.value as any)}>
            <option value="economy">economy</option>
            <option value="standard">standard</option>
            <option value="expedited">expedited</option>
          </select>
          <select value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="outbound">outbound</option>
            <option value="inbound">inbound</option>
          </select>
        </div>
        <button onClick={async()=>{
          const r=await fetch(u("/api/shipping/quote"), {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({ destinationZip: zip, weightOz, speed, mode })
          });
          setQuote(await r.text());
        }}>POST /api/shipping/quote</button>
        <pre>{quote}</pre>
      </section>

      <section>
        <h2>Agents</h2>
        <button onClick={async()=>{ const r=await fetch(u("/api/agents")); setAgents(await r.text()); }}>GET /api/agents</button>
        <pre>{agents}</pre>

        <input value={agentName} onChange={e=>setAgentName(e.target.value)} />
        <button onClick={async()=>{
          const r=await fetch(u(`/api/agents/${agentName}/run`), { 
            method:"POST", 
            headers:{"Content-Type":"application/json"}, 
            body: JSON.stringify({})
          });
          setRun(await r.text());
        }}>POST /api/agents/{agentName}/run</button>
        <pre>{run}</pre>
      </section>
    </div>
  );
}