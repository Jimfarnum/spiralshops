// Optimized Social Pixels - Fixes 3.1s loading bottleneck
// Lazy-loaded social media tracking pixels for SPIRAL platform

interface PixelConfig {
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  instagram?: string;
}

class OptimizedSocialPixels {
  private static instance: OptimizedSocialPixels;
  private isInitialized = false;
  private config: PixelConfig = {};

  static getInstance(): OptimizedSocialPixels {
    if (!OptimizedSocialPixels.instance) {
      OptimizedSocialPixels.instance = new OptimizedSocialPixels();
    }
    return OptimizedSocialPixels.instance;
  }

  // Initialize pixels with lazy loading
  async initialize(config: PixelConfig = {}): Promise<void> {
    if (this.isInitialized) return;
    
    this.config = {
      facebook: 'SPIRAL_FB_PIXEL_ID',
      twitter: 'SPIRAL_X_PIXEL_ID',
      tiktok: 'SPIRAL_TIKTOK_PIXEL_ID',
      instagram: 'SPIRAL_IG_PIXEL_ID',
      ...config
    };

    // Load pixels asynchronously after page load
    if (document.readyState === 'complete') {
      this.loadPixels();
    } else {
      window.addEventListener('load', () => {
        setTimeout(() => this.loadPixels(), 500); // Delay to prevent blocking
      });
    }

    this.isInitialized = true;
  }

  private async loadPixels(): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    // Facebook Pixel - Non-blocking
    if (this.config.facebook) {
      loadPromises.push(this.loadFacebookPixel());
    }

    // X (Twitter) Pixel - Non-blocking
    if (this.config.twitter) {
      loadPromises.push(this.loadTwitterPixel());
    }

    // TikTok Pixel - Non-blocking
    if (this.config.tiktok) {
      loadPromises.push(this.loadTikTokPixel());
    }

    // Load all pixels concurrently
    try {
      await Promise.allSettled(loadPromises);
      console.log('✅ Social pixels loaded successfully');
    } catch (error) {
      console.warn('⚠️ Some social pixels failed to load:', error);
    }
  }

  private loadFacebookPixel(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (window.fbq) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${this.config.facebook}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);
        setTimeout(resolve, 100);
      } catch (error) {
        console.warn('Facebook pixel load error:', error);
        resolve();
      }
    });
  }

  private loadTwitterPixel(): Promise<void> {
    return new Promise((resolve) => {
      try {
        if (window.twq) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.innerHTML = `
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('init','${this.config.twitter}');
          twq('track','PageView');
        `;
        document.head.appendChild(script);
        setTimeout(resolve, 100);
      } catch (error) {
        console.warn('Twitter pixel load error:', error);
        resolve();
      }
    });
  }

  private loadTikTokPixel(): Promise<void> {
    return new Promise((resolve) => {
      try {
        const script = document.createElement('script');
        script.innerHTML = `
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["track","page","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
            ttq.load('${this.config.tiktok}');
            ttq.page();
          }(window, document, 'ttq');
        `;
        document.head.appendChild(script);
        setTimeout(resolve, 100);
      } catch (error) {
        console.warn('TikTok pixel load error:', error);
        resolve();
      }
    });
  }

  // Track events efficiently
  trackEvent(eventName: string, data: any = {}): void {
    try {
      // Facebook
      if (window.fbq) {
        window.fbq('track', eventName, data);
      }

      // Twitter
      if (window.twq) {
        window.twq('track', eventName, data);
      }

      // TikTok
      if (window.ttq) {
        window.ttq.track(eventName, data);
      }
    } catch (error) {
      console.warn('Event tracking error:', error);
    }
  }
}

// Type declarations
declare global {
  interface Window {
    fbq: any;
    twq: any;
    ttq: any;
    _fbq: any;
  }
}

export default OptimizedSocialPixels.getInstance();