import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PlatformDemo() {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runDemo = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/function-agent/demo/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'investor' })
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        toast({
          title: "Platform Demo Complete!",
          description: `${data.summary?.successfulSteps || 0}/${data.summary?.totalSteps || 0} functions tested successfully`,
        });
      } else {
        throw new Error('Demo failed');
      }
    } catch (error) {
      toast({
        title: "Demo Failed",
        description: "Could not run platform demonstration",
        variant: "destructive"
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🚀 SPIRAL Platform Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Test all platform functions in one click
          </p>
          
          <button
            onClick={runDemo}
            disabled={running}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-4 px-8 rounded-lg text-lg shadow-lg transform transition-transform hover:scale-105 disabled:scale-100"
          >
            {running ? "🔄 Running Demo..." : "▶️ Run Complete Platform Demo"}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">📊 Demo Results</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {results.summary?.totalSteps || 0}
                </div>
                <div className="text-sm text-blue-600">Total Functions</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-green-600">
                  {results.summary?.successfulSteps || 0}
                </div>
                <div className="text-sm text-green-600">Successful</div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-red-600">
                  {results.summary?.failedSteps || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {results.summary?.successRate || '0%'}
                </div>
                <div className="text-sm text-purple-600">Success Rate</div>
              </div>
            </div>

            {/* Function List */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">✅ Platform Functions Tested:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>• Platform Health Check</div>
                <div>• User Authentication</div>
                <div>• Product Catalog System</div>
                <div>• Store Directory</div>
                <div>• AI Smart Recommendations</div>
                <div>• SPIRAL Loyalty Points</div>
                <div>• Shopping Cart Management</div>
                <div>• Wishlist System</div>
                <div>• Order Processing</div>
                <div>• Shipping Calculator</div>
                <div>• Discount Engine</div>
                <div>• AI Agents Registry (18 total)</div>
                <div>• Retailer Onboarding</div>
                <div>• Partnership Network</div>
                <div>• Mall Events System</div>
                <div>• Active Promotions</div>
                <div>• AI Agent Execution</div>
                <div>• Platform Diagnostics</div>
              </div>
            </div>

            {/* Platform Highlights */}
            {results.investorReport?.keyHighlights && (
              <div className="mt-6 p-4 bg-teal-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-teal-800">🎯 Platform Highlights:</h3>
                <div className="space-y-1">
                  {results.investorReport.keyHighlights.map((highlight: string, index: number) => (
                    <div key={index} className="text-sm text-teal-700">• {highlight}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Panel */}
        {!results && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">About This Demo</h2>
            <p className="text-gray-600 mb-4">
              This demonstration tests all core SPIRAL platform functions including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-4">
              <li>Complete e-commerce functionality</li>
              <li>AI-powered recommendations and agents</li>
              <li>Loyalty and rewards system</li>
              <li>Payment and shipping processing</li>
              <li>Store and retailer management</li>
              <li>Real-time platform diagnostics</li>
            </ul>
            <p className="text-sm text-gray-500">
              The demo typically takes 8-10 seconds and tests 18 different platform functions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}