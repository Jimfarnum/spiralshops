import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Navigation, Building2, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface Mall {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  distance?: number;
  storeCount: number;
  type: 'shopping_center' | 'outlet' | 'lifestyle' | 'strip_mall';
  features: string[];
  hours: string;
  phone: string;
}

interface MallDirectoryDropdownProps {
  onMallSelect?: (mall: Mall) => void;
  showLocator?: boolean;
  className?: string;
}

const mockMalls: Mall[] = [
  {
    id: 'westfield-valley-fair',
    name: 'Westfield Valley Fair',
    address: '2855 Stevens Creek Blvd',
    city: 'Santa Clara',
    state: 'CA',
    zipCode: '95050',
    storeCount: 240,
    type: 'shopping_center',
    features: ['SPIRAL Center', 'Food Court', 'Valet Parking', 'Family Lounge'],
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-7PM',
    phone: '(408) 248-4451'
  },
  {
    id: 'stanford-shopping-center',
    name: 'Stanford Shopping Center',
    address: '660 Stanford Shopping Center',
    city: 'Palo Alto',
    state: 'CA',
    zipCode: '94304',
    storeCount: 140,
    type: 'lifestyle',
    features: ['SPIRAL Center', 'Outdoor Dining', 'Tesla Supercharger', 'Pet Friendly'],
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-6PM',
    phone: '(650) 617-8200'
  },
  {
    id: 'santana-row',
    name: 'Santana Row',
    address: '377 Santana Row',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95128',
    storeCount: 70,
    type: 'lifestyle',
    features: ['SPIRAL Center', 'Residential', 'Nightlife', 'Events'],
    hours: 'Daily 10AM-10PM',
    phone: '(408) 551-4611'
  },
  {
    id: 'great-mall',
    name: 'Great Mall',
    address: '447 Great Mall Dr',
    city: 'Milpitas',
    state: 'CA',
    zipCode: '95035',
    storeCount: 200,
    type: 'outlet',
    features: ['SPIRAL Center', 'Outlet Stores', 'Movie Theater', 'Arcade'],
    hours: 'Mon-Sat 10AM-9PM, Sun 11AM-8PM',
    phone: '(408) 956-2033'
  }
];

export default function MallDirectoryDropdown({ onMallSelect, showLocator = true, className = '' }: MallDirectoryDropdownProps) {
  const [searchZip, setSearchZip] = useState('');
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null);
  const [nearbyMalls, setNearbyMalls] = useState<Mall[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { toast } = useToast();

  const handleZipSearch = () => {
    if (!searchZip.trim()) {
      toast({
        title: "Enter ZIP Code",
        description: "Please enter your ZIP code to find nearby malls.",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{5}$/.test(searchZip.trim())) {
      toast({
        title: "Invalid ZIP Code",
        description: "Please enter a valid 5-digit ZIP code.",
        variant: "destructive",
      });
      return;
    }

    // Simulate distance calculation and sorting
    const mallsWithDistance = mockMalls.map(mall => ({
      ...mall,
      distance: Math.floor(Math.random() * 25) + 1 // Random distance 1-25 miles
    })).sort((a, b) => a.distance! - b.distance!);

    setNearbyMalls(mallsWithDistance);
    setShowDropdown(true);
    
    toast({
      title: "Malls Found",
      description: `Found ${mallsWithDistance.length} malls near ${searchZip}`,
    });
  };

  const handleGPSLocation = () => {
    setIsLocating(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate finding nearby malls based on GPS
          const mallsWithDistance = mockMalls.map(mall => ({
            ...mall,
            distance: Math.floor(Math.random() * 15) + 1 // Random distance 1-15 miles
          })).sort((a, b) => a.distance! - b.distance!);

          setNearbyMalls(mallsWithDistance);
          setShowDropdown(true);
          setIsLocating(false);
          
          toast({
            title: "Location Found",
            description: `Found ${mallsWithDistance.length} malls near your location`,
          });
        },
        () => {
          setIsLocating(false);
          toast({
            title: "Location Access Denied",
            description: "Please enter your ZIP code to find nearby malls.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLocating(false);
      toast({
        title: "Location Not Supported",
        description: "Please enter your ZIP code to find nearby malls.",
        variant: "destructive",
      });
    }
  };

  const handleMallSelect = (mall: Mall) => {
    setSelectedMall(mall);
    setShowDropdown(false);
    onMallSelect?.(mall);
    
    toast({
      title: "Mall Selected",
      description: `Now browsing ${mall.name}`,
    });
  };

  const getMallTypeColor = (type: string) => {
    switch (type) {
      case 'shopping_center': return 'bg-blue-100 text-blue-800';
      case 'outlet': return 'bg-green-100 text-green-800';
      case 'lifestyle': return 'bg-purple-100 text-purple-800';
      case 'strip_mall': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-[var(--spiral-navy)]">
            <Building2 className="h-5 w-5" />
            Mall Directory & Locator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ZIP Code Search */}
          {showLocator && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ZIP code"
                  value={searchZip}
                  onChange={(e) => setSearchZip(e.target.value)}
                  className="flex-1"
                  maxLength={5}
                />
                <Button onClick={handleZipSearch} size="sm" variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
              
              <Button 
                onClick={handleGPSLocation} 
                disabled={isLocating}
                variant="outline" 
                className="w-full"
                size="sm"
              >
                <Navigation className={`h-4 w-4 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                {isLocating ? 'Finding Your Location...' : 'Use My Location'}
              </Button>
            </div>
          )}

          {/* Mall Selection Dropdown */}
          <div className="space-y-2">
            <Select onValueChange={(value) => {
              const mall = mockMalls.find(m => m.id === value);
              if (mall) handleMallSelect(mall);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a mall to browse" />
              </SelectTrigger>
              <SelectContent>
                {mockMalls.map((mall) => (
                  <SelectItem key={mall.id} value={mall.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{mall.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {mall.city}, {mall.state}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Mall Info */}
          {selectedMall && (
            <Card className="bg-[var(--spiral-cream)] border-[var(--spiral-coral)]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-[var(--spiral-navy)]">{selectedMall.name}</h3>
                  <Badge className={getMallTypeColor(selectedMall.type)}>
                    {selectedMall.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedMall.address}, {selectedMall.city}, {selectedMall.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {selectedMall.storeCount} stores
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedMall.hours}
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Link to={`/mall/${selectedMall.id}`}>
                    <Button size="sm" className="button-primary">
                      Visit Mall Page
                    </Button>
                  </Link>
                  <Button size="sm" variant="outline" onClick={() => setSelectedMall(null)}>
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nearby Malls Results */}
          {showDropdown && nearbyMalls.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <h4 className="font-medium text-sm text-[var(--spiral-navy)]">Nearby Malls</h4>
              {nearbyMalls.map((mall) => (
                <Card 
                  key={mall.id} 
                  className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-[var(--spiral-coral)]"
                  onClick={() => handleMallSelect(mall)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-medium text-sm">{mall.name}</h5>
                      <div className="flex items-center gap-2">
                        <Badge className={getMallTypeColor(mall.type)} variant="secondary">
                          {mall.type.replace('_', ' ')}
                        </Badge>
                        {mall.distance && (
                          <span className="text-xs text-gray-500">{mall.distance} mi</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{mall.city}, {mall.state} • {mall.storeCount} stores</p>
                    <div className="flex gap-1 mt-2">
                      {mall.features.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}