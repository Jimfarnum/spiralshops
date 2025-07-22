import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Globe, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  completionRate: number;
}

interface LanguageSelectorProps {
  compact?: boolean;
  showProgress?: boolean;
}

export default function LanguageSelector({ compact = false, showProgress = false }: LanguageSelectorProps) {
  const { toast } = useToast();
  
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isChanging, setIsChanging] = useState(false);

  const languages: Language[] = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      completionRate: 100
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      completionRate: 95
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      completionRate: 85
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      completionRate: 80
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      completionRate: 75
    }
  ];

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('spiral-language') || 'en';
    setCurrentLanguage(savedLanguage);
    
    // Apply language to document
    document.documentElement.lang = savedLanguage;
    
    // Auto-detect browser language if not set
    if (!localStorage.getItem('spiral-language')) {
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = languages.find(lang => lang.code === browserLang);
      if (supportedLang) {
        setCurrentLanguage(browserLang);
        localStorage.setItem('spiral-language', browserLang);
        document.documentElement.lang = browserLang;
      }
    }
  }, []);

  const handleLanguageChange = async (languageCode: string) => {
    setIsChanging(true);
    
    // Simulate loading time for language switch
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setCurrentLanguage(languageCode);
    localStorage.setItem('spiral-language', languageCode);
    document.documentElement.lang = languageCode;
    
    const selectedLanguage = languages.find(lang => lang.code === languageCode);
    
    toast({
      title: selectedLanguage?.code === 'es' ? "Idioma cambiado" : "Language changed",
      description: selectedLanguage?.code === 'es' 
        ? `Cambiado a ${selectedLanguage.nativeName}` 
        : `Switched to ${selectedLanguage?.nativeName}`,
    });
    
    setIsChanging(false);
    
    // Trigger page refresh to apply language changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Select value={currentLanguage} onValueChange={handleLanguageChange} disabled={isChanging}>
          <SelectTrigger className="w-auto min-w-[100px] h-8 text-xs">
            <div className="flex items-center gap-1">
              <span>{currentLang?.flag}</span>
              <span className="hidden sm:inline">{currentLang?.code.toUpperCase()}</span>
            </div>
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center gap-2">
                  <span>{language.flag}</span>
                  <span>{language.nativeName}</span>
                  {language.completionRate < 100 && showProgress && (
                    <Badge variant="secondary" className="text-xs">
                      {language.completionRate}%
                    </Badge>
                  )}
                  {language.code === currentLanguage && (
                    <Check className="h-3 w-3 text-green-600" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {isChanging && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--spiral-coral)]"></div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="h-5 w-5 text-[var(--spiral-coral)]" />
        <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
          {currentLanguage === 'es' ? 'Seleccionar Idioma' : 'Language Selection'}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={language.code === currentLanguage ? "default" : "outline"}
            className={`justify-start h-auto p-4 ${
              language.code === currentLanguage 
                ? 'bg-[var(--spiral-coral)] text-white' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isChanging}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-2xl">{language.flag}</span>
              <div className="flex-1 text-left">
                <div className="font-medium">{language.nativeName}</div>
                <div className="text-xs opacity-75">{language.name}</div>
                {showProgress && language.completionRate < 100 && (
                  <div className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {language.completionRate}% Complete
                    </Badge>
                  </div>
                )}
              </div>
              {language.code === currentLanguage && (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
          </Button>
        ))}
      </div>
      
      {isChanging && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--spiral-coral)]"></div>
          {currentLanguage === 'es' ? 'Cambiando idioma...' : 'Changing language...'}
        </div>
      )}
      
      {showProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 mb-2">
            {currentLanguage === 'es' ? 'Estado de Traducción' : 'Translation Status'}
          </h4>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language.code} className="flex items-center justify-between">
                <span className="text-sm">
                  {language.flag} {language.nativeName}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${language.completionRate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8">
                    {language.completionRate}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}