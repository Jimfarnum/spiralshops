import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SimpleFunction() {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const runDemo = async () => {
    setRunning(true);
    try {
      const response = await fetch('/api/function-agent/demo/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'investor' })
      });
      
      const data = await response.json();
      setResult(data);
      
      toast({
        title: "Demo Complete!",
        description: `${data.summary?.successfulSteps || 0} functions tested`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Demo failed",
        variant: "destructive"
      });
    }
    setRunning(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Function Agent</h1>
      
      <Button 
        onClick={runDemo} 
        disabled={running}
        style={{ 
          backgroundColor: '#059669', 
          color: 'white', 
          padding: '12px 24px',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      >
        {running ? 'Running Demo...' : 'Run Platform Demo'}
      </Button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Results:</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            <div style={{ padding: '15px', backgroundColor: '#dbeafe', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {result.summary?.totalSteps || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>Total Functions</div>
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#dcfce7', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#15803d' }}>
                {result.summary?.successfulSteps || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#15803d' }}>Successful</div>
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#fed7d7', borderRadius: '8px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                {result.summary?.failedSteps || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#dc2626' }}>Failed</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Platform Functions Tested:</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px' }}>
              <li>Platform Health Check</li>
              <li>User Authentication</li>
              <li>Product Catalog</li>
              <li>Store Directory</li>
              <li>AI Recommendations</li>
              <li>SPIRAL Loyalty Points</li>
              <li>Shopping Cart</li>
              <li>Wishlist System</li>
              <li>Order Processing</li>
              <li>Shipping Calculator</li>
              <li>Discount Engine</li>
              <li>AI Agents (18 total)</li>
              <li>Retailer Onboarding</li>
              <li>Partnership Network</li>
              <li>Platform Diagnostics</li>
              <li>And 3 more core functions</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}