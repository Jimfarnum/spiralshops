import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InviteToShopModal from './InviteToShopModal'
import { 
  Users, 
  Gift, 
  Sparkles, 
  Share2,
  Heart,
  MapPin
} from 'lucide-react'

interface InviteToShopSectionProps {
  shopperId?: string;
  location?: string;
  className?: string;
}

export default function InviteToShopSection({ 
  shopperId = "demo-shopper-001",
  location = "Minneapolis Shopping District",
  className = ""
}: InviteToShopSectionProps) {
  return (
    <Card className={`border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Users className="w-6 h-6" />
          Invite Friends to Shop
        </CardTitle>
        <CardDescription className="text-purple-600">
          Create AI-enhanced group shopping experiences with personalized recommendations and social rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-purple-700">
            <Gift className="w-4 h-4 text-purple-500" />
            <span>Group Discounts</span>
          </div>
          <div className="flex items-center gap-2 text-purple-700">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>AI Recommendations</span>
          </div>
          <div className="flex items-center gap-2 text-purple-700">
            <Share2 className="w-4 h-4 text-green-500" />
            <span>Social Sharing</span>
          </div>
          <div className="flex items-center gap-2 text-purple-700">
            <Heart className="w-4 h-4 text-red-500" />
            <span>SPIRAL Rewards</span>
          </div>
        </div>

        {/* Location Display */}
        <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-purple-100">
          <MapPin className="w-4 h-4 text-purple-600" />
          <div>
            <p className="font-medium text-purple-800 text-sm">Shopping at</p>
            <p className="text-purple-600 text-xs">{location}</p>
          </div>
        </div>

        {/* Action Button */}
        <InviteToShopModal 
          shopperId={shopperId}
          location={location}
        />
      </CardContent>
    </Card>
  )
}