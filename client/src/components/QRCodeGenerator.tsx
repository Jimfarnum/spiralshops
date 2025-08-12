import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  QrCode, 
  Download, 
  Copy, 
  Share2,
  Sparkles,
  Target,
  Users,
  TrendingUp
} from 'lucide-react'

interface QRCodeGeneratorProps {
  retailerId?: string;
  defaultCampaign?: string;
  onGenerated?: (qrData: any) => void;
}

export default function QRCodeGenerator({ 
  retailerId = "demo-retailer-001",
  defaultCampaign = "",
  onGenerated 
}: QRCodeGeneratorProps) {
  const [campaignName, setCampaignName] = useState(defaultCampaign)
  const [description, setDescription] = useState("")
  const [generating, setGenerating] = useState(false)
  const [qrData, setQRData] = useState<any>(null)
  const { toast } = useToast()

  const generateQR = async () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign Name Required",
        description: "Please enter a campaign name for your QR code",
        variant: "destructive"
      })
      return
    }

    setGenerating(true)
    try {
      const response = await fetch('/api/qr/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          retailerId,
          campaignName: campaignName.trim(),
          description: description.trim(),
          shopperId: 'current-user' // This would come from auth context
        }),
      })

      const result = await response.json()

      if (result.success) {
        setQRData(result)
        onGenerated?.(result)
        toast({
          title: "QR Code Generated!",
          description: `Your "${campaignName}" QR code is ready to use`,
        })
      } else {
        throw new Error(result.error || 'Failed to generate QR code')
      }
    } catch (error: any) {
      console.error('QR generation error:', error)
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate QR code. Please try again.",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  const downloadQR = () => {
    if (!qrData?.qrImage) return

    const link = document.createElement('a')
    link.href = qrData.qrImage
    link.download = `SPIRAL-QR-${campaignName.replace(/[^a-zA-Z0-9]/g, '-')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR Code Downloaded",
      description: "QR code saved to your downloads folder"
    })
  }

  const copyLink = async () => {
    if (!qrData?.qrLink) return

    try {
      await navigator.clipboard.writeText(qrData.qrLink)
      toast({
        title: "Link Copied",
        description: "QR code link copied to clipboard"
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      })
    }
  }

  const shareQR = async () => {
    if (!qrData?.qrLink) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shop with SPIRAL - ${campaignName}`,
          text: `Join me for exclusive deals at ${campaignName}!`,
          url: qrData.qrLink,
        })
      } catch (error) {
        // User cancelled sharing or not supported
      }
    } else {
      copyLink()
    }
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <QrCode className="w-6 h-6" />
          QR Code Marketing Generator
        </CardTitle>
        <CardDescription className="text-purple-600">
          Create trackable QR codes for marketing campaigns with integrated analytics
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Form */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign" className="text-purple-800 font-medium">
              Campaign Name *
            </Label>
            <Input
              id="campaign"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Summer Sale 2025, Holiday Special"
              className="border-purple-200 focus:border-purple-400"
              maxLength={50}
            />
            <p className="text-xs text-purple-600 mt-1">
              This will appear in analytics and tracking
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="text-purple-800 font-medium">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this campaign..."
              className="border-purple-200 focus:border-purple-400"
              rows={2}
              maxLength={200}
            />
          </div>

          <Button 
            onClick={generateQR}
            disabled={generating || !campaignName.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {generating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating QR Code...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Generate QR Code
              </div>
            )}
          </Button>
        </div>

        {/* Generated QR Code */}
        {qrData && (
          <div className="space-y-4 p-4 bg-white/60 rounded-lg border border-purple-100">
            <div className="text-center">
              <Badge variant="secondary" className="mb-3">
                Campaign: {campaignName}
              </Badge>
              <div className="bg-white p-4 rounded-lg shadow-sm inline-block border-2 border-purple-100">
                <img 
                  src={qrData.qrImage} 
                  alt={`QR Code for ${campaignName}`}
                  className="w-48 h-48 mx-auto"
                />
              </div>
            </div>

            {/* QR Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={downloadQR}
                variant="outline"
                size="sm"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
              
              <Button 
                onClick={copyLink}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy Link
              </Button>
              
              <Button 
                onClick={shareQR}
                variant="outline"
                size="sm"
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>

            {/* QR Info */}
            <div className="text-xs text-purple-600 space-y-1 bg-purple-50 p-3 rounded border border-purple-100">
              <p><strong>QR ID:</strong> {qrData.qrId}</p>
              <p><strong>Link:</strong> <span className="break-all">{qrData.qrLink}</span></p>
              <p className="text-green-600 font-medium">✅ QR code logged to SOAP G analytics</p>
            </div>
          </div>
        )}

        {/* Features Preview */}
        {!qrData && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-purple-700">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Campaign Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Scan Analytics</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <Users className="w-4 h-4 text-green-500" />
              <span>Customer Insights</span>
            </div>
            <div className="flex items-center gap-2 text-purple-700">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>SOAP G Integration</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}