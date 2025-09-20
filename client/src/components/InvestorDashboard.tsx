import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, TrendingUp, Users, Building2 } from "lucide-react";

interface ReportFile {
  name: string;
  size: number;
  created: string;
  modified: string;
}

const InvestorDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<ReportFile[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const response = await fetch("/api/investor/reports/list");
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
    }
    setLoadingReports(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/investor/mock-report");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "SPIRAL_Mock_Launch_Report.pdf";
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
    setLoading(false);
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
      <div className="flex items-center space-x-2 text-2xl font-bold text-blue-900 dark:text-white">
        <TrendingUp className="h-6 w-6" />
        <span>Investor Dashboard</span>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Pre-Launch Testing
        </Badge>
      </div>

      {/* Quick Stats Cards */}
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">18 AI agents active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mock Data Ready</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Ready</div>
            <p className="text-xs text-muted-foreground">Comprehensive metrics</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Generate Mock Launch Report</span>
          </CardTitle>
          <CardDescription>
            Generate investor-ready launch reports with SPIRAL branding and comprehensive metrics. 
            Use this preview before launch to verify branding, data presentation, and format.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📊 Mock Report Includes:
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Retailer onboarding metrics (42 retailers)</li>
                <li>• Shopping activity data (3,500 active shoppers)</li>
                <li>• Financial performance ($450K in SPIRAL sales)</li>
                <li>• Platform health indicators (99.8% uptime)</li>
                <li>• AI system status (18 active agents)</li>
                <li>• Professional SPIRAL branding and formatting</li>
              </ul>
            </div>
            
            <Button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Mock Launch Report
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
            <span>Available Reports</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReports}
              disabled={loadingReports}
            >
              {loadingReports ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                "Refresh"
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            Download previously generated investor reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet</p>
              <p className="text-sm">Click "Generate Mock Launch Report" to create your first report</p>
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

      {/* Help Section */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">
                💡 Pre-Launch Testing
              </h4>
              <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                Use this dashboard to generate and review investor reports before the official launch. 
                All data shown is mock data for preview purposes. On launch day, the system will 
                automatically capture real platform metrics for investor reporting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorDashboard;