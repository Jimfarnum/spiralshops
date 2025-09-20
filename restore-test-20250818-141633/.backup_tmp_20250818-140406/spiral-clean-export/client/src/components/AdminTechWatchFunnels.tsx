import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FunnelReport {
  competitor: string;
  domain: string;
  funnel_map: {
    stages: Array<{
      name: string;
      evidence: string[];
    }>;
  };
  copy_decoder: {
    tone: string;
    headline_hooks: string[];
    cta_patterns: string[];
    framing_devices: string[];
    why_it_converts: string;
  };
  offer_xray: {
    pricing: string;
    bonuses: string[];
    urgency_triggers: string[];
    guarantees: string[];
    payment_options: string[];
    positioning: string;
  };
  differentiation_map: {
    overlap: string[];
    unique_angles_for_spiral: string[];
    usps: string[];
  };
  recommendations: Array<{
    title: string;
    owner_role: string;
    eta_days: number;
    impact: string;
  }>;
  decision: string;
  rationale: string;
}

export default function AdminTechWatchFunnels() {
  const [items, setItems] = useState<FunnelReport[]>([]);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function load() {
    setMsg("Loading…");
    try {
      const r = await fetch("/admin/techwatch/funnels/latest");
      if (r.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const d = await r.json();
      setItems(d.items || []);
      setMsg("");
    } catch (error) {
      setMsg("Error loading data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function runNow() {
    setIsLoading(true);
    setMsg("Running capture & analysis…");
    try {
      const r = await fetch("/admin/techwatch/funnels/run-now", { method: "POST" });
      const d = await r.json();
      setMsg(d.ok ? "Done." : (d.error || "Error"));
      await load();
    } catch (error) {
      setMsg("Error running analysis");
    } finally {
      setIsLoading(false);
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
      case 'high': return 'destructive';
      case 'med': case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Competitive Funnel Intelligence</CardTitle>
            <CardDescription>
              Automated analysis of competitor shopping funnels (14-day cycle)
            </CardDescription>
          </div>
          <Button 
            onClick={runNow} 
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800"
          >
            {isLoading ? "Running..." : "Run Now"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {msg && (
          <div className="text-sm text-muted-foreground mb-4 p-2 bg-muted rounded">
            {msg}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <Card key={idx} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.competitor || item.domain}</CardTitle>
                  <Badge variant={item.decision === 'INITIATE' ? 'destructive' : 'secondary'}>
                    {item.decision}
                  </Badge>
                </div>
                <CardDescription>{item.domain}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* USPs */}
                {item.differentiation_map?.usps?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Key USPs</h4>
                    <div className="text-sm text-muted-foreground">
                      {item.differentiation_map.usps.join(" • ")}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {item.recommendations?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {item.recommendations.slice(0, 3).map((r, i) => (
                        <li key={i} className="text-sm flex items-center justify-between">
                          <span className="flex-1">{r.title}</span>
                          <div className="flex items-center gap-1 ml-2">
                            <Badge variant={getImpactColor(r.impact)} className="text-xs">
                              {r.impact}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {r.eta_days}d
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Funnel Stages */}
                {item.funnel_map?.stages?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Funnel Stages</h4>
                    <div className="flex flex-wrap gap-1">
                      {item.funnel_map.stages.map((stage, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {stage.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rationale */}
                {item.rationale && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Rationale</h4>
                    <p className="text-xs text-muted-foreground">{item.rationale}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {items.length === 0 && !msg && (
          <div className="text-center py-8 text-muted-foreground">
            No funnel analysis data available. Click "Run Now" to generate reports.
          </div>
        )}
      </CardContent>
    </Card>
  );
}