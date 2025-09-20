import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import R&D Agent dynamically to avoid TypeScript declaration issues
const importRDAgent = async () => {
  const module = await import('../agents/techwatch/agent.js');
  return module.default;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * SPIRAL AI R&D Agent Routes
 * Provides API endpoints for the research and development analysis system
 */

// Run R&D analysis
router.post('/run', async (req, res) => {
  try {
    console.log('🚀 Starting SPIRAL R&D Agent via API...');
    
    const SpiralRDAgent = await importRDAgent();
    const agent = new SpiralRDAgent();
    const results = await agent.run();
    
    res.json({
      success: true,
      message: 'SPIRAL R&D analysis completed',
      results: {
        summary: results.summary,
        ticketCount: results.ticketCount,
        reportDir: results.reportDir,
        digest: results.digest
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('R&D Agent API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to run R&D analysis',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get latest report
router.get('/report/latest', (req, res) => {
  try {
    const reportsDir = path.join(process.cwd(), 'agents', 'techwatch', 'reports');
    
    if (!fs.existsSync(reportsDir)) {
      return res.status(404).json({
        success: false,
        error: 'No reports found',
        message: 'Run R&D analysis first'
      });
    }
    
    const reportDirs = fs.readdirSync(reportsDir)
      .filter(dir => fs.statSync(path.join(reportsDir, dir)).isDirectory())
      .sort()
      .reverse();
    
    if (reportDirs.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No reports found',
        message: 'Run R&D analysis first'
      });
    }
    
    const latestDir = path.join(reportsDir, reportDirs[0]);
    const reportPath = path.join(latestDir, 'report.json');
    
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({
        success: false,
        error: 'Report file not found'
      });
    }
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    res.json({
      success: true,
      report,
      reportDate: reportDirs[0]
    });
  } catch (error: any) {
    console.error('Failed to get latest report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve report',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get report by date
router.get('/report/:date', (req, res) => {
  try {
    const { date } = req.params;
    const reportPath = path.join(process.cwd(), 'agents', 'techwatch', 'reports', date, 'report.json');
    
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({
        success: false,
        error: 'Report not found',
        message: `No report found for date: ${date}`
      });
    }
    
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    res.json({
      success: true,
      report,
      reportDate: date
    });
  } catch (error: any) {
    console.error('Failed to get report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve report',
      message: error?.message || 'Unknown error'
    });
  }
});

// List all reports
router.get('/reports', (req, res) => {
  try {
    const reportsDir = path.join(process.cwd(), 'agents', 'techwatch', 'reports');
    
    if (!fs.existsSync(reportsDir)) {
      return res.json({
        success: true,
        reports: [],
        message: 'No reports directory found'
      });
    }
    
    const reportDirs = fs.readdirSync(reportsDir)
      .filter(dir => fs.statSync(path.join(reportsDir, dir)).isDirectory())
      .map(dir => {
        const reportPath = path.join(reportsDir, dir, 'report.json');
        let summary = null;
        
        if (fs.existsSync(reportPath)) {
          try {
            const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
            summary = {
              total_items: report.total_items,
              decisions: report.decisions,
              generated: report.generated
            };
          } catch (error) {
            console.error(`Failed to read report ${dir}:`, error);
          }
        }
        
        return {
          date: dir,
          summary
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
    
    res.json({
      success: true,
      reports: reportDirs
    });
  } catch (error: any) {
    console.error('Failed to list reports:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to list reports',
      message: error?.message || 'Unknown error'
    });
  }
});

// Get tickets for implementation
router.get('/tickets', (req, res) => {
  try {
    const ticketsDir = path.join(process.cwd(), 'agents', 'techwatch', 'tickets');
    
    if (!fs.existsSync(ticketsDir)) {
      return res.json({
        success: true,
        tickets: [],
        message: 'No tickets directory found'
      });
    }
    
    const ticketFiles = fs.readdirSync(ticketsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(ticketsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const stats = fs.statSync(filePath);
        
        // Extract title from first line
        const titleMatch = content.match(/^# (.+)$/m);
        const title = titleMatch ? titleMatch[1] : file.replace('.md', '');
        
        return {
          filename: file,
          title,
          created: stats.birthtime,
          modified: stats.mtime,
          content
        };
      })
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
    
    res.json({
      success: true,
      tickets: ticketFiles
    });
  } catch (error: any) {
    console.error('Failed to get tickets:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tickets',
      message: error?.message || 'Unknown error'
    });
  }
});

// Agent status
router.get('/status', (req, res) => {
  try {
    const reportsDir = path.join(process.cwd(), 'agents', 'techwatch', 'reports');
    const ticketsDir = path.join(process.cwd(), 'agents', 'techwatch', 'tickets');
    
    const reportCount = fs.existsSync(reportsDir) 
      ? fs.readdirSync(reportsDir).filter(dir => 
          fs.statSync(path.join(reportsDir, dir)).isDirectory()
        ).length 
      : 0;
    
    const ticketCount = fs.existsSync(ticketsDir)
      ? fs.readdirSync(ticketsDir).filter(file => file.endsWith('.md')).length
      : 0;
    
    res.json({
      success: true,
      status: {
        agent: 'SPIRAL AI R&D Agent',
        version: '1.0.0',
        active: true,
        reports_generated: reportCount,
        tickets_created: ticketCount,
        last_check: new Date().toISOString(),
        capabilities: [
          'Tech trend analysis',
          'Implementation decision making',
          'Ticket generation',
          'ROI-focused recommendations',
          'Risk assessment'
        ]
      }
    });
  } catch (error: any) {
    console.error('Failed to get agent status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get status',
      message: error?.message || 'Unknown error'
    });
  }
});

export default router;