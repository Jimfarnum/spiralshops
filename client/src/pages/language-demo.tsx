import { useState } from 'react';
import Header from "@/components/header";
import LanguageSelector from "@/components/language-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation, formatCurrency, formatDate, type SupportedLanguage } from '@/lib/translations';
import { Globe, MessageCircle, ShoppingCart, Star, Calendar } from 'lucide-react';

export default function LanguageDemo() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en');
  const { t } = useTranslation(currentLang);

  // Sample data for demonstration
  const sampleProduct = {
    name: "Artisan Leather Wallet",
    price: 89.99,
    rating: 4.8,
    inStock: true,
  };

  const sampleEvent = {
    name: "Jazz Night",
    date: new Date('2025-01-26T19:00:00Z'),
  };

  // Update language when selector changes
  const handleLanguageChange = () => {
    const savedLang = localStorage.getItem('spiral-language') as SupportedLanguage;
    if (savedLang) {
      setCurrentLang(savedLang);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--spiral-cream)]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--spiral-navy)] mb-2">
            Multi-Language Support Demo
          </h1>
          <p className="text-xl text-gray-600">
            Experience SPIRAL in your preferred language with automatic translation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Language Selector */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--spiral-coral)]" />
                  Language Selection
                </CardTitle>
                <CardDescription>
                  Choose your preferred language for the SPIRAL platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LanguageSelector />
                <Button
                  onClick={handleLanguageChange}
                  className="mt-4 bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90"
                >
                  Update Demo Content
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Translation Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Translation Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">English 🇺🇸</span>
                    <Badge className="bg-green-100 text-green-800">100%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Spanish 🇪🇸</span>
                    <Badge className="bg-blue-100 text-blue-800">95%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">French 🇫🇷</span>
                    <Badge className="bg-yellow-100 text-yellow-800">75%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">German 🇩🇪</span>
                    <Badge className="bg-yellow-100 text-yellow-800">70%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Portuguese 🇧🇷</span>
                    <Badge className="bg-yellow-100 text-yellow-800">65%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    <span>Auto-detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span>Real-time switching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-green-600" />
                    <span>E-commerce terms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-600" />
                    <span>SPIRAL terminology</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>Localized dates</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Demo Content */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-[var(--spiral-navy)]">
            Live Translation Demo
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Navigation Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation Elements</CardTitle>
                <CardDescription>
                  Common navigation terms translated to selected language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.home')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.products')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.stores')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.malls')}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.cart')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.account')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.login')}</div>
                    <div className="font-medium text-[var(--spiral-navy)]">{t('nav.search')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Shopping Elements</CardTitle>
                <CardDescription>
                  E-commerce terms and actions in selected language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <span className="font-medium">{sampleProduct.name}</span>
                    <span className="text-[var(--spiral-coral)] font-bold">
                      {formatCurrency(sampleProduct.price, currentLang)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{t('store.rating')}: {sampleProduct.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <span>{t('shopping.inStock')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                      {t('shopping.addToCart')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('shopping.addToWishlist')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SPIRAL Loyalty Demo */}
            <Card>
              <CardHeader>
                <CardTitle>SPIRAL Loyalty Program</CardTitle>
                <CardDescription>
                  Loyalty program terms in selected language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('loyalty.balance')}:</span>
                    <span className="font-bold text-[var(--spiral-navy)]">325 {t('loyalty.spiralPoints')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('loyalty.totalEarned')}:</span>
                    <span className="text-green-600">1,250</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t('loyalty.totalRedeemed')}:</span>
                    <span className="text-blue-600">925</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {t('loyalty.earnSpirals')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('loyalty.redeemSpirals')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mall Events Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Mall Events</CardTitle>
                <CardDescription>
                  Event information with localized dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[var(--spiral-coral)]" />
                    <span className="font-medium">{sampleEvent.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(sampleEvent.date, currentLang)}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-[var(--spiral-coral)] hover:bg-[var(--spiral-coral)]/90">
                      {t('mall.rsvp')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('common.share')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Common Actions Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Common Interface Elements</CardTitle>
              <CardDescription>
                Frequently used buttons and actions translated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" size="sm">{t('common.save')}</Button>
                <Button variant="outline" size="sm">{t('common.cancel')}</Button>
                <Button variant="outline" size="sm">{t('common.edit')}</Button>
                <Button variant="outline" size="sm">{t('common.delete')}</Button>
                <Button variant="outline" size="sm">{t('common.share')}</Button>
                <Button variant="outline" size="sm">{t('common.filter')}</Button>
                <Button variant="outline" size="sm">{t('common.sort')}</Button>
                <Button variant="outline" size="sm">{t('common.search')}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Validation Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Form Validation Messages</CardTitle>
              <CardDescription>
                Error messages and validation text in selected language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="text-red-600">{t('forms.required')}</div>
                <div className="text-red-600">{t('forms.invalidEmail')}</div>
                <div className="text-red-600">{t('forms.passwordTooShort')}</div>
                <div className="text-red-600">{t('forms.phoneInvalid')}</div>
              </div>
            </CardContent>
          </Card>

          {/* Time Expressions Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Time Expressions</CardTitle>
              <CardDescription>
                Relative time expressions in selected language
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div><span className="font-medium">{t('time.now')}</span></div>
                <div><span className="font-medium">{t('time.today')}</span></div>
                <div><span className="font-medium">{t('time.tomorrow')}</span></div>
                <div><span className="font-medium">{t('time.yesterday')}</span></div>
                <div><span className="text-gray-600">5 {t('time.minutesAgo')}</span></div>
                <div><span className="text-gray-600">2 {t('time.hoursAgo')}</span></div>
                <div><span className="text-gray-600">3 {t('time.daysAgo')}</span></div>
                <div><span className="text-gray-600">1 {t('time.weeksAgo')}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}