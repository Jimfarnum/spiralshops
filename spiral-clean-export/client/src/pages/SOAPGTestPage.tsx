import SOAPGTestSuite from '@/components/SOAPGTestSuite'
import SEOHead from '@/components/SEOHead'

export default function SOAPGTestPage() {
  return (
    <>
      <SEOHead 
        title="SOAP G Test Suite - AI Agent Testing | SPIRAL"
        description="Comprehensive testing suite for SOAP G Central Brain AI agent system. Test all 6 specialized agents and multi-agent coordination capabilities."
      />
      <SOAPGTestSuite />
    </>
  )
}