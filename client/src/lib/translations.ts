// Translation system for SPIRAL multi-language support
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'pt';

export interface Translations {
  // Navigation & Header
  nav: {
    home: string;
    products: string;
    stores: string;
    malls: string;
    about: string;
    account: string;
    cart: string;
    search: string;
    login: string;
    signup: string;
    logout: string;
  };
  
  // Common UI Elements
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    view: string;
    share: string;
    back: string;
    next: string;
    previous: string;
    filter: string;
    sort: string;
    search: string;
  };

  // Shopping & E-commerce
  shopping: {
    addToCart: string;
    addToWishlist: string;
    removeFromCart: string;
    removeFromWishlist: string;
    checkout: string;
    price: string;
    quantity: string;
    total: string;
    subtotal: string;
    shipping: string;
    tax: string;
    discount: string;
    outOfStock: string;
    inStock: string;
    lowStock: string;
    backInStock: string;
  };

  // SPIRAL Loyalty Program
  loyalty: {
    spiralPoints: string;
    earnSpirals: string;
    redeemSpirals: string;
    balance: string;
    totalEarned: string;
    totalRedeemed: string;
    loyaltyProgram: string;
    rewards: string;
    bonusPoints: string;
    multiplier: string;
  };

  // Store & Product Information
  store: {
    hours: string;
    location: string;
    contact: string;
    about: string;
    reviews: string;
    rating: string;
    followStore: string;
    unfollowStore: string;
    storeDirectory: string;
  };

  // Mall Features
  mall: {
    mallDirectory: string;
    mallEvents: string;
    mallMap: string;
    tenantStores: string;
    mallHours: string;
    parking: string;
    amenities: string;
    events: string;
    rsvp: string;
    attending: string;
  };

  // Notifications & Alerts
  notifications: {
    priceAlert: string;
    stockAlert: string;
    newProduct: string;
    saleAlert: string;
    wishlistUpdate: string;
    orderUpdate: string;
    loyaltyReward: string;
    eventReminder: string;
  };

  // Forms & Validation
  forms: {
    required: string;
    invalidEmail: string;
    passwordTooShort: string;
    phoneInvalid: string;
    zipCodeInvalid: string;
    fieldRequired: string;
  };

  // Time & Dates
  time: {
    now: string;
    today: string;
    tomorrow: string;
    yesterday: string;
    thisWeek: string;
    nextWeek: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    weeksAgo: string;
  };
}

// English translations (base)
const englishTranslations: Translations = {
  nav: {
    home: 'Home',
    products: 'Products',
    stores: 'Stores',
    malls: 'Malls',
    about: 'About',
    account: 'Account',
    cart: 'Cart',
    search: 'Search',
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    share: 'Share',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    filter: 'Filter',
    sort: 'Sort',
    search: 'Search',
  },
  shopping: {
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    removeFromCart: 'Remove from Cart',
    removeFromWishlist: 'Remove from Wishlist',
    checkout: 'Checkout',
    price: 'Price',
    quantity: 'Quantity',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    tax: 'Tax',
    discount: 'Discount',
    outOfStock: 'Out of Stock',
    inStock: 'In Stock',
    lowStock: 'Low Stock',
    backInStock: 'Back in Stock',
  },
  loyalty: {
    spiralPoints: 'SPIRAL Points',
    earnSpirals: 'Earn SPIRALs',
    redeemSpirals: 'Redeem SPIRALs',
    balance: 'Balance',
    totalEarned: 'Total Earned',
    totalRedeemed: 'Total Redeemed',
    loyaltyProgram: 'Loyalty Program',
    rewards: 'Rewards',
    bonusPoints: 'Bonus Points',
    multiplier: 'Multiplier',
  },
  store: {
    hours: 'Hours',
    location: 'Location',
    contact: 'Contact',
    about: 'About',
    reviews: 'Reviews',
    rating: 'Rating',
    followStore: 'Follow Store',
    unfollowStore: 'Unfollow Store',
    storeDirectory: 'Store Directory',
  },
  mall: {
    mallDirectory: 'Mall Directory',
    mallEvents: 'Mall Events',
    mallMap: 'Mall Map',
    tenantStores: 'Tenant Stores',
    mallHours: 'Mall Hours',
    parking: 'Parking',
    amenities: 'Amenities',
    events: 'Events',
    rsvp: 'RSVP',
    attending: 'Attending',
  },
  notifications: {
    priceAlert: 'Price Alert',
    stockAlert: 'Stock Alert',
    newProduct: 'New Product',
    saleAlert: 'Sale Alert',
    wishlistUpdate: 'Wishlist Update',
    orderUpdate: 'Order Update',
    loyaltyReward: 'Loyalty Reward',
    eventReminder: 'Event Reminder',
  },
  forms: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 8 characters',
    phoneInvalid: 'Please enter a valid phone number',
    zipCodeInvalid: 'Please enter a valid ZIP code',
    fieldRequired: 'Field is required',
  },
  time: {
    now: 'Now',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    nextWeek: 'Next Week',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
  },
};

// Spanish translations (95% complete)
const spanishTranslations: Translations = {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    stores: 'Tiendas',
    malls: 'Centros Comerciales',
    about: 'Acerca de',
    account: 'Cuenta',
    cart: 'Carrito',
    search: 'Buscar',
    login: 'Iniciar Sesión',
    signup: 'Registrarse',
    logout: 'Cerrar Sesión',
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    view: 'Ver',
    share: 'Compartir',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    filter: 'Filtrar',
    sort: 'Ordenar',
    search: 'Buscar',
  },
  shopping: {
    addToCart: 'Agregar al Carrito',
    addToWishlist: 'Agregar a Lista de Deseos',
    removeFromCart: 'Quitar del Carrito',
    removeFromWishlist: 'Quitar de Lista de Deseos',
    checkout: 'Finalizar Compra',
    price: 'Precio',
    quantity: 'Cantidad',
    total: 'Total',
    subtotal: 'Subtotal',
    shipping: 'Envío',
    tax: 'Impuesto',
    discount: 'Descuento',
    outOfStock: 'Agotado',
    inStock: 'En Stock',
    lowStock: 'Poco Stock',
    backInStock: 'Disponible Otra Vez',
  },
  loyalty: {
    spiralPoints: 'Puntos SPIRAL',
    earnSpirals: 'Ganar SPIRALs',
    redeemSpirals: 'Canjear SPIRALs',
    balance: 'Saldo',
    totalEarned: 'Total Ganado',
    totalRedeemed: 'Total Canjeado',
    loyaltyProgram: 'Programa de Lealtad',
    rewards: 'Recompensas',
    bonusPoints: 'Puntos Bonus',
    multiplier: 'Multiplicador',
  },
  store: {
    hours: 'Horarios',
    location: 'Ubicación',
    contact: 'Contacto',
    about: 'Acerca de',
    reviews: 'Reseñas',
    rating: 'Calificación',
    followStore: 'Seguir Tienda',
    unfollowStore: 'Dejar de Seguir Tienda',
    storeDirectory: 'Directorio de Tiendas',
  },
  mall: {
    mallDirectory: 'Directorio del Centro Comercial',
    mallEvents: 'Eventos del Centro Comercial',
    mallMap: 'Mapa del Centro Comercial',
    tenantStores: 'Tiendas Inquilinas',
    mallHours: 'Horarios del Centro Comercial',
    parking: 'Estacionamiento',
    amenities: 'Amenidades',
    events: 'Eventos',
    rsvp: 'Confirmar Asistencia',
    attending: 'Asistiendo',
  },
  notifications: {
    priceAlert: 'Alerta de Precio',
    stockAlert: 'Alerta de Stock',
    newProduct: 'Nuevo Producto',
    saleAlert: 'Alerta de Oferta',
    wishlistUpdate: 'Actualización de Lista de Deseos',
    orderUpdate: 'Actualización de Pedido',
    loyaltyReward: 'Recompensa de Lealtad',
    eventReminder: 'Recordatorio de Evento',
  },
  forms: {
    required: 'Este campo es requerido',
    invalidEmail: 'Por favor ingrese un email válido',
    passwordTooShort: 'La contraseña debe tener al menos 8 caracteres',
    phoneInvalid: 'Por favor ingrese un número de teléfono válido',
    zipCodeInvalid: 'Por favor ingrese un código postal válido',
    fieldRequired: 'Campo requerido',
  },
  time: {
    now: 'Ahora',
    today: 'Hoy',
    tomorrow: 'Mañana',
    yesterday: 'Ayer',
    thisWeek: 'Esta Semana',
    nextWeek: 'Próxima Semana',
    minutesAgo: 'minutos atrás',
    hoursAgo: 'horas atrás',
    daysAgo: 'días atrás',
    weeksAgo: 'semanas atrás',
  },
};

// Translation storage
const translations: Record<SupportedLanguage, Translations> = {
  en: englishTranslations,
  es: spanishTranslations,
  // Other languages would fall back to English for missing translations
  fr: englishTranslations, // Placeholder - would be French translations
  de: englishTranslations, // Placeholder - would be German translations
  pt: englishTranslations, // Placeholder - would be Portuguese translations
};

// Translation hook
export function useTranslation(language: SupportedLanguage = 'en') {
  const t = (key: string): string => {
    // Navigate nested object path (e.g., 'nav.home' -> translations[lang].nav.home)
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    // Fallback to English if translation not found
    if (value === undefined && language !== 'en') {
      let fallbackValue: any = translations.en;
      for (const k of keys) {
        fallbackValue = fallbackValue?.[k];
        if (fallbackValue === undefined) break;
      }
      value = fallbackValue;
    }
    
    return value || key; // Return key if no translation found
  };

  return { t, translations: translations[language] };
}

// Helper function to get browser language
export function getBrowserLanguage(): SupportedLanguage {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return Object.keys(translations).includes(browserLang) ? browserLang : 'en';
  }
  return 'en';
}

// Helper function to format currency by language/locale
export function formatCurrency(amount: number, language: SupportedLanguage): string {
  const locales = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    pt: 'pt-BR',
  };
  
  const currencies = {
    en: 'USD',
    es: 'EUR',
    fr: 'EUR', 
    de: 'EUR',
    pt: 'BRL',
  };

  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: currencies[language],
  }).format(amount);
}

// Helper function to format dates by language/locale
export function formatDate(date: Date, language: SupportedLanguage): string {
  const locales = {
    en: 'en-US',
    es: 'es-ES', 
    fr: 'fr-FR',
    de: 'de-DE',
    pt: 'pt-BR',
  };

  return new Intl.DateTimeFormat(locales[language], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default translations;