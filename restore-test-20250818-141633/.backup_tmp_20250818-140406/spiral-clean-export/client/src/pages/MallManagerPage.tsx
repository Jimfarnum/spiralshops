import MallManagerDashboard from '@/components/MallManagerDashboard'
import SEOHead from '@/components/SEOHead'

export default function MallManagerPage() {
  return (
    <>
      <SEOHead 
        title="Mall Manager Dashboard - SPIRAL Platform"
        description="Comprehensive mall management dashboard with AI assistance for tenant recruitment, performance optimization, and revenue maximization."
      />
      <MallManagerDashboard />
    </>
  )
}