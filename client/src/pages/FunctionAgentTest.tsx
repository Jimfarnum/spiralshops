import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Rocket, Play } from 'lucide-react';

export default function FunctionAgentTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const runTest = async () => {
    setIsRunning(true);
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
          title: "Function Agent Test Complete",
          description: `${data.summary?.successfulSteps || 'Multiple'} functions tested successfully`,
        });
      } else {
        throw new Error('Test failed');
      }
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Unable to run Function Agent test",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-teal-600" />
              Function Agent Test Page
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={runTest}
                disabled={isRunning}
                size="lg"
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isRunning ? (
                  "Running Test..."
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Function Agent Test
                  </>
                )}
              </Button>
            </div>

            {results && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Test Results:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {results.summary?.totalSteps || 'N/A'}
                    </div>
                    <div className="text-sm text-blue-600">Total Functions</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.summary?.successfulSteps || 'N/A'}
                    </div>
                    <div className="text-sm text-green-600">Successful</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {results.summary?.successRate || 'N/A'}
                    </div>
                    <div className="text-sm text-orange-600">Success Rate</div>
                  </div>
                </div>

                {results.investorReport && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Platform Highlights:</h4>
                    <div className="space-y-1">
                      {results.investorReport.keyHighlights?.map((highlight: string, index: number) => (
                        <div key={index} className="text-sm">• {highlight}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="text-center text-sm text-gray-600">
              This page tests the Function Agent system that demonstrates all platform capabilities.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}