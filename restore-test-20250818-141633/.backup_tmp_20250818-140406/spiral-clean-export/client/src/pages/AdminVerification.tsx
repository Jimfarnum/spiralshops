import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Play,
  RefreshCw,
  Shield,
  Key,
  TestTube,
  Zap,
  AlertCircle
} from 'lucide-react';

interface VerificationService {
  name: string;
  category: string;
  apiKey: boolean;
  sandboxTested: boolean;
  liveTested: boolean;
  latency: number | null;
  status: string;
  lastCheck: string | null;
  errors: string[];
}

interface AuditStep {
  step: string;
  status: string;
  message: string;
}

interface AuditResult {
  service: string;
  name: string;
  category: string;
  steps: AuditStep[];
}

interface VerificationStatus {
  phase: string;
  complete: boolean;
  services: Record<string, VerificationService>;
  summary: {
    total: number;
    withApiKeys: number;
    sandboxTested: number;
    liveTested: number;
    passed: number;
    failed: number;
  };
}

export default function AdminVerification() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const response = await fetch('/api/vendor-verification/status');
      const data = await response.json();
      setVerificationStatus(data);
    } catch (error) {
      console.error('Failed to fetch verification status:', error);
    } finally {
      setLoading(false);
    }
  };

  const runVerificationAudit = async () => {
    setIsRunningAudit(true);
    try {
      const response = await fetch('/api/vendor-verification/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setAuditResults(data.auditResults || []);
      await fetchVerificationStatus(); // Refresh status
    } catch (error) {
      console.error('Failed to run verification audit:', error);
    } finally {
      setIsRunningAudit(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed':
        return <Badge className="bg-green-500">Passed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case 'testing':
        return <Badge className="bg-blue-500">Testing</Badge>;
      case 'pending':
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-3 w-3 text-yellow-500" />;
      case 'skipped':
        return <Clock className="h-3 w-3 text-gray-400" />;
      default:
        return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p>Loading verification status...</p>
          </div>
        </div>
      </div>
    );
  }

  const completionPercentage = verificationStatus ? 
    Math.round((verificationStatus.summary.passed / verificationStatus.summary.total) * 100) : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-blue-500" />
          Vendor Verification Audit
        </h1>
        <p className="text-gray-600">
          External Service Production Readiness Assessment
        </p>
      </div>

      {/* Verification Phase Status */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TestTube className="h-5 w-5" />
            Verification Phase: {verificationStatus?.phase}
          </CardTitle>
          <CardDescription className="text-blue-700">
            Current Status: {verificationStatus?.complete ? 'Complete ✅' : 'In Progress 🔄'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
            
            {verificationStatus && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{verificationStatus.summary.total}</div>
                  <div className="text-xs text-gray-600">Total Services</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{verificationStatus.summary.withApiKeys}</div>
                  <div className="text-xs text-gray-600">With API Keys</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{verificationStatus.summary.sandboxTested}</div>
                  <div className="text-xs text-gray-600">Sandbox Tested</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{verificationStatus.summary.passed}</div>
                  <div className="text-xs text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{verificationStatus.summary.failed}</div>
                  <div className="text-xs text-gray-600">Failed</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Verification Controls
          </CardTitle>
          <CardDescription>
            Run comprehensive vendor verification audit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              onClick={runVerificationAudit} 
              disabled={isRunningAudit}
              className="flex items-center gap-2"
            >
              {isRunningAudit ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunningAudit ? 'Running Audit...' : 'Run Verification Audit'}
            </Button>
            <Button variant="outline" onClick={fetchVerificationStatus}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Overview */}
      {verificationStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Service Verification Status
            </CardTitle>
            <CardDescription>
              Individual service verification results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(verificationStatus.services).map(([serviceId, service]) => (
                <div key={serviceId} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(service.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{service.name}</h3>
                        {getStatusBadge(service.status)}
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{service.category} service</p>
                      {service.latency && (
                        <p className="text-xs text-gray-500">Latency: {service.latency}ms</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.apiKey ? (
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        <Key className="h-3 w-3 mr-1" />
                        API Key Present
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        API Key Missing
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Results */}
      {auditResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Latest Audit Results
            </CardTitle>
            <CardDescription>
              Detailed verification test results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {auditResults.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-medium">{result.name}</h3>
                    <Badge variant="outline">{result.category}</Badge>
                  </div>
                  <div className="space-y-2">
                    {result.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3 text-sm">
                        {getStepIcon(step.status)}
                        <span className="font-medium">{step.step}:</span>
                        <span className={`${
                          step.status === 'passed' ? 'text-green-600' :
                          step.status === 'failed' ? 'text-red-600' :
                          step.status === 'warning' ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {step.message}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Status */}
      {verificationStatus?.complete && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Vendor Verification Complete!</strong> All external services have been verified and are ready for production deployment.
          </AlertDescription>
        </Alert>
      )}

      {/* Failure Alerts */}
      {verificationStatus && verificationStatus.summary.failed > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Verification Issues Detected:</strong> {verificationStatus.summary.failed} service(s) failed verification. Please check API keys and service configurations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}