#!/usr/bin/env node

/**
 * SPIRAL TechWatch KPI Job
 * Enhanced KPI calculator with business impact analysis
 */

import fs from "fs";
import path from "path";

class TechWatchKPI {
  constructor() {
    this.reportsDir = path.join(process.cwd(), 'agents', 'techwatch', 'reports');
    this.outputDir = path.join(process.cwd(), 'agents', 'techwatch', 'kpi');
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async calculateKPIs() {
    console.log('🔍 SPIRAL TechWatch KPI Calculator Starting...');
    
    try {
      const latestReport = this.getLatestReport();
      if (!latestReport) {
        console.log('❌ No reports found');
        return;
      }

      const kpis = await this.processReport(latestReport);
      const timestamp = new Date().toISOString();
      
      const kpiReport = {
        generated: timestamp,
        reportDate: latestReport.generated,
        platform: "SPIRAL Local Commerce Platform",
        ...kpis
      };

      const kpiFile = path.join(this.outputDir, `kpi-${new Date().toISOString().split('T')[0]}.json`);
      fs.writeFileSync(kpiFile, JSON.stringify(kpiReport, null, 2));
      
      console.log('📊 KPI Analysis Complete:');
      console.log(`   Total Items: ${kpiReport.totalItems}`);
      console.log(`   Ready to Implement: ${kpiReport.initiateCount}`);
      console.log(`   Projected Revenue Impact: $${kpiReport.projectedRevenueImpact.toLocaleString()}`);
      console.log(`   Implementation Effort: ${kpiReport.totalEffortWeeks} weeks`);
      console.log(`   Risk Score: ${kpiReport.riskScore}/10`);
      console.log(`   ROI Score: ${kpiReport.roiScore}/10`);
      
      return kpiReport;
      
    } catch (error) {
      console.error('❌ KPI calculation failed:', error);
      throw error;
    }
  }

  getLatestReport() {
    if (!fs.existsSync(this.reportsDir)) return null;
    
    const reportDirs = fs.readdirSync(this.reportsDir)
      .filter(d => d.match(/^\d{4}-\d{2}-\d{2}$/))
      .sort()
      .reverse();
    
    for (const dir of reportDirs) {
      const reportFile = path.join(this.reportsDir, dir, 'report.json');
      if (fs.existsSync(reportFile)) {
        return JSON.parse(fs.readFileSync(reportFile, 'utf8'));
      }
    }
    
    return null;
  }

  async processReport(report) {
    const items = report.items || [];
    const initiatedItems = items.filter(item => item.decision === 'INITIATE');
    
    const kpis = {
      totalItems: items.length,
      initiateCount: initiatedItems.length,
      watchCount: items.filter(item => item.decision === 'WATCH').length,
      discardCount: items.filter(item => item.decision === 'DISCARD').length,
      
      projectedRevenueImpact: this.calculateRevenueImpact(initiatedItems),
      totalEffortWeeks: this.calculateEffortWeeks(initiatedItems),
      riskScore: this.calculateRiskScore(initiatedItems),
      roiScore: this.calculateROI(initiatedItems),
      strategicAlignment: this.calculateStrategicAlignment(initiatedItems),
      topPriorities: this.getTopPriorities(initiatedItems),
      roadmap: this.generateRoadmap(initiatedItems)
    };

    return kpis;
  }

  calculateRevenueImpact(items) {
    const revenueMultipliers = {
      'payments': 150000,
      'retail-tech': 100000,
      'ai-platforms': 120000,
      'investor/venture': 80000,
      'comp-moves': 60000,
      'policy': 40000
    };

    return items.reduce((total, item) => {
      const baseImpact = revenueMultipliers[item.topic] || 50000;
      const relevanceMultiplier = (item.scores?.relevance_0_5 || 3) / 5;
      const impactMultiplier = (item.scores?.impact_12mo_0_5 || 3) / 5;
      
      return total + (baseImpact * relevanceMultiplier * impactMultiplier);
    }, 0);
  }

  calculateEffortWeeks(items) {
    const effortWeeks = {
      'low': 2,
      'med': 6,
      'high': 12
    };

    return items.reduce((total, item) => {
      const effort = item.scores?.effort_low_med_high || 'med';
      return total + (effortWeeks[effort] || effortWeeks.med);
    }, 0);
  }

  calculateRiskScore(items) {
    if (items.length === 0) return 0;
    
    const riskScores = items.map(item => {
      const legalRisk = item.scores?.legal_risk_low_med_high || 'low';
      const riskValues = { 'low': 2, 'med': 5, 'high': 8 };
      const effort = item.scores?.effort_low_med_high || 'med';
      const effortRisk = { 'low': 1, 'med': 3, 'high': 6 };
      
      return riskValues[legalRisk] + effortRisk[effort];
    });

    return Math.round(riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length);
  }

  calculateROI(items) {
    if (items.length === 0) return 0;
    
    const roiScores = items.map(item => {
      const impact = (item.scores?.impact_now_0_5 || 2) + (item.scores?.impact_12mo_0_5 || 3);
      const relevance = item.scores?.relevance_0_5 || 3;
      const effort = item.scores?.effort_low_med_high || 'med';
      const effortPenalty = { 'low': 0, 'med': 1, 'high': 3 };
      
      return Math.max(1, (impact + relevance) - effortPenalty[effort]);
    });

    return Math.round(roiScores.reduce((sum, score) => sum + score, 0) / roiScores.length);
  }

  calculateStrategicAlignment(items) {
    const strategicTopics = ['payments', 'retail-tech', 'ai-platforms'];
    const alignedItems = items.filter(item => strategicTopics.includes(item.topic));
    
    return {
      alignmentScore: items.length > 0 ? Math.round((alignedItems.length / items.length) * 10) : 0,
      alignedCount: alignedItems.length,
      totalCount: items.length
    };
  }

  getTopPriorities(items) {
    return items
      .map(item => ({
        ...item,
        priorityScore: this.calculatePriorityScore(item)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 3);
  }

  calculatePriorityScore(item) {
    const relevance = item.scores?.relevance_0_5 || 3;
    const impactNow = item.scores?.impact_now_0_5 || 2;
    const impact12mo = item.scores?.impact_12mo_0_5 || 3;
    const effort = item.scores?.effort_low_med_high || 'med';
    const effortPenalty = { 'low': 0, 'med': 1, 'high': 3 };
    
    return relevance + impactNow + impact12mo - effortPenalty[effort];
  }

  generateRoadmap(items) {
    const quarters = ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];
    const roadmap = {};
    
    const prioritizedItems = items
      .map(item => ({
        ...item,
        priorityScore: this.calculatePriorityScore(item)
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore);

    let currentQuarter = 0;
    let quarterCapacity = 12;
    
    prioritizedItems.forEach(item => {
      const effortWeeks = {
        'low': 2,
        'med': 6, 
        'high': 12
      };
      
      const itemEffort = effortWeeks[item.scores?.effort_low_med_high || 'med'];
      
      if (quarterCapacity < itemEffort && currentQuarter < 3) {
        currentQuarter++;
        quarterCapacity = 12;
      }
      
      const quarter = quarters[Math.min(currentQuarter, 3)];
      if (!roadmap[quarter]) roadmap[quarter] = [];
      
      roadmap[quarter].push({
        title: item.title,
        effort: item.scores?.effort_low_med_high || 'med',
        priority: item.priorityScore
      });
      
      quarterCapacity -= itemEffort;
    });

    return roadmap;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const calculator = new TechWatchKPI();
  calculator.calculateKPIs()
    .then(() => {
      console.log('✅ TechWatch KPI calculation complete');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ KPI calculation failed:', error);
      process.exit(1);
    });
}

export default TechWatchKPI;