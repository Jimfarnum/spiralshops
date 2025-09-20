import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Rocket, Play, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';

export default function FunctionAgentWidget() {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  // Get current status
  const { data: status } = useQuery({
    queryKey: ['/api/function-agent/status'],
    queryFn: async () => {
      const response = await fetch('/api/function-agent/status');
      if (!response.ok) return null;
      const data = await response.json();
      return data.data;
    },
    refetchInterval: isRunning ? 2000 : false
  });

  // Quick auto demo
  const quickDemo = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/function-agent/demo/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'investor' })
      });
      if (!response.ok) throw new Error('Demo failed');
      return response.json();
    },
    onMutate: () => setIsRunning(true),
    onSettled: () => setIsRunning(false),
    onSuccess: (data) => {
      toast({
        title: "Demo Complete!",
        description: `${data.summary.successfulSteps}/${data.summary.totalSteps} functions passed`,
      });
    },
    onError: () => {
      toast({
        title: "Demo Failed",
        description: "Unable to complete platform demonstration",
        variant: "destructive"
      });
    }
  });

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Rocket className="h-5 w-5 text-teal-600" />
          Function Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={status.isActive ? "default" : "secondary"}>
                {status.isActive ? "Running" : "Ready"}
              </Badge>
            </div>
            
            {status.isActive && (
              <>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress:</span>
                    <span>{status.progress}%</span>
                  </div>
                  <Progress value={status.progress} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  Step {status.currentStep} of {status.totalSteps}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={() => quickDemo.mutate()}
            disabled={isRunning || quickDemo.isPending}
            className="flex-1 bg-teal-600 hover:bg-teal-700"
            size="sm"
          >
            {isRunning ? (
              <>
                <TrendingUp className="h-4 w-4 mr-2 animate-pulse" />
                Running...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Quick Demo
              </>
            )}
          </Button>
          
          <Link href="/function-agent">
            <Button variant="outline" size="sm">
              <Play className="h-4 w-4 mr-2" />
              Full Dashboard
            </Button>
          </Link>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Tests 18 platform functions for investor demonstrations
        </div>
      </CardContent>
    </Card>
  );
}