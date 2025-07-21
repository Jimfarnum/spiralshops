import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Globe, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  enabled: boolean;
  completeness: number; // Percentage of translations completed
}

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
  compact?: boolean;
  className?: string;
}

const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    enabled: true,
    completeness: 100
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    enabled: true,
    completeness: 95
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    enabled: false,
    completeness: 60
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    enabled: false,
    completeness: 45
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    enabled: false,
    completeness: 30
  }
];

export default function LanguageSelector({ 
  onLanguageChange, 
  currentLanguage = 'en', 
  compact = false, 
  className = '' 
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const { toast } = useToast();

  const enabledLanguages = supportedLanguages.filter(lang => lang.enabled);
  const currentLang = supportedLanguages.find(lang => lang.code === selectedLanguage) || supportedLanguages[0];

  const handleLanguageChange = (langCode: string) => {
    const language = supportedLanguages.find(lang => lang.code === langCode);
    
    if (!language) return;
    
    if (!language.enabled) {
      toast({
        title: "Language Not Available",
        description: `${language.name} support is coming soon! Currently ${language.completeness}% translated.`,
        variant: "default",
        duration: 3000
      });
      return;
    }

    setSelectedLanguage(langCode);
    localStorage.setItem('spiral-language', langCode);
    
    if (onLanguageChange) {
      onLanguageChange(langCode);
    }

    toast({
      title: "Language Changed",
      description: `Interface language changed to ${language.name}`,
      duration: 2000
    });
  };

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('spiral-language');
    if (savedLanguage && supportedLanguages.find(lang => lang.code === savedLanguage)) {
      setSelectedLanguage(savedLanguage);
      if (onLanguageChange) {
        onLanguageChange(savedLanguage);
      }
    }
  }, [onLanguageChange]);

  if (compact) {
    return (
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-auto min-w-[120px] ${className}`}>
          <div className="flex items-center gap-2">
            <span>{currentLang.flag}</span>
            <SelectValue>
              {currentLang.nativeName}
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map(language => (
            <SelectItem 
              key={language.code} 
              value={language.code}
              disabled={!language.enabled}
            >
              <div className="flex items-center gap-3 w-full">
                <span>{language.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{language.nativeName}</span>
                    {language.code === selectedLanguage && <Check className="h-4 w-4 text-green-600" />}
                  </div>
                  {!language.enabled && (
                    <div className="text-xs text-gray-500">
                      {language.completeness}% complete
                    </div>
                  )}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2 font-['Poppins']">
          <Globe className="h-5 w-5" />
          Language Settings
        </CardTitle>
        <CardDescription className="font-['Inter']">
          Choose your preferred language for the SPIRAL interface
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Language Display */}
        <div className="p-4 bg-[var(--spiral-sage)]/10 rounded-lg border border-[var(--spiral-sage)]/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{currentLang.flag}</span>
            <div>
              <div className="font-semibold text-[var(--spiral-navy)]">{currentLang.nativeName}</div>
              <div className="text-sm text-gray-600">{currentLang.name}</div>
            </div>
            <Badge className="ml-auto bg-green-100 text-green-800">
              Current
            </Badge>
          </div>
        </div>

        {/* Language Options */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 font-['Poppins']">Available Languages</h4>
          <div className="space-y-2">
            {supportedLanguages.map(language => (
              <div 
                key={language.code}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                  language.enabled 
                    ? 'hover:bg-gray-50 cursor-pointer' 
                    : 'bg-gray-50 cursor-not-allowed opacity-60'
                } ${
                  language.code === selectedLanguage 
                    ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5' 
                    : 'border-gray-200'
                }`}
                onClick={() => language.enabled && handleLanguageChange(language.code)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{language.flag}</span>
                  <div>
                    <div className="font-medium text-gray-900">{language.nativeName}</div>
                    <div className="text-sm text-gray-600">{language.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {language.enabled ? (
                    <Badge className="bg-green-100 text-green-800">
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      {language.completeness}%
                    </Badge>
                  )}
                  {language.code === selectedLanguage && (
                    <Check className="h-4 w-4 text-[var(--spiral-coral)]" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900 mb-1">More Languages Coming Soon</div>
              <div className="text-sm text-blue-700">
                We're working hard to bring SPIRAL to more communities. 
                French, German, and Portuguese support are in development!
              </div>
            </div>
          </div>
        </div>

        {/* Auto-detection Toggle */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto-detect Language</div>
              <div className="text-sm text-gray-600">Automatically set language based on browser</div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const browserLang = navigator.language.split('-')[0];
                const matchedLang = supportedLanguages.find(lang => 
                  lang.code === browserLang && lang.enabled
                );
                
                if (matchedLang) {
                  handleLanguageChange(matchedLang.code);
                } else {
                  toast({
                    title: "Browser Language Not Supported",
                    description: "Your browser language is not yet available. Using English.",
                    duration: 3000
                  });
                }
              }}
            >
              Auto-Detect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Translation helper functions
export const translations = {
  en: {
    // Navigation
    'nav.discover': 'Discover',
    'nav.products': 'Products',
    'nav.malls': 'Shopping Malls',
    'nav.community': 'Community',
    'nav.about': 'About',
    'nav.retailers': 'For Retailers',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.wishlist': 'Wishlist',
    'nav.signIn': 'Sign In',
    'nav.signUp': 'Sign Up',
    
    // Common actions
    'action.addToCart': 'Add to Cart',
    'action.buyNow': 'Buy Now',
    'action.saveForLater': 'Save for Later',
    'action.share': 'Share',
    'action.viewDetails': 'View Details',
    'action.search': 'Search',
    'action.filter': 'Filter',
    'action.sort': 'Sort',
    
    // Product status
    'product.inStock': 'In Stock',
    'product.lowStock': 'Low Stock',
    'product.outOfStock': 'Out of Stock',
    'product.freeShipping': 'Free Shipping',
    
    // Messages
    'message.addedToCart': 'Added to cart successfully',
    'message.addedToWishlist': 'Saved to wishlist',
    'message.removedFromWishlist': 'Removed from wishlist',
    'message.noResults': 'No results found',
    'message.loading': 'Loading...',
    
    // Tagline
    'tagline': 'Everything Local. Just for You.'
  },
  es: {
    // Navigation
    'nav.discover': 'Descubrir',
    'nav.products': 'Productos',
    'nav.malls': 'Centros Comerciales',
    'nav.community': 'Comunidad',
    'nav.about': 'Acerca de',
    'nav.retailers': 'Para Minoristas',
    'nav.cart': 'Carrito',
    'nav.profile': 'Perfil',
    'nav.wishlist': 'Lista de Deseos',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signUp': 'Registrarse',
    
    // Common actions
    'action.addToCart': 'Agregar al Carrito',
    'action.buyNow': 'Comprar Ahora',
    'action.saveForLater': 'Guardar para Después',
    'action.share': 'Compartir',
    'action.viewDetails': 'Ver Detalles',
    'action.search': 'Buscar',
    'action.filter': 'Filtrar',
    'action.sort': 'Ordenar',
    
    // Product status
    'product.inStock': 'En Stock',
    'product.lowStock': 'Stock Bajo',
    'product.outOfStock': 'Agotado',
    'product.freeShipping': 'Envío Gratis',
    
    // Messages
    'message.addedToCart': 'Agregado al carrito exitosamente',
    'message.addedToWishlist': 'Guardado en lista de deseos',
    'message.removedFromWishlist': 'Eliminado de lista de deseos',
    'message.noResults': 'No se encontraron resultados',
    'message.loading': 'Cargando...',
    
    // Tagline
    'tagline': 'Todo Local. Solo para Ti.'
  }
};

// Translation function
export const t = (key: string, lang: string = 'en'): string => {
  const langTranslations = translations[lang as keyof typeof translations] || translations.en;
  return langTranslations[key as keyof typeof langTranslations] || key;
};