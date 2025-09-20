import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bot, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Eye } from 'lucide-react';
import AdminLayout from './AdminLayout';

interface AgentLog {
  id: string;
  agentName: 'RetailerOnboardAgent' | 'ProductEntryAgent' | 'ShopperAssistAgent' | 'AdminAuditAgent';
  retailerId: string;
  retailerName: string;
  status: 'active' | 'complete' | 'error' | 'abandoned';
  sessionDuration: number;
  timestamp: string;
  lastActivity: string;
  stepCompleted: string;
  totalSteps: number;
  currentStep: number;
  notes?: string;
  errorMessage?: string;
  metadata?: {
    productsAdded?: number;
    planSelected?: string;
    stripeConnected?: boolean;
    [key: string]: any;
  };
}

export default function AgentDashboard() {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [agentFilter, setAgentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AgentLog | null>(null);

  useEffect(() => {
    fetchAgentLogs();
    
    const interval = setInterval(fetchAgentLogs, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAgentLogs = async () => {
    try {
      const response = await fetch('/api/admin/agent-logs');
      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch agent logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: AgentLog['status']) => {
    const variants = {
      active: 'bg-blue-100 text-blue-800',
      complete: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      abandoned: 'bg-gray-100 text-gray-800'
    };

    const icons = {
      active: Clock,
      complete: CheckCircle,
      error: XCircle,
      abandoned: AlertTriangle
    };

    const Icon = icons[status];

    return (
      <Badge className={variants[status]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getAgentBadge = (agentName: AgentLog['agentName']) => {
    const colors = {
      RetailerOnboardAgent: 'bg-purple-100 text-purple-800',
      ProductEntryAgent: 'bg-teal-100 text-teal-800',
      ShopperAssistAgent: 'bg-orange-100 text-orange-800',
      AdminAuditAgent: 'bg-red-100 text-red-800'
    };

    return (
      <Badge className={colors[agentName]}>
        <Bot className="w-3 h-3 mr-1" />
        {agentName.replace('Agent', '')}
      </Badge>
    );
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.retailerId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAgent = agentFilter === 'all' || log.agentName === agentFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesAgent && matchesStatus;
  });

  const stats = {
    total: logs.length,
    active: logs.filter(l => l.status === 'active').length,
    complete: logs.filter(l => l.status === 'complete').length,
    errors: logs.filter(l => l.status === 'error').length,
    avgDuration: logs.length > 0 ? Math.round(logs.reduce((acc, log) => acc + log.sessionDuration, 0) / logs.length) : 0
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-teal-600">Agent Activity Monitor</h1>
            <p className="text-gray-600 mt-2">Monitor all SPIRAL AI agent interactions and performance</p>
          </div>
          <Button onClick={fetchAgentLogs} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Bot className="w-8 h-8 text-teal-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold">{stats.avgDuration}m</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                placeholder="Search by retailer, agent, or session ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select value={agentFilter} onValueChange={setAgentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  <SelectItem value="RetailerOnboardAgent">Retailer Onboard</SelectItem>
                  <SelectItem value="ProductEntryAgent">Product Entry</SelectItem>
                  <SelectItem value="ShopperAssistAgent">Shopper Assist</SelectItem>
                  <SelectItem value="AdminAuditAgent">Admin Audit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Agent Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Sessions ({filteredLogs.length})</CardTitle>
            <CardDescription>
              Real-time monitoring of all AI agent interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Agent</th>
                    <th className="text-left p-3">Retailer</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Progress</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Last Activity</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {getAgentBadge(log.agentName)}
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{log.retailerName}</div>
                          <div className="text-sm text-gray-500">{log.retailerId}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(log.status)}
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            Step {log.currentStep} of {log.totalSteps}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-teal-500 h-2 rounded-full"
                              style={{ width: `${(log.currentStep / log.totalSteps) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500">{log.stepCompleted}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {log.sessionDuration}m
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm text-gray-600">
                          {new Date(log.lastActivity).toLocaleString()}
                        </div>
                      </td>
                      <td className="p-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedLog(log)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Session Details - {log.agentName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Session Information</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><strong>Agent:</strong> {log.agentName}</p>
                                    <p><strong>Retailer:</strong> {log.retailerName}</p>
                                    <p><strong>Session ID:</strong> {log.id}</p>
                                    <p><strong>Started:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                                    <p><strong>Duration:</strong> {log.sessionDuration} minutes</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Progress & Status</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span>Status:</span>
                                      {getStatusBadge(log.status)}
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Progress:</span>
                                      <span>{log.currentStep}/{log.totalSteps} steps</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Last Step:</span>
                                      <span className="text-sm">{log.stepCompleted}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {log.metadata && (
                                <div>
                                  <h4 className="font-semibold mb-2">Session Metadata</h4>
                                  <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                                    {Object.entries(log.metadata).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                        <span>{String(value)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {log.errorMessage && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-red-600">Error Details</h4>
                                  <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-800">
                                    {log.errorMessage}
                                  </div>
                                </div>
                              )}

                              {log.notes && (
                                <div>
                                  <h4 className="font-semibold mb-2">Notes</h4>
                                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                                    {log.notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}