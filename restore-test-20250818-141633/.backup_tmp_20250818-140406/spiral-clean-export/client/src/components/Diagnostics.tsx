import { useEffect, useState } from "react";

const endpoints = [
  { name: "Stores API", url: "/api/stores" },
  { name: "Products API", url: "/api/products" },
  { name: "Health Check", url: "/api/check" },
];

export default function Diagnostics() {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const checkAPIs = async () => {
      const newResults: string[] = [];

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint.url);
          if (res.ok) {
            newResults.push(`✅ ${endpoint.name} OK`);
          } else {
            newResults.push(`❌ ${endpoint.name} returned status ${res.status}`);
          }
        } catch (err) {
          newResults.push(`❌ ${endpoint.name} failed: ${String(err)}`);
        }
      }

      setResults(newResults);
      console.log("🔍 SPIRAL Diagnostic Results:");
      newResults.forEach(r => console.log(r));
    };

    window.onerror = function (message, source, lineno, colno, error) {
      console.error("🚨 JS Runtime Error:", message, "at", source, lineno, colno);
      const errorMsg = `🚨 JS Runtime Error: ${message}`;
      setResults(prev => [...prev, errorMsg]);
    };

    checkAPIs();
  }, []);

  return (
    <div style={{ position: "fixed", bottom: 0, right: 0, background: "#222", color: "#fff", padding: "10px", fontSize: "12px", zIndex: 9999 }}>
      <strong>SPIRAL Diagnostics</strong>
      <ul style={{ margin: 0, padding: 0 }}>
        {results.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>
    </div>
  );
}