import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, ShoppingCart, Clock, DollarSign, RefreshCw } from 'lucide-react';

interface TripNotification {
  tripId: string;
  tripName: string;
  hostUserId: string;
  participants: number;
  maxParticipants: number;
  cartItems: Array<{
    id: number;
    name: string;
    price: number;
    quantity?: number;
  }>;
  status: string;
  createdAt: string;
  expiresAt: string;
  estimatedValue: number;
  potentialCustomers: number;
  isActive: boolean;
}

interface TripStats {
  totalTrips: number;
  activeTrips: number;
  totalParticipants: number;
  estimatedRevenue: number;
  averageCartValue: number;
}

interface TripNotificationsProps {
  storeId?: string;
  mallId?: string;
}

export default function TripNotifications({ storeId = 'store_1', mallId = 'mall_1' }: TripNotificationsProps) {
  const [trips, setTrips] = useState<TripNotification[]>([]);
  const [stats, setStats] = useState<TripStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/trips-by-location?mallId=${mallId}&storeId=${storeId}`);
      const data = await response.json();
      
      if (data.success) {
        setTrips(data.trips || []);
      }
      
      // Fetch stats
      const statsResponse = await fetch(`/api/trip-stats?mallId=${mallId}&storeId=${storeId}`);
      const statsData = await statsResponse.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching trips:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrips, 30000);
    return () => clearInterval(interval);
  }, [storeId, mallId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Live Shopping Trips</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time notifications of shopping groups in your area
          </p>
        </div>
        <Button
          onClick={fetchTrips}
          variant="outline"
          size="sm"
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Trips</p>
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
                  <p className="text-2xl font-bold">{stats.activeTrips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Shoppers</p>
                  <p className="text-2xl font-bold">{stats.totalParticipants}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Est. Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.estimatedRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Cart</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.averageCartValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Trips Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Shopping Groups</h3>
          <Badge variant="secondary" className="text-xs">
            Last updated: {formatTime(lastUpdated.toISOString())}
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading trips...</span>
          </div>
        ) : trips.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No Active Shopping Trips
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                When shoppers create group shopping trips in your area, they'll appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => (
              <Card key={trip.tripId} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{trip.tripName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={trip.isActive ? "default" : "secondary"}>
                        {trip.isActive ? "Active" : "Expired"}
                      </Badge>
                      <Badge variant="outline">
                        {trip.participants}/{trip.maxParticipants} people
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Created: {formatTime(trip.createdAt)}</span>
                    <span>•</span>
                    <span>Expires: {formatTime(trip.expiresAt)}</span>
                    <span>•</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(trip.estimatedValue)} potential
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium mb-2">Cart Items ({Object.keys(trip.cartItems || {}).length})</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.values(trip.cartItems || {}).slice(0, 4).map((item: any, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                        {Object.keys(trip.cartItems || {}).length > 4 && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 p-2">
                            +{Object.keys(trip.cartItems || {}).length - 4} more items
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4" />
                        <span>{trip.potentialCustomers} potential customers</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Footer */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Live Trip Notifications
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                This dashboard updates automatically every 30 seconds with new shopping trips in your area. 
                Use this data to prepare inventory and anticipate customer visits.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}