import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, TrendingUp } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'store' | 'location' | 'recent' | 'trending';
  icon?: React.ReactNode;
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
}

export default function SearchWithSuggestions({
  placeholder = "Search products, stores, or locations...",
  onSearch,
  className
}: SearchWithSuggestionsProps) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', text: 'Artisan coffee beans', type: 'trending', icon: <TrendingUp className="h-4 w-4" /> },
    { id: '2', text: 'Handmade jewelry', type: 'product' },
    { id: '3', text: 'Downtown Plaza Mall', type: 'location', icon: <MapPin className="h-4 w-4" /> },
    { id: '4', text: 'Local Roasters Co.', type: 'store' },
    { id: '5', text: 'organic honey', type: 'recent', icon: <Clock className="h-4 w-4" /> },
    { id: '6', text: 'Heritage Square Mall', type: 'location', icon: <MapPin className="h-4 w-4" /> },
    { id: '7', text: 'winter scarves', type: 'trending', icon: <TrendingUp className="h-4 w-4" /> },
  ];

  useEffect(() => {
    if (query.length > 1) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else if (query.length === 0) {
      // Show recent and trending when empty
      const defaultSuggestions = mockSuggestions.filter(s => 
        s.type === 'recent' || s.type === 'trending'
      ).slice(0, 4);
      setSuggestions(defaultSuggestions);
      setShowSuggestions(false);
    } else {
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      onSearch(finalQuery.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`}>
      <div className="flex items-center shadow-lg rounded-lg overflow-hidden bg-white border border-gray-200">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 h-12 pl-6 pr-4 text-base border-0 focus:ring-0 focus:outline-none bg-white"
        />
        <Button 
          onClick={() => handleSearch()}
          className="h-12 px-6 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90 text-white rounded-none"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            {query.length === 0 && (
              <div className="px-4 py-2 text-sm font-semibold text-gray-500 border-b border-gray-100">
                Recent & Trending
              </div>
            )}
            
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-[var(--spiral-cream)] transition-colors group flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--spiral-coral)]/10 flex items-center justify-center">
                  {suggestion.icon || <Search className="h-4 w-4 text-[var(--spiral-coral)]" />}
                </div>
                
                <div className="flex-1">
                  <span className="text-[var(--spiral-navy)] group-hover:text-[var(--spiral-coral)] transition-colors">
                    {suggestion.text}
                  </span>
                  <div className="text-xs text-gray-500 capitalize">
                    {suggestion.type === 'recent' && 'Recent search'}
                    {suggestion.type === 'trending' && 'Trending'}
                    {suggestion.type === 'location' && 'Location'}
                    {suggestion.type === 'store' && 'Store'}
                    {suggestion.type === 'product' && 'Product'}
                  </div>
                </div>
              </button>
            ))}
            
            {query.length > 1 && (
              <button
                onClick={() => handleSearch()}
                className="w-full px-4 py-3 text-left hover:bg-[var(--spiral-cream)] transition-colors border-t border-gray-100 font-semibold text-[var(--spiral-coral)]"
              >
                <div className="flex items-center gap-3">
                  <Search className="h-4 w-4" />
                  Search for "{query}"
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}