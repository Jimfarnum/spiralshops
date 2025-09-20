import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  Globe, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  Star, 
  Edit, 
  Save, 
  X,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
  CreditCard,
  Shield
} from "lucide-react";

interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

interface OperatingHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

interface RetailerProfile {
  id: number;
  retailerId: number;
  aboutText?: string;
  logoUrl?: string;
  website?: string;
  operatingHours?: OperatingHours;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLinks;
  specialties?: string[];
  paymentMethods?: string[];
  isVerified: boolean;
}

interface RetailerAboutSectionProps {
  retailerId: number;
  isOwner?: boolean;
  className?: string;
}

export default function RetailerAboutSection({ 
  retailerId, 
  isOwner = false,
  className = ""
}: RetailerAboutSectionProps) {
  const [profile, setProfile] = useState<RetailerProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<RetailerProfile>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [retailerId]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/retailer/profile/${retailerId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setEditData(data.profile);
      } else if (response.status === 404) {
        // Create default profile structure
        const defaultProfile: RetailerProfile = {
          id: 0,
          retailerId,
          aboutText: "",
          logoUrl: "",
          website: "", 
          operatingHours: {},
          contactInfo: {},
          socialLinks: {},
          specialties: [],
          paymentMethods: [],
          isVerified: false
        };
        setProfile(defaultProfile);
        setEditData(defaultProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load retailer profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/retailer/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          retailerId,
          ...editData
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
        setIsEditing(false);
        
        toast({
          title: "Profile Updated",
          description: "Your retailer profile has been saved successfully",
        });
      } else {
        throw new Error("Failed to save profile");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: "Unable to save profile changes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof RetailerProfile] as object || {}),
        [field]: value
      }
    }));
  };

  const formatHours = (hours: OperatingHours) => {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day, index) => ({
      day: dayNames[index],
      hours: hours[day as keyof OperatingHours] || 'Closed'
    }));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return Facebook;
      case 'twitter': return Twitter;
      case 'instagram': return Instagram;
      default: return Globe;
    }
  };

  if (isLoading) {
    return (
      <Card className={`bg-white shadow-lg ${className}`}>
        <CardContent className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--spiral-navy)] mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading retailer information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className={`bg-white shadow-lg ${className}`}>
        <CardContent className="text-center py-8">
          <Store className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Retailer profile not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Logo and Basic Info */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile.logoUrl} alt="Store Logo" />
                <AvatarFallback>
                  <Store className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Store Profile
                  {profile.isVerified && (
                    <Shield className="w-5 h-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  {profile.isVerified ? "Verified Business" : "Business Information"}
                </CardDescription>
              </div>
            </div>
            
            {isOwner && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditData(profile);
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={saveProfile}
                      disabled={isSaving}
                      className="bg-[var(--spiral-navy)] hover:bg-[var(--spiral-coral)]"
                    >
                      {isSaving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* About Section */}
          <div>
            <Label className="text-base font-semibold mb-2 block">About This Business</Label>
            {isEditing ? (
              <Textarea
                value={editData.aboutText || ''}
                onChange={(e) => handleInputChange('aboutText', e.target.value)}
                placeholder="Tell customers about your business, what makes you unique, your history, values, and what customers can expect..."
                rows={4}
                className="w-full"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">
                {profile.aboutText || 'No description available yet.'}
              </p>
            )}
          </div>

          {/* Website */}
          {(profile.website || isEditing) && (
            <div>
              <Label className="text-base font-semibold mb-2 block">Website</Label>
              {isEditing ? (
                <Input
                  value={editData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-business-website.com"
                />
              ) : profile.website ? (
                <a 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[var(--spiral-navy)] hover:text-[var(--spiral-coral)] flex items-center gap-1"
                >
                  <Globe className="w-4 h-4" />
                  {profile.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-[var(--spiral-navy)]" />
            Contact Information
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Phone */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Phone Number</Label>
            {isEditing ? (
              <Input
                value={editData.contactInfo?.phone || ''}
                onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            ) : profile.contactInfo?.phone ? (
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-[var(--spiral-coral)]" />
                <span>{profile.contactInfo.phone}</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Not provided</span>
            )}
          </div>

          {/* Email */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Email</Label>
            {isEditing ? (
              <Input
                type="email"
                value={editData.contactInfo?.email || ''}
                onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                placeholder="contact@yourbusiness.com"
              />
            ) : profile.contactInfo?.email ? (
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-[var(--spiral-coral)]" />
                <span>{profile.contactInfo.email}</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Not provided</span>
            )}
          </div>

          {/* Address */}
          <div>
            <Label className="text-sm font-medium mb-1 block">Address</Label>
            {isEditing ? (
              <Textarea
                value={editData.contactInfo?.address || ''}
                onChange={(e) => handleNestedInputChange('contactInfo', 'address', e.target.value)}
                placeholder="123 Main Street, City, State 12345"
                rows={2}
              />
            ) : profile.contactInfo?.address ? (
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-4 h-4 text-[var(--spiral-coral)] mt-0.5" />
                <span>{profile.contactInfo.address}</span>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">Not provided</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operating Hours */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--spiral-navy)]" />
            Store Hours
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <div key={day} className="flex items-center gap-2">
                  <Label className="w-16 text-sm capitalize">{day.slice(0, 3)}</Label>
                  <Input
                    value={editData.operatingHours?.[day as keyof OperatingHours] || ''}
                    onChange={(e) => handleNestedInputChange('operatingHours', day, e.target.value)}
                    placeholder="9:00 AM - 6:00 PM"
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {formatHours(profile.operatingHours || {}).map((dayInfo, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="font-medium">{dayInfo.day}</span>
                  <span className="text-gray-600">{dayInfo.hours}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media Links */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[var(--spiral-navy)]" />
            Social Media
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {isEditing ? (
            <div className="space-y-3">
              {['facebook', 'twitter', 'instagram'].map((platform) => (
                <div key={platform} className="flex items-center gap-2">
                  <Label className="w-20 text-sm capitalize">{platform}</Label>
                  <Input
                    value={editData.socialLinks?.[platform as keyof SocialLinks] || ''}
                    onChange={(e) => handleNestedInputChange('socialLinks', platform, e.target.value)}
                    placeholder={`https://${platform}.com/yourbusiness`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {Object.entries(profile.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                const Icon = getSocialIcon(platform);
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[var(--spiral-navy)] hover:text-[var(--spiral-coral)] transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm capitalize">{platform}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                );
              })}
              {Object.keys(profile.socialLinks || {}).length === 0 && (
                <span className="text-gray-500 text-sm">No social media links added</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialties & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-[var(--spiral-navy)]" />
              Specialties
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <div>
                <Label className="text-sm mb-2 block">Enter specialties (comma-separated)</Label>
                <Input
                  value={editData.specialties?.join(', ') || ''}
                  onChange={(e) => handleInputChange('specialties', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Custom jewelry, Repairs, Vintage items"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.specialties?.length ? (
                  profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {specialty}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No specialties listed</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[var(--spiral-navy)]" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {isEditing ? (
              <div>
                <Label className="text-sm mb-2 block">Accepted payment methods (comma-separated)</Label>
                <Input
                  value={editData.paymentMethods?.join(', ') || ''}
                  onChange={(e) => handleInputChange('paymentMethods', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Cash, Credit Cards, PayPal, Apple Pay"
                />
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.paymentMethods?.length ? (
                  profile.paymentMethods.map((method, index) => (
                    <Badge key={index} variant="outline" className="border-green-200 text-green-700">
                      {method}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Payment methods not specified</span>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}