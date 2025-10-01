import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

// 🔒 Priority 3: Enhanced Monitoring, Alerting, and Audit Logging

interface AIAuditLog {
  timestamp: string;
  operation: string;
  endpoint: string;
  ip: string;
  userAgent: string;
  requestId: string;
  inputSize: number;
  cost: number;
  duration: number;
  status: 'success' | 'error' | 'blocked';
  error?: string;
  securityFlags: string[];
}

interface SecurityAlert {
  timestamp: string;
  type: 'rate_limit' | 'auth_failure' | 'suspicious_input' | 'cost_limit' | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip: string;
  endpoint: string;
  details: string;
  actionTaken: string;
}

class AIAuditSystem {
  public auditLogPath: string;
  public alertLogPath: string;
  private dailyStats: Map<string, number> = new Map();
  
  constructor() {
    const logDir = path.join(process.cwd(), 'logs/ai-security');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    this.auditLogPath = path.join(logDir, `ai-audit-${new Date().toISOString().split('T')[0]}.log`);
    this.alertLogPath = path.join(logDir, `security-alerts-${new Date().toISOString().split('T')[0]}.log`);
  }
  
  logAIOperation(log: AIAuditLog) {
    const logEntry = JSON.stringify(log) + '\n';
    fs.appendFileSync(this.auditLogPath, logEntry);
    
    // Update daily stats
    const dateKey = log.timestamp.split('T')[0];
    this.dailyStats.set(`${dateKey}-operations`, (this.dailyStats.get(`${dateKey}-operations`) || 0) + 1);
    this.dailyStats.set(`${dateKey}-cost`, (this.dailyStats.get(`${dateKey}-cost`) || 0) + log.cost);
    
    // Console logging with structured format
    console.log(`🔍 AI AUDIT [${log.status.toUpperCase()}] ${log.operation}: ${log.endpoint} | IP: ${log.ip} | Duration: ${log.duration}ms | Cost: $${log.cost.toFixed(4)}`);
    
    // Check for anomalies
    this.checkForAnomalies(log);
  }
  
  logSecurityAlert(alert: SecurityAlert) {
    const alertEntry = JSON.stringify(alert) + '\n';
    fs.appendFileSync(this.alertLogPath, alertEntry);
    
    // Console alert with severity colors
    const severityColor = alert.severity === 'critical' ? '\x1b[91m' : 
                         alert.severity === 'high' ? '\x1b[93m' : 
                         alert.severity === 'medium' ? '\x1b[94m' : '\x1b[92m';
    
    console.log(`${severityColor}🚨 SECURITY ALERT [${alert.severity.toUpperCase()}] ${alert.type}: ${alert.details} | IP: ${alert.ip} | Action: ${alert.actionTaken}\x1b[0m`);
    
    // Send to monitoring system (placeholder for real implementation)
    if (alert.severity === 'critical' || alert.severity === 'high') {
      this.sendToMonitoring(alert);
    }
  }
  
  private checkForAnomalies(log: AIAuditLog) {
    // Check for suspicious patterns
    if (log.cost > 5.0) {
      this.logSecurityAlert({
        timestamp: log.timestamp,
        type: 'cost_limit',
        severity: 'high',
        ip: log.ip,
        endpoint: log.endpoint,
        details: `High-cost AI operation: $${log.cost.toFixed(4)}`,
        actionTaken: 'Logged and monitored'
      });
    }
    
    if (log.duration > 30000) { // 30 seconds
      this.logSecurityAlert({
        timestamp: log.timestamp,
        type: 'system_error',
        severity: 'medium',
        ip: log.ip,
        endpoint: log.endpoint,
        details: `Long-running AI operation: ${log.duration}ms`,
        actionTaken: 'Performance investigation needed'
      });
    }
    
    if (log.securityFlags.length > 0) {
      this.logSecurityAlert({
        timestamp: log.timestamp,
        type: 'suspicious_input',
        severity: 'medium',
        ip: log.ip,
        endpoint: log.endpoint,
        details: `Security flags: ${log.securityFlags.join(', ')}`,
        actionTaken: 'Input sanitized and logged'
      });
    }
  }
  
  private sendToMonitoring(alert: SecurityAlert) {
    // Placeholder for integration with monitoring services
    // Could send to Slack, PagerDuty, email, etc.
    console.log(`📡 Alert sent to monitoring system: ${alert.type} - ${alert.severity}`);
  }
  
  getDailyStats() {
    return Object.fromEntries(this.dailyStats);
  }
  
  // Generate security report
  generateDailyReport(): string {
    const today = new Date().toISOString().split('T')[0];
    const operations = this.dailyStats.get(`${today}-operations`) || 0;
    const totalCost = this.dailyStats.get(`${today}-cost`) || 0;
    
    return `
🔒 AI Security Daily Report - ${today}
====================================
Total Operations: ${operations}
Total Cost: $${totalCost.toFixed(4)}
Average Cost per Operation: $${operations > 0 ? (totalCost / operations).toFixed(4) : '0.0000'}

Audit Log: ${this.auditLogPath}
Alert Log: ${this.alertLogPath}
    `.trim();
  }
}

// Global audit system instance
const auditSystem = new AIAuditSystem();

// Middleware for AI operation logging
export function aiAuditLogger(operation: string, estimatedCost: number = 0.01) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    // Detect security flags
    const securityFlags: string[] = [];
    const userAgent = req.get('user-agent') || '';
    
    if (userAgent.includes('bot') || userAgent.includes('crawler')) {
      securityFlags.push('bot-detected');
    }
    
    if (req.body && JSON.stringify(req.body).length > 10000) {
      securityFlags.push('large-payload');
    }
    
    // Store request info for later logging
    req.auditInfo = {
      startTime,
      requestId,
      operation,
      estimatedCost,
      securityFlags
    };
    
    console.log(`🎯 Starting AI operation: ${operation} [${requestId}] from IP: ${req.ip}`);
    
    // Log completion when response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const status = res.statusCode >= 400 ? 'error' : 'success';
      const actualCost = req.aiOperationCost || estimatedCost;
      
      const auditLog: AIAuditLog = {
        timestamp: new Date().toISOString(),
        operation,
        endpoint: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent') || 'unknown',
        requestId,
        inputSize: req.body ? JSON.stringify(req.body).length : 0,
        cost: actualCost,
        duration,
        status,
        error: res.statusCode >= 400 ? `HTTP ${res.statusCode}` : undefined,
        securityFlags
      };
      
      auditSystem.logAIOperation(auditLog);
    });
    
    next();
  };
}

// Security alert middleware
export function securityAlertMiddleware(req: Request, res: Response, next: NextFunction) {
  // Override res.status to capture security-related status codes
  const originalStatus = res.status;
  res.status = function(code: number) {
    if (code === 401) {
      auditSystem.logSecurityAlert({
        timestamp: new Date().toISOString(),
        type: 'auth_failure',
        severity: 'medium',
        ip: req.ip,
        endpoint: req.path,
        details: 'Authentication failed for AI endpoint',
        actionTaken: 'Request blocked'
      });
    } else if (code === 429) {
      auditSystem.logSecurityAlert({
        timestamp: new Date().toISOString(),
        type: 'rate_limit',
        severity: 'high',
        ip: req.ip,
        endpoint: req.path,
        details: 'Rate limit exceeded',
        actionTaken: 'Request blocked'
      });
    }
    
    return originalStatus.call(this, code);
  };
  
  next();
}

// Daily report generation (can be called via cron job)
export function generateSecurityReport(): string {
  return auditSystem.generateDailyReport();
}

// Health check endpoint data
export function getAuditSystemHealth() {
  return {
    status: 'operational',
    dailyStats: auditSystem.getDailyStats(),
    logFiles: {
      audit: auditSystem.auditLogPath,
      alerts: auditSystem.alertLogPath
    },
    timestamp: new Date().toISOString()
  };
}

// Export audit system for manual logging
export { auditSystem };

// TypeScript augmentation
declare global {
  namespace Express {
    interface Request {
      auditInfo?: {
        startTime: number;
        requestId: string;
        operation: string;
        estimatedCost: number;
        securityFlags: string[];
      };
      aiOperationCost?: number;
    }
  }
}