import ShopperAIAgent from '@/components/ShopperAIAgent'
import SEOHead from '@/components/SEOHead'

export default function ShopperAIPage() {
  return (
    <>
      <SEOHead 
        title="Personal Shopping AI - SPIRAL Platform"
        description="Your personal AI shopping assistant for finding deals, optimizing purchases, and maximizing savings on every shopping trip."
      />
      <ShopperAIAgent />
    </>
  )
}