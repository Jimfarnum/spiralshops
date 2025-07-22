import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Globe, Check } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  progress: number; // translation completion percentage
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    progress: 100
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    progress: 95
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    progress: 75
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    progress: 70
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    progress: 65
  }
];

interface LanguageSelectorProps {
  compact?: boolean;
  showProgress?: boolean;
}

export default function LanguageSelector({ compact = false, showProgress = true }: LanguageSelectorProps) {
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [isDetecting, setIsDetecting] = useState(false);

  // Auto-detect browser language on first load
  useEffect(() => {
    const saved = localStorage.getItem('spiral-language');
    if (saved) {
      setCurrentLanguage(saved);
    } else {
      // Auto-detect from browser
      const browserLang = navigator.language.split('-')[0];
      const supportedLang = languages.find(lang => lang.code === browserLang);
      if (supportedLang) {
        setCurrentLanguage(browserLang);
        localStorage.setItem('spiral-language', browserLang);
      }
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (!language) return;

    setCurrentLanguage(languageCode);
    localStorage.setItem('spiral-language', languageCode);
    
    // Update HTML lang attribute
    document.documentElement.lang = languageCode;

    // Show confirmation toast
    toast({
      title: `Language changed to ${language.name}`,
      description: language.progress < 100 
        ? `Translation is ${language.progress}% complete. Some text may appear in English.`
        : 'All text will now appear in your selected language.',
      duration: 4000,
    });

    // In a real app, this would trigger a translation system
    console.log('Language changed to:', languageCode);
  };

  const detectLanguage = async () => {
    setIsDetecting(true);
    
    // Simulate language detection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const browserLang = navigator.language.split('-')[0];
    const supportedLang = languages.find(lang => lang.code === browserLang);
    
    if (supportedLang && supportedLang.code !== currentLanguage) {
      handleLanguageChange(supportedLang.code);
      toast({
        title: 'Language Auto-Detected',
        description: `Switched to ${supportedLang.name} based on your browser settings`,
        duration: 4000,
      });
    } else {
      toast({
        title: 'Language Detection Complete',
        description: 'Your current language setting is already optimal',
        duration: 3000,
      });
    }
    
    setIsDetecting(false);
  };

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-lg">{currentLang.flag}</span>
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span>{language.flag}</span>
                <span>{language.name}</span>
              </div>
              {language.code === currentLanguage && (
                <Check className="h-4 w-4 text-[var(--spiral-coral)]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--spiral-navy)]">
          Language Preferences
        </h3>
        <Button
          onClick={detectLanguage}
          disabled={isDetecting}
          variant="outline"
          size="sm"
        >
          <Globe className={`h-4 w-4 mr-2 ${isDetecting ? 'animate-spin' : ''}`} />
          {isDetecting ? 'Detecting...' : 'Auto-Detect'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {languages.map((language) => (
          <div
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              language.code === currentLanguage
                ? 'border-[var(--spiral-coral)] bg-[var(--spiral-coral)]/5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{language.flag}</span>
                <div>
                  <div className="font-medium text-[var(--spiral-navy)]">
                    {language.nativeName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language.name}
                  </div>
                </div>
              </div>
              {language.code === currentLanguage && (
                <Check className="h-5 w-5 text-[var(--spiral-coral)]" />
              )}
            </div>

            {showProgress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Translation Progress</span>
                  <span className={`font-medium ${
                    language.progress === 100 ? 'text-green-600' : 
                    language.progress >= 90 ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {language.progress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      language.progress === 100 ? 'bg-green-500' :
                      language.progress >= 90 ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}
                    style={{ width: `${language.progress}%` }}
                  />
                </div>
                {language.progress < 100 && (
                  <div className="text-xs text-gray-500">
                    Some content may appear in English
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Translation Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Multi-Language Support
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              SPIRAL is available in multiple languages. We're continuously improving our translations 
              to provide the best local shopping experience.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {languages.map((lang) => (
                <Badge 
                  key={lang.code}
                  variant="outline"
                  className={`text-xs ${
                    lang.progress === 100 ? 'border-green-200 bg-green-50 text-green-700' :
                    lang.progress >= 90 ? 'border-blue-200 bg-blue-50 text-blue-700' :
                    'border-yellow-200 bg-yellow-50 text-yellow-700'
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()} - {lang.progress}%
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}