import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, TrendingUp, Users, Building2 } from "lucide-react";

interface ReportFile {
  name: string;
  size: number;
  created: string;
  modified: string;
}

export default function AdminReportsMenu() {
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/list");
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/reports/launch-report");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SPIRAL_Launch_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        
        // Refresh reports list
        setTimeout(() => {
          loadReports();
        }, 2000);
      }
    } catch (err) {
      console.error("Error generating report:", err);
    }
    setGenerating(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Reports</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Launch Ready
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Available for download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">Ready for launch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Live</div>
            <p className="text-xs text-muted-foreground">Real-time metrics</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Generate Launch Report</span>
          </CardTitle>
          <CardDescription>
            Generate comprehensive SPIRAL platform launch reports with branded formatting, 
            financial metrics, retailer performance, and shopper engagement analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Launch Report Includes:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Executive Summary with platform overview</li>
                <li>• Retailer Performance Metrics (42 retailers, 65% verified)</li>
                <li>• Shopper Engagement Analytics (3,500 active, 22% conversion)</li>
                <li>• Platform Health & Technology Status (99.8% uptime)</li>
                <li>• Financial Performance Overview ($450K in SPIRAL sales)</li>
                <li>• Professional SPIRAL branding with gradient headers</li>
              </ul>
            </div>
            
            <Button
              onClick={handleGenerateReport}
              disabled={generating}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              size="lg"
            >
              {generating ? (
                <>
                  <Calendar className="mr-2 h-4 w-4 animate-spin" />
                  Generating Launch Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Launch Report PDF
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Report Archive</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReports}
              disabled={loading}
            >
              {loading ? (
                <Calendar className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Download previously generated launch reports and analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet</p>
              <p className="text-sm">Click "Generate Launch Report PDF" to create your first report</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <div className="flex-1">
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(report.size)} • Created {formatDate(report.created)}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `/exports/${report.name}`;
                      link.download = report.name;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}