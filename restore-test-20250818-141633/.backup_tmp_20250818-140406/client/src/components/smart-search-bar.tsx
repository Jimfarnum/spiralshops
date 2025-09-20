import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Clock, TrendingUp, X, Sparkles } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchSuggestion {
  text: string;
  type: 'product' | 'category' | 'popular';
}

interface SmartSearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  className?: string;
  userId?: string;
}

export default function SmartSearchBar({ 
  onSearch, 
  onSuggestionSelect,
  placeholder = "Search products, stores, or categories...",
  showSuggestions = true,
  className = "",
  userId
}: SmartSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['/api/search/suggestions', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      
      const response = await fetch(`/api/search/suggestions?query=${encodeURIComponent(debouncedQuery)}&limit=8`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const results = await response.json() as string[];
      
      return results.map(text => ({
        text,
        type: getSearchSuggestionType(text)
      })) as SearchSuggestion[];
    },
    enabled: showSuggestions && debouncedQuery.length >= 2,
    staleTime: 30000, // 30 seconds
  });

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSuggestionSelect?.(suggestion);
    handleSearch(suggestion);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions || !isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : -1
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > -1 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex].text);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [selectedIndex]);

  // Determine suggestion type for styling
  const getSearchSuggestionType = (text: string): SearchSuggestion['type'] => {
    const popularTerms = ['Coffee', 'Jewelry', 'Books', 'Clothing', 'Electronics', 'Food', 'Home', 'Beauty'];
    if (popularTerms.includes(text)) return 'popular';
    if (text.includes('-')) return 'product';
    return 'category';
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Search className="h-4 w-4 text-gray-400" />;
      case 'popular':
        return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'category':
        return <MapPin className="h-4 w-4 text-blue-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-12 py-3 text-base border-2 border-gray-200 focus:border-[#006d77] rounded-lg"
        />

        {/* AI Badge */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
        </div>

        {/* Clear/Search Button */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {query ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearch()}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Search className="h-4 w-4 text-gray-400" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && isOpen && (query.length >= 2 || suggestions) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-[#006d77] border-t-transparent rounded-full" />
                Searching...
              </div>
            </div>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  ref={(el) => (suggestionRefs.current[index] = el)}
                  className={`px-4 py-2 cursor-pointer flex items-center gap-3 hover:bg-gray-50 ${
                    selectedIndex === index ? 'bg-[#006d77]/10 border-l-2 border-[#006d77]' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="text-gray-700">{suggestion.text}</span>
                  {suggestion.type === 'popular' && (
                    <Badge variant="outline" className="ml-auto text-xs">Popular</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {suggestions && suggestions.length === 0 && !isLoading && query.length >= 2 && (
            <div className="p-3 text-center text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                No suggestions found
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlay to close suggestions */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}