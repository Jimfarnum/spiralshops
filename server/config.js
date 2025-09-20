// Simple configuration for SPIRAL deployment bundle
export const cfg = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  mallId: process.env.DEFAULT_MALL_ID || 'demo',
  memCache: 30, // seconds
};

export function loadMallTheme(mallId) {
  // Basic theme configuration
  const themes = {
    'rosedale-mn': { primaryColor: '#2563eb', name: 'Rosedale Center' },
    'southdale-mn': { primaryColor: '#059669', name: 'Southdale Center' },
    'ridgedale-mn': { primaryColor: '#dc2626', name: 'Ridgedale Center' },
    'demo': { primaryColor: '#007B8A', name: 'SPIRAL Demo' }
  };
  
  return themes[mallId] || themes.demo;
}