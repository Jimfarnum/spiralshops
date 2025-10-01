import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { 
  Users, 
  Zap, 
  Share2, 
  Gift, 
  MapPin, 
  Sparkles,
  Info,
  Brain,
  Heart,
  ShoppingBag
} from 'lucide-react'

interface InviteToShopModalProps {
  shopperId?: string;
  location?: string;
  trigger?: React.ReactNode;
}

export default function InviteToShopModal({ 
  shopperId = "demo-shopper-001", 
  location = "Minneapolis Shopping District",
  trigger 
}: InviteToShopModalProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [aiEnabled, setAiEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inviteData, setInviteData] = useState({
    friends: '',
    platform: 'Instagram',
    preferences: '',
    budget: '',
    message: ''
  })

  const handleCreateInvite = async () => {
    if (!inviteData.friends.trim()) {
      toast({
        title: "Friends required",
        description: "Please add at least one friend to invite",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/invite-to-shop/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shopperId,
          friends: inviteData.friends.split(',').map(f => f.trim()).filter(f => f),
          platform: inviteData.platform,
          location,
          preferences: inviteData.preferences.split(',').map(p => p.trim()).filter(p => p),
          budget: inviteData.budget,
          aiEnabled
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Invite created successfully!",
          description: aiEnabled 
            ? "AI has optimized your invite with personalized recommendations" 
            : "Your shopping invite is ready to share"
        })
        
        // Reset form and close modal
        setInviteData({
          friends: '',
          platform: 'Instagram',
          preferences: '',
          budget: '',
          message: ''
        })
        setIsOpen(false)
      } else {
        throw new Error(result.error || 'Failed to create invite')
      }
    } catch (error) {
      console.error('Error creating invite:', error)
      toast({
        title: "Error creating invite",
        description: "Please try again or check your connection",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = (
    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
      <Users className="w-4 h-4 mr-2" />
      Invite to Shop
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Invite Friends to Shop
          </DialogTitle>
          <DialogDescription>
            Create a personalized shopping invitation with AI-powered recommendations and group coordination
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* AI Toggle Section */}
          <Card className="border-blue-100 bg-blue-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">AI Enhancement</CardTitle>
                </div>
                <Switch
                  checked={aiEnabled}
                  onCheckedChange={setAiEnabled}
                />
              </div>
            </CardHeader>
            {aiEnabled && (
              <CardContent className="pt-0">
                <div className="flex items-start gap-2 text-sm text-blue-700">
                  <Info className="w-4 h-4 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Why Enable AI?</p>
                    <ul className="text-xs space-y-1">
                      <li>• Personalized store recommendations based on group preferences</li>
                      <li>• Optimized social media content for maximum engagement</li>
                      <li>• Coordination with Mall Manager for special group offers</li>
                      <li>• Smart timing and route planning for efficient shopping</li>
                      <li>• SPIRAL rewards optimization for group activities</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Basic Invite Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="friends">Friends to Invite</Label>
              <Textarea
                id="friends"
                placeholder="Enter friend names or emails (comma separated)
Example: Sarah, mike@example.com, Emily Chen"
                value={inviteData.friends}
                onChange={(e) => setInviteData(prev => ({...prev, friends: e.target.value}))}
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform">Share Platform</Label>
                <select
                  id="platform"
                  value={inviteData.platform}
                  onChange={(e) => setInviteData(prev => ({...prev, platform: e.target.value}))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Twitter">X (Twitter)</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Messages">Text Messages</option>
                  <option value="Email">Email</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range (Optional)</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $50-100 per person"
                  value={inviteData.budget}
                  onChange={(e) => setInviteData(prev => ({...prev, budget: e.target.value}))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">Shopping Interests</Label>
            <Input
              id="preferences"
              placeholder="e.g., fashion, electronics, home decor, gifts (comma separated)"
              value={inviteData.preferences}
              onChange={(e) => setInviteData(prev => ({...prev, preferences: e.target.value}))}
            />
          </div>

          {/* Location Display */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Shopping Location</p>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
          </div>

          {/* AI Features Preview */}
          {aiEnabled && (
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  AI Features Included
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-blue-500" />
                  <span>Social Media Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span>Group Offers & Discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-orange-500" />
                  <span>Personalized Store Recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Group Activity Planning</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateInvite}
              disabled={loading || !inviteData.friends.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                  {aiEnabled ? 'AI Processing...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  {aiEnabled ? 'Create AI-Enhanced Invite' : 'Create Invite'}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}