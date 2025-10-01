import { Router } from "express";
import { computeTER, persistScore, getScores } from "../metrics/scorer.js";
import { getEvents } from "../metrics/telemetry.js";

const router = Router();

// POST /metrics/score  (ingest a single score)
router.post("/score", async (req, res) => {
  try {
    const out = computeTER(req.body);
    await persistScore(out);
    res.json(out);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "scoring error" });
  }
});

// GET /metrics/task/:taskId  (view task events + latest score)
router.get("/task/:taskId", async (req, res) => {
  const taskId = req.params.taskId;
  const events = await getEvents(taskId);
  res.json({ taskId, events });
});

// GET /metrics/leaderboard  (top agents by rolling TER)
router.get("/leaderboard", async (_req, res) => {
  try {
    const scores = await getScores();
    
    const byAgent: Record<string, { sum: number; n: number; scores: number[] }> = {};
    for (const s of scores) {
      if (!byAgent[s.agent]) byAgent[s.agent] = { sum: 0, n: 0, scores: [] };
      byAgent[s.agent].sum += s.TER;
      byAgent[s.agent].n += 1;
      byAgent[s.agent].scores.push(s.TER);
    }
    
    const leaderboard = Object.entries(byAgent)
      .map(([agent, { sum, n, scores }]) => ({ 
        agent, 
        TER: Math.round(sum / Math.max(1, n)),
        totalTasks: n,
        lastScore: scores[scores.length - 1] || 0
      }))
      .sort((a, b) => b.TER - a.TER)
      .slice(0, 20);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// GET /metrics/dashboard  (summary stats)
router.get("/dashboard", async (_req, res) => {
  try {
    const scores = await getScores();
    
    if (scores.length === 0) {
      return res.json({
        totalTasks: 0,
        averageTER: 0,
        topAgent: null,
        healthStatus: "No data"
      });
    }
    
    const totalTasks = scores.length;
    const averageTER = Math.round(scores.reduce((sum, s) => sum + s.TER, 0) / totalTasks);
    const topAgent = scores.reduce((best, current) => 
      current.TER > best.TER ? current : best
    );
    const healthStatus = averageTER >= 85 ? "Excellent" : averageTER >= 70 ? "Good" : "Needs Attention";
    
    res.json({
      totalTasks,
      averageTER,
      topAgent: topAgent.agent,
      topAgentTER: topAgent.TER,
      healthStatus
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
});

export default router;