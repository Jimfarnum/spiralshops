import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Brain, CheckCircle, XCircle, Clock, Zap } from 'lucide-react'

interface TestResult {
  agent: string
  task: string
  status: 'pending' | 'success' | 'error'
  response?: any
  duration?: number
}

export default function SOAPGTestSuite() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const testCases = [
    {
      agent: 'mall-manager',
      name: 'Mall Manager AI',
      task: 'Optimize tenant mix for maximum revenue',
      context: { mallId: 'test_mall', occupancy: 85, targetRevenue: 2500000 }
    },
    {
      agent: 'retailer',
      name: 'Retailer AI', 
      task: 'Analyze inventory turnover and recommend pricing strategy',
      context: { storeId: 'test_store', category: 'electronics', inventory: 500 }
    },
    {
      agent: 'shopper-engagement',
      name: 'Shopper Engagement AI',
      task: 'Create personalized shopping recommendations',
      context: { userId: 'test_user', preferences: ['electronics', 'fashion'], budget: 500 }
    },
    {
      agent: 'social-media',
      name: 'Social Media AI',
      task: 'Design viral campaign for new store opening',
      context: { storeName: 'TechHub', storeType: 'electronics', audience: 'tech enthusiasts' }
    },
    {
      agent: 'marketing-partnerships',
      name: 'Marketing & Partnerships AI',
      task: 'Identify strategic partnership opportunities',
      context: { industry: 'retail', location: 'urban', target: 'millennials' }
    },
    {
      agent: 'admin',
      name: 'Admin AI',
      task: 'Generate platform performance report',
      context: { period: '30days', metrics: ['revenue', 'users', 'engagement'] }
    }
  ]

  const runTestSuite = async () => {
    setIsRunning(true)
    setTestResults([])

    for (const testCase of testCases) {
      const result: TestResult = {
        agent: testCase.agent,
        task: testCase.task,
        status: 'pending'
      }
      
      setTestResults(prev => [...prev, result])
      
      try {
        const startTime = Date.now()
        const response = await fetch(`/api/soap-g/${testCase.agent}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task: testCase.task,
            context: testCase.context
          })
        })
        
        const data = await response.json()
        const duration = Date.now() - startTime
        
        setTestResults(prev => 
          prev.map(r => 
            r.agent === testCase.agent 
              ? { ...r, status: 'success', response: data, duration }
              : r
          )
        )
      } catch (error) {
        setTestResults(prev => 
          prev.map(r => 
            r.agent === testCase.agent 
              ? { ...r, status: 'error', response: error }
              : r
          )
        )
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setIsRunning(false)
  }

  const runCoordinationTest = async () => {
    try {
      const response = await fetch('/api/soap-g/coordinate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task: 'Launch comprehensive marketing campaign for new mall',
          agents: ['mall-manager', 'social-media', 'marketing-partnerships']
        })
      })
      
      const data = await response.json()
      console.log('Coordination test result:', data)
    } catch (error) {
      console.error('Coordination test failed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          SOAP G Central Brain Test Suite
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive testing of all 6 AI agents and coordination capabilities
        </p>
      </div>

      <div className="flex space-x-4 mb-8">
        <Button 
          onClick={runTestSuite} 
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Brain className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Full Test Suite'}
        </Button>
        
        <Button 
          onClick={runCoordinationTest}
          variant="outline"
        >
          <Zap className="w-4 h-4 mr-2" />
          Test Multi-Agent Coordination
        </Button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
          
          {testResults.map((result, index) => (
            <Card key={index}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <CardTitle className="text-lg">
                        {testCases.find(tc => tc.agent === result.agent)?.name}
                      </CardTitle>
                      <CardDescription>{result.task}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {result.duration && (
                      <Badge variant="secondary">{result.duration}ms</Badge>
                    )}
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {result.response && (
                <CardContent>
                  <Textarea
                    value={JSON.stringify(result.response, null, 2)}
                    readOnly
                    className="h-32 font-mono text-xs"
                  />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {testResults.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Ready to Test SOAP G System
            </h3>
            <p className="text-gray-600">
              Click "Run Full Test Suite" to test all 6 AI agents
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}