import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, Star, Filter, Zap } from 'lucide-react';

interface SearchResult {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: string;
  zipCode: string;
  relevanceScore: number;
  searchContext: {
    matchType: string;
    proximity: number | null;
  };
}

export default function SmartSearchDemo() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [fuzzyEnabled, setFuzzyEnabled] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Smart search query
  const { data: smartSearchData, isLoading: searchLoading, refetch: searchRefetch } = useQuery({
    queryKey: ['/api/smart-search', searchQuery, category, location, fuzzyEnabled],
    enabled: false
  });

  // Search suggestions query
  const { data: suggestionsData } = useQuery({
    queryKey: ['/api/search-suggestions', searchQuery],
    enabled: searchQuery.length > 2
  });

  useEffect(() => {
    if (smartSearchData) {
      setSearchResults(smartSearchData.results || []);
      setSuggestions(smartSearchData.suggestions || []);
    }
  }, [smartSearchData]);

  useEffect(() => {
    if (suggestionsData) {
      setSuggestions(suggestionsData.suggestions || []);
    }
  }, [suggestionsData]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchRefetch();
    }
  };

  const getMatchTypeColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'name_partial': return 'bg-blue-100 text-blue-800';
      case 'description': return 'bg-purple-100 text-purple-800';
      case 'fuzzy': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            <Zap className="inline-block w-10 h-10 text-blue-600 mr-3" />
            Smart Search Enhancement
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced semantic search with Watson Discovery-style intelligence, typo tolerance, and location boosting
          </p>
        </div>

        {/* Search Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-6 h-6 mr-2" />
              Enhanced Search Engine
            </CardTitle>
            <CardDescription>
              Search with semantic relevance, fuzzy matching, and smart filtering
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search stores, products, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  placeholder="ZIP Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-32 pl-10"
                />
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              <Button onClick={handleSearch} disabled={searchLoading}>
                {searchLoading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Search Features */}
            <div className="flex flex-wrap gap-2">
              <Badge variant={fuzzyEnabled ? "default" : "secondary"}>
                <Filter className="w-3 h-3 mr-1" />
                Fuzzy Matching: {fuzzyEnabled ? 'ON' : 'OFF'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFuzzyEnabled(!fuzzyEnabled)}
              >
                Toggle Fuzzy Search
              </Button>
            </div>

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        handleSearch();
                      }}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
              <CardDescription>
                Results ranked by semantic relevance and location proximity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {result.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{result.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {result.rating}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {result.zipCode}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge className="bg-blue-100 text-blue-800">
                          Score: {result.relevanceScore.toFixed(1)}
                        </Badge>
                        <Badge
                          className={getMatchTypeColor(result.searchContext.matchType)}
                        >
                          {result.searchContext.matchType.replace('_', ' ')}
                        </Badge>
                        {result.searchContext.proximity !== null && (
                          <Badge variant="outline" className="block text-xs">
                            Distance: {result.searchContext.proximity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Features Demo */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Semantic Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Understands context and meaning, not just keywords
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('coffee shop near me');
                  handleSearch();
                }}
              >
                Try: "coffee shop near me"
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Typo Tolerance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Finds results even with spelling mistakes
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('electonics');
                  setFuzzyEnabled(true);
                  handleSearch();
                }}
              >
                Try: "electonics" (typo)
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Prioritizes nearby stores and services
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery('target');
                  setLocation('12345');
                  handleSearch();
                }}
              >
                Try: ZIP-based boost
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Smart Search Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Search Algorithms</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Semantic relevance scoring</li>
                  <li>• Levenshtein distance for typos</li>
                  <li>• Location-based proximity boost</li>
                  <li>• Rating and quality weighting</li>
                  <li>• Query expansion suggestions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Integration Points</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Watson Discovery API ready</li>
                  <li>• Real-time search suggestions</li>
                  <li>• Category and location filters</li>
                  <li>• Personalized result ranking</li>
                  <li>• Search analytics tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}