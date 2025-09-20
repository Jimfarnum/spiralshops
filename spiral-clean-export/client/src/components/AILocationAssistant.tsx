import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Search, MapPin, Store, Lightbulb, Target } from 'lucide-react';
import { locationService, type LocationData } from '@/services/locationService';

interface AILocationAssistantProps {
  userLocation?: LocationData | null;
  onSearchResults?: (results: any) => void;
}

interface AISearchSuggestion {
  query: string;
  reasoning: string;
  category: string;
  priority: number;
}

export default function AILocationAssistant({ userLocation, onSearchResults }: AILocationAssistantProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<AISearchSuggestion[]>([]);

  // AI-powered location search
  const { data: aiResults, isLoading: aiLoading, error: aiError } = useQuery({
    queryKey: ['/api/location-search', query, userLocation],
    queryFn: async () => {
      if (!query.trim()) return null;
      
      const params = new URLSearchParams();
      params.append('query', query);
      
      if (userLocation?.coordinates) {
        params.append('latitude', userLocation.coordinates.latitude.toString());
        params.append('longitude', userLocation.coordinates.longitude.toString());
        params.append('radius', '25');
      }
      
      if (userLocation?.city) params.append('city', userLocation.city);
      if (userLocation?.state) params.append('state', userLocation.state);
      
      const response = await fetch(`/api/location-search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to perform AI search');
      }
      return response.json();
    },
    enabled: false
  });

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    try {
      // Generate AI suggestions based on query
      await generateSearchSuggestions(query);
      
      // Perform actual search
      const params = new URLSearchParams();
      params.append('query', query);
      
      if (userLocation?.coordinates) {
        params.append('latitude', userLocation.coordinates.latitude.toString());
        params.append('longitude', userLocation.coordinates.longitude.toString());
        params.append('radius', '25');
      }
      
      if (userLocation?.city) params.append('city', userLocation.city);
      if (userLocation?.state) params.append('state', userLocation.state);
      
      const response = await fetch(`/api/location-search?${params}`);
      const results = await response.json();
      
      if (onSearchResults) {
        onSearchResults(results);
      }
    } catch (error) {
      console.error('AI search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const generateSearchSuggestions = async (searchQuery: string) => {
    // Generate contextual suggestions based on query
    const contextualSuggestions: AISearchSuggestion[] = [];
    
    const queryLower = searchQuery.toLowerCase();
    
    // Food & Dining suggestions
    if (queryLower.includes('food') || queryLower.includes('eat') || queryLower.includes('restaurant') || queryLower.includes('dinner')) {
      contextualSuggestions.push({
        query: 'local restaurants with outdoor seating',
        reasoning: 'You seem interested in dining. Local restaurants with outdoor seating are popular.',
        category: 'Food & Dining',
        priority: 1
      });
      contextualSuggestions.push({
        query: 'coffee shops with WiFi',
        reasoning: 'Coffee shops are great for casual meetings or work.',
        category: 'Food & Dining',
        priority: 2
      });
    }
    
    // Shopping suggestions
    if (queryLower.includes('shop') || queryLower.includes('buy') || queryLower.includes('store') || queryLower.includes('clothes')) {
      contextualSuggestions.push({
        query: 'local boutiques with unique items',
        reasoning: 'Local boutiques often have unique items you can\'t find elsewhere.',
        category: 'Shopping',
        priority: 1
      });
      contextualSuggestions.push({
        query: 'stores with same-day pickup',
        reasoning: 'Same-day pickup saves time and supports local businesses.',
        category: 'Shopping',
        priority: 2
      });
    }
    
    // Services suggestions
    if (queryLower.includes('service') || queryLower.includes('repair') || queryLower.includes('help')) {
      contextualSuggestions.push({
        query: 'local services with online booking',
        reasoning: 'Services with online booking offer convenience and flexibility.',
        category: 'Services',
        priority: 1
      });
    }
    
    // Default suggestions if no specific category
    if (contextualSuggestions.length === 0) {
      contextualSuggestions.push(
        {
          query: 'highly rated local businesses',
          reasoning: 'Highly rated businesses provide quality products and services.',
          category: 'General',
          priority: 1
        },
        {
          query: 'stores with special SPIRAL rewards',
          reasoning: 'SPIRAL rewards help you save money on future purchases.',
          category: 'Rewards',
          priority: 2
        },
        {
          query: 'businesses open late today',
          reasoning: 'Late-hour businesses are convenient for evening shopping.',
          category: 'Convenience',
          priority: 3
        }
      );
    }
    
    setSuggestions(contextualSuggestions.slice(0, 3)); // Show top 3 suggestions
  };

  const handleSuggestionClick = (suggestion: AISearchSuggestion) => {
    setQuery(suggestion.query);
    handleSearch();
  };

  const presetQueries = [
    'coffee shops near me',
    'local grocery stores',
    'restaurants with delivery',
    'electronics stores',
    'clothing boutiques',
    'home improvement stores',
    'pharmacies open now',
    'gas stations nearby'
  ];

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Sparkles className="h-5 w-5" />
          AI Location Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Search */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask me to find stores, restaurants, services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={!query.trim() || isSearching}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSearching ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Location Context */}
        {userLocation && (
          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
            <MapPin className="h-3 w-3" />
            <span>Searching near {userLocation.city}, {userLocation.state}</span>
          </div>
        )}

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
              <Target className="h-4 w-4" />
              Smart Suggestions
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-blue-900 text-sm">{suggestion.query}</p>
                      <p className="text-xs text-blue-600 mt-1">{suggestion.reasoning}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs ml-2">
                      {suggestion.category}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preset Queries */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800">
            <Lightbulb className="h-4 w-4" />
            Quick Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {presetQueries.map((preset, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-blue-100 text-blue-700 border-blue-300"
                onClick={() => {
                  setQuery(preset);
                  handleSearch();
                }}
              >
                {preset}
              </Badge>
            ))}
          </div>
        </div>

        {/* AI Results Summary */}
        {aiResults?.aiResults && (
          <Alert className="bg-green-50 border-green-200">
            <Target className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-medium mb-1">AI Analysis:</p>
              <p className="text-sm">{aiResults.aiResults.reasoning}</p>
              {aiResults.aiResults.suggestions && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Try these searches:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiResults.aiResults.suggestions.map((suggestion: string, index: number) => (
                      <Badge 
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer"
                        onClick={() => setQuery(suggestion)}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Error State */}
        {aiError && (
          <Alert className="bg-red-50 border-red-200">
            <AlertDescription className="text-red-800">
              AI search temporarily unavailable. Try basic search instead.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}