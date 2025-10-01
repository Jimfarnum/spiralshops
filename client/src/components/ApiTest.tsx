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

      <section style={{marginBottom:30}}>
        <h2>Config</h2>
        <input 
          value={base} 
          onChange={e=>setBase(e.target.value)} 
          placeholder="e.g. http://localhost:3001" 
          style={{padding:6, width:320, marginRight:10}}
        />
        <div>Current BASE: <code>{base || "(relative)"}</code></div>
      </section>

      <section style={{marginBottom:30}}>
        <h2>Health</h2>
        <button 
          onClick={async()=>{ 
            try {
              const r=await fetch(u("/api/health")); 
              setHealth(await r.text()); 
            } catch(e) {
              setHealth(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          GET /api/health
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{health}</pre>
      </section>

      <section style={{marginBottom:30}}>
        <h2>Onboarding Questions</h2>
        <button 
          onClick={async()=>{ 
            try {
              const r=await fetch(u("/api/onboarding/questions")); 
              setQuestions(await r.text()); 
            } catch(e) {
              setQuestions(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          GET /api/onboarding/questions
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{questions}</pre>
      </section>

      <section style={{marginBottom:30}}>
        <h2>Discount Tier</h2>
        <div style={{marginBottom:10}}>
          Volume: <input 
            type="number" 
            value={volume} 
            onChange={e=>setVolume(Number(e.target.value))} 
            style={{padding:6, width:150, marginLeft:10}}
          />
        </div>
        <button 
          onClick={async()=>{ 
            try {
              const r=await fetch(u("/api/discounts/calculate-tier"), {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ volumeAnnualUSD: volume })
              }); 
              setTier(await r.text()); 
            } catch(e) {
              setTier(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          POST /api/discounts/calculate-tier
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{tier}</pre>
      </section>

      <section style={{marginBottom:30}}>
        <h2>Shipping Quote</h2>
        <div style={{marginBottom:10}}>
          ZIP: <input 
            value={zip} 
            onChange={e=>setZip(e.target.value)} 
            style={{padding:6, width:80, marginLeft:10, marginRight:15}}
          />
          Weight(oz): <input 
            type="number" 
            value={weightOz} 
            onChange={e=>setWeightOz(Number(e.target.value))} 
            style={{padding:6, width:80, marginLeft:10, marginRight:15}}
          />
          <select 
            value={speed} 
            onChange={e=>setSpeed(e.target.value as any)}
            style={{padding:6, marginRight:15}}
          >
            <option value="economy">economy</option>
            <option value="standard">standard</option>
            <option value="expedited">expedited</option>
          </select>
          <select 
            value={mode} 
            onChange={e=>setMode(e.target.value as any)}
            style={{padding:6}}
          >
            <option value="outbound">outbound</option>
            <option value="inbound">inbound</option>
          </select>
        </div>
        <button 
          onClick={async()=>{
            try {
              const r=await fetch(u("/api/shipping/quote"), {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body: JSON.stringify({ destinationZip: zip, weightOz, speed, mode })
              });
              setQuote(await r.text());
            } catch(e) {
              setQuote(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          POST /api/shipping/quote
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{quote}</pre>
      </section>

      <section style={{marginBottom:30}}>
        <h2>Agents</h2>
        <button 
          onClick={async()=>{ 
            try {
              const r=await fetch(u("/api/agents")); 
              setAgents(await r.text()); 
            } catch(e) {
              setAgents(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          GET /api/agents
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{agents}</pre>

        <div style={{marginTop:15, marginBottom:10}}>
          Agent: <input 
            value={agentName} 
            onChange={e=>setAgentName(e.target.value)} 
            style={{padding:6, width:200, marginLeft:10}}
            placeholder="e.g. shoppingLogistics"
          />
        </div>
        <button 
          onClick={async()=>{
            try {
              const r=await fetch(u(`/api/agents/${agentName}/run`), { 
                method:"POST", 
                headers:{"Content-Type":"application/json"}, 
                body: JSON.stringify({})
              });
              setRun(await r.text());
            } catch(e) {
              setRun(`Error: ${e}`);
            }
          }}
          style={{padding:8, marginRight:10}}
        >
          POST /api/agents/{agentName}/run
        </button>
        <pre style={{background:"#f5f5f5", padding:10, fontSize:12}}>{run}</pre>
      </section>
    </div>
  );
}