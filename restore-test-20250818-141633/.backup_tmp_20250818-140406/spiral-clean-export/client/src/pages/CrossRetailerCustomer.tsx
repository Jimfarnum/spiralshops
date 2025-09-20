import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, ShoppingCart, Clock, Package, 
  Building, Truck, Star, AlertCircle
} from "lucide-react";

interface InventoryItem {
  retailer_id: string;
  retailer_name: string;
  retailer_zip?: string;
  sku: string;
  title: string;
  price: number;
  qty: number;
  distance_km?: number;
  location?: {
    lat: number;
    lng: number;
  };
}

interface Quote {
  courier_id: string;
  courier_name: string;
  kind: string;
  price: number;
  eta_mins: number[];
  serviceable: boolean;
  distance_km: number;
}

interface PickupCenter {
  id: string;
  name: string;
  zip: string;
  address: string;
  hours: string;
  capacity: number;
  lat?: number;
  lng?: number;
}

interface CartItem extends InventoryItem {
  cartQty: number;
}

export default function CrossRetailerCustomer() {
  const [searchSku, setSearchSku] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radiusKm, setRadiusKm] = useState("30");
  const [sortMode, setSortMode] = useState<"nearest" | "price" | "qty">("nearest");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<InventoryItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [searching, setSearching] = useState(false);
  const [locationHint, setLocationHint] = useState("");

  // Fetch pickup centers
  const { data: pickupData } = useQuery({
    queryKey: ['/api/fulfillment/pickup-centers'],
    queryFn: async () => {
      const response = await fetch('/api/fulfillment/pickup-centers');
      return response.json();
    }
  });

  const pickupCenters: PickupCenter[] = pickupData?.pickup_centers || [];

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationHint("Geolocation not available");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationHint("Location detected");
      },
      () => {
        setLocationHint("Could not get location");
      }
    );
  };

  const searchInventory = async () => {
    if (!searchSku.trim()) {
      setLocationHint("Enter a SKU to search");
      return;
    }

    setSearching(true);
    setLocationHint("");

    try {
      const params = new URLSearchParams({
        sku: searchSku.trim()
      });

      if (coordinates) {
        params.set('lat', coordinates.lat.toString());
        params.set('lng', coordinates.lng.toString());
      }

      if (radiusKm) {
        params.set('radius_km', radiusKm);
      }

      if (zipCode.trim()) {
        params.set('zip', zipCode.trim());
      }

      const response = await fetch(`/api/inventory/availability?${params.toString()}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setResults(data);
        
        // Get quotes for serviceable items if ZIP provided
        if (zipCode.trim()) {
          const newQuotes: Record<string, Quote> = {};
          
          for (const item of data) {
            try {
              const quoteParams = new URLSearchParams({
                from_zip: item.retailer_zip || zipCode.trim(),
                to_zip: zipCode.trim(),
                weight_kg: '1'
              });

              const quoteResponse = await fetch(`/api/fulfillment/quote?${quoteParams.toString()}`);
              const quoteData = await quoteResponse.json();
              
              if (quoteResponse.ok && quoteData.quotes && quoteData.quotes.length > 0) {
                newQuotes[`${item.retailer_id}-${item.sku}`] = quoteData.quotes[0];
              }
            } catch (error) {
              console.warn('Quote error for item:', item.sku, error);
            }
          }
          
          setQuotes(newQuotes);
        }
      } else {
        setResults([]);
        setLocationHint("No inventory found");
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setLocationHint("Search failed");
    } finally {
      setSearching(false);
    }
  };

  const sortResults = (items: InventoryItem[]) => {
    const sorted = [...items];
    
    switch (sortMode) {
      case "price":
        return sorted.sort((a, b) => (a.price || 1e9) - (b.price || 1e9));
      case "qty":
        return sorted.sort((a, b) => (b.qty || 0) - (a.qty || 0));
      case "nearest":
      default:
        return sorted.sort((a, b) => (a.distance_km || 1e9) - (b.distance_km || 1e9));
    }
  };

  const addToCart = async (item: InventoryItem) => {
    try {
      const reserveResponse = await fetch('/api/inventory/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retailer_id: item.retailer_id,
          sku: item.sku,
          qty: 1
        })
      });

      if (reserveResponse.ok) {
        const existingItem = cart.find(c => c.retailer_id === item.retailer_id && c.sku === item.sku);
        
        if (existingItem) {
          setCart(cart.map(c => 
            c.retailer_id === item.retailer_id && c.sku === item.sku
              ? { ...c, cartQty: c.cartQty + 1 }
              : c
          ));
        } else {
          setCart([...cart, { ...item, cartQty: 1 }]);
        }
        
        setLocationHint("Item added to cart");
      } else {
        setLocationHint("Could not reserve item (out of stock)");
      }
    } catch (error) {
      setLocationHint("Reserve failed");
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQty), 0);
  };

  const getServiceabilityBadge = (item: InventoryItem) => {
    const quoteKey = `${item.retailer_id}-${item.sku}`;
    const quote = quotes[quoteKey];
    
    if (!quote) return null;
    
    return quote.serviceable ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <Clock className="h-3 w-3 mr-1" />
        {quote.eta_mins[0]}-{quote.eta_mins[1]} min
      </Badge>
    ) : (
      <Badge variant="secondary">
        Same/next-day select areas
      </Badge>
    );
  };

  const getQuoteInfo = (item: InventoryItem) => {
    const quoteKey = `${item.retailer_id}-${item.sku}`;
    const quote = quotes[quoteKey];
    
    if (!quote) return null;
    
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline">
          <Truck className="h-3 w-3 mr-1" />
          From ${quote.price.toFixed(2)}
        </Badge>
      </div>
    );
  };

  const sortedResults = sortResults(results);
  const hasServiceableItems = Object.values(quotes).some(q => q.serviceable);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold">Cross-Retailer Shopping</CardTitle>
                <p className="text-gray-600 mt-1">
                  Find stock across all local stores • One cart • Local delivery & pickup available
                </p>
              </div>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                Back to Home
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Search Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder="Search SKU or Title (e.g. SKU-HEADPHONES-01)"
                  value={searchSku}
                  onChange={(e) => setSearchSku(e.target.value)}
                />
              </div>
              <Input
                placeholder="ZIP Code (e.g. 55101)"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <Input
                placeholder="Radius (km)"
                value={radiusKm}
                onChange={(e) => setRadiusKm(e.target.value)}
              />
              <Select value={sortMode} onValueChange={(value: any) => setSortMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nearest">Sort: Nearest</SelectItem>
                  <SelectItem value="price">Sort: Best Price</SelectItem>
                  <SelectItem value="qty">Sort: Most in Stock</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={useCurrentLocation}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Use Location
                </Button>
                <Button
                  onClick={searchInventory}
                  disabled={searching}
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  {searching ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
            
            {locationHint && (
              <div className="mt-3">
                <Badge variant={locationHint.includes('added') || locationHint.includes('detected') ? "default" : "secondary"}>
                  {locationHint}
                </Badge>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-3">
              Tip: Enter ZIP code for delivery/pickup eligibility. "Use Location" improves distance accuracy.
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedResults.length === 0 && searchSku && !searching && (
            <div className="col-span-full">
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    No local availability found. Try a larger radius or different ZIP code.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {sortedResults.map((item, index) => (
            <Card key={`${item.retailer_id}-${item.sku}-${index}`} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title || item.sku}</CardTitle>
                  {getServiceabilityBadge(item)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  {item.retailer_name}
                  {item.distance_km !== undefined && (
                    <>
                      • <MapPin className="h-3 w-3" />
                      {item.distance_km.toFixed(1)} km
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xl font-bold">${item.price.toFixed(2)}</div>
                  <Badge variant="outline">
                    Qty: {item.qty}
                  </Badge>
                </div>
                
                {getQuoteInfo(item)}
                
                <Button 
                  onClick={() => addToCart(item)}
                  className="w-full mt-3 flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items yet. Add from search results above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => (
                  <div key={`cart-${item.retailer_id}-${item.sku}-${index}`} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-gray-600">
                        {item.sku} • {item.retailer_name} • Qty: {item.cartQty}
                      </div>
                    </div>
                    <div className="font-bold">
                      ${(item.price * item.cartQty).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <div>Total</div>
                  <div>${getTotalPrice().toFixed(2)}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pickup Centers (shown when serviceable items found) */}
        {hasServiceableItems && pickupCenters.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Pickup Centers Near You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pickupCenters.map((center) => (
                  <div key={center.id} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">{center.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {center.address} • {center.zip}
                      </div>
                      <div className="flex gap-4">
                        <Badge variant="outline">
                          <Clock className="h-3 w-3 mr-1" />
                          {center.hours}
                        </Badge>
                        <Badge variant="outline">
                          Capacity: {center.capacity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 py-6">
          © SPIRAL — Tech that builds towns
        </div>
      </div>
    </div>
  );
}