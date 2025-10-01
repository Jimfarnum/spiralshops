import fetch from "node-fetch";
import { URL } from "url";
import { isIP } from "net";

export const PLACEHOLDER_URL = "/api/placeholder/300/200";
export const BACKUP_PLACEHOLDER = "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=Product+Image";

// Security configuration
const ALLOWED_SCHEMES = ['http:', 'https:'];
const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10MB
const STRICT_TIMEOUT_MS = 3000; // Reduced from 5000ms

// Trusted CDN domains (allowlist approach)
const TRUSTED_CDN_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'cdn.shopify.com',
  'img.freepik.com',
  'images.pexels.com',
  's3.amazonaws.com',
  'cloudfront.net',
  'googleapis.com',
  'gstatic.com'
];

interface SecurityValidationResult {
  isAllowed: boolean;
  reason?: string;
  hostname?: string;
  ip?: string;
}

/**
 * Check if an IP address is private, link-local, or otherwise restricted
 */
function isPrivateOrRestrictedIP(ip: string): boolean {
  const ipType = isIP(ip);
  if (!ipType) return false;

  if (ipType === 4) {
    // IPv4 restricted ranges
    const parts = ip.split('.').map(Number);
    const [a, b, c, d] = parts;
    
    // Check various restricted ranges
    return (
      // Localhost (127.0.0.0/8)
      a === 127 ||
      // Private networks (RFC 1918)
      a === 10 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      // Link-local (169.254.0.0/16)
      (a === 169 && b === 254) ||
      // Multicast (224.0.0.0/4)
      (a >= 224 && a <= 239) ||
      // Reserved/broadcast
      a === 0 || a >= 240 ||
      // CGNAT (100.64.0.0/10)
      (a === 100 && b >= 64 && b <= 127) ||
      // AWS metadata service
      (a === 169 && b === 254 && c === 169 && d === 254)
    );
  } else if (ipType === 6) {
    // IPv6 restricted ranges
    const lowerIP = ip.toLowerCase();
    return (
      // Localhost
      lowerIP === '::1' ||
      // Link-local (fe80::/10)
      lowerIP.startsWith('fe80:') ||
      // Unique local (fc00::/7)
      lowerIP.startsWith('fc') ||
      lowerIP.startsWith('fd') ||
      // Multicast (ff00::/8)
      lowerIP.startsWith('ff')
    );
  }
  
  return false;
}

/**
 * Resolve hostname to IP address and validate it's not restricted
 */
async function validateHostname(hostname: string): Promise<SecurityValidationResult> {
  // Check if hostname is an IP address directly
  if (isIP(hostname)) {
    if (isPrivateOrRestrictedIP(hostname)) {
      return {
        isAllowed: false,
        reason: 'Direct IP access to private/restricted ranges is not allowed',
        ip: hostname
      };
    }
    return { isAllowed: true, ip: hostname };
  }

  // Check against trusted CDN allowlist
  const isTrustedCDN = TRUSTED_CDN_DOMAINS.some(domain => 
    hostname === domain || hostname.endsWith('.' + domain)
  );
  
  if (isTrustedCDN) {
    return { isAllowed: true, hostname };
  }

  try {
    // Use DNS lookup to resolve hostname to IP
    const dns = await import('dns').then(module => module.promises);
    const addresses = await Promise.race([
      dns.resolve4(hostname),
      dns.resolve6(hostname).catch(() => [])
    ]);

    // Check if any resolved IP is restricted
    for (const ip of addresses) {
      if (isPrivateOrRestrictedIP(ip)) {
        return {
          isAllowed: false,
          reason: `Hostname resolves to private/restricted IP: ${ip}`,
          hostname,
          ip
        };
      }
    }

    return { isAllowed: true, hostname };
  } catch (error) {
    return {
      isAllowed: false,
      reason: `DNS resolution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      hostname
    };
  }
}

/**
 * Comprehensive URL security validation
 */
async function validateUrlSecurity(urlString: string): Promise<SecurityValidationResult> {
  let parsedUrl: URL;
  
  try {
    parsedUrl = new URL(urlString);
  } catch (error) {
    return {
      isAllowed: false,
      reason: 'Invalid URL format'
    };
  }

  // Check allowed schemes
  if (!ALLOWED_SCHEMES.includes(parsedUrl.protocol)) {
    return {
      isAllowed: false,
      reason: `Unsupported protocol: ${parsedUrl.protocol}. Only HTTP/HTTPS allowed.`
    };
  }

  // Validate hostname
  return await validateHostname(parsedUrl.hostname);
}

interface ImageValidationResult {
  url: string;
  isValid: boolean;
  wasHealed: boolean;
  originalUrl?: string;
}

/**
 * Validates an image URL and provides fallbacks if invalid
 * Now includes comprehensive SSRF protection
 */
export async function validateAndHealImageUrl(
  imageUrl: string | null | undefined,
  timeoutMs: number = STRICT_TIMEOUT_MS
): Promise<ImageValidationResult> {
  // Handle missing or empty URLs
  if (!imageUrl || imageUrl.trim() === '') {
    return {
      url: PLACEHOLDER_URL,
      isValid: true,
      wasHealed: true,
      originalUrl: imageUrl || undefined
    };
  }

  // Don't validate local placeholders - assume they work
  if (imageUrl.startsWith('/api/placeholder')) {
    return {
      url: imageUrl,
      isValid: true,
      wasHealed: false
    };
  }

  // Only allow via.placeholder.com for external placeholders
  if (imageUrl.includes('placeholder') && !imageUrl.includes('via.placeholder.com')) {
    console.warn(`Blocked untrusted placeholder URL: ${imageUrl}`);
    return {
      url: PLACEHOLDER_URL,
      isValid: false,
      wasHealed: true,
      originalUrl: imageUrl
    };
  }

  try {
    // SECURITY: Comprehensive URL validation before making any requests
    const securityCheck = await validateUrlSecurity(imageUrl);
    if (!securityCheck.isAllowed) {
      console.error(`SECURITY: Blocked URL ${imageUrl} - ${securityCheck.reason}`);
      return {
        url: PLACEHOLDER_URL,
        isValid: false,
        wasHealed: true,
        originalUrl: imageUrl
      };
    }

    // Create abort controller with strict timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    // Make secure HTTP request with additional protections
    const response = await fetch(imageUrl, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'SPIRAL-Image-Validator/1.0',
        'Accept': 'image/*',
        'Cache-Control': 'no-cache'
      },
      // Additional security headers
      redirect: 'manual', // Don't follow redirects to prevent bypass
      size: MAX_RESPONSE_SIZE
    });
    
    clearTimeout(timeoutId);
    
    // Check for redirects (which we blocked)
    if (response.status >= 300 && response.status < 400) {
      console.warn(`SECURITY: Blocked redirect from ${imageUrl} to ${response.headers.get('location')}`);
      return {
        url: PLACEHOLDER_URL,
        isValid: false,
        wasHealed: true,
        originalUrl: imageUrl
      };
    }
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
      // Verify it's actually an image
      if (contentType && contentType.startsWith('image/')) {
        // Check content length if provided
        if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
          console.warn(`Image too large: ${imageUrl} (${contentLength} bytes)`);
          return {
            url: PLACEHOLDER_URL,
            isValid: false,
            wasHealed: true,
            originalUrl: imageUrl
          };
        }
        
        return {
          url: imageUrl,
          isValid: true,
          wasHealed: false
        };
      } else {
        console.warn(`Invalid content type for ${imageUrl}: ${contentType}`);
      }
    } else {
      console.warn(`Image validation failed for ${imageUrl}: HTTP ${response.status}`);
    }
    
  } catch (error) {
    if (error instanceof Error) {
      // Check for specific security-related errors
      if (error.name === 'AbortError') {
        console.warn(`Request timeout for ${imageUrl}`);
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        console.warn(`Network error for ${imageUrl}: ${error.message}`);
      } else {
        console.error(`Image validation error for ${imageUrl}:`, error.message);
      }
    } else {
      console.error(`Unknown error validating ${imageUrl}:`, error);
    }
  }
  
  // Use fallback for any failure
  return {
    url: PLACEHOLDER_URL,
    isValid: false,
    wasHealed: true,
    originalUrl: imageUrl
  };
}

/**
 * Heals multiple image URLs in parallel with security protections
 */
export async function validateAndHealMultipleImages<T extends { image_url?: string; image?: string; images?: string[] }>(
  items: T[],
  maxConcurrent: number = 5 // Reduced from 10 for security
): Promise<T[]> {
  const processItem = async (item: T): Promise<T> => {
    // Determine which image field to use
    const imageUrl = item.image_url || item.image || (item.images && item.images[0]);
    
    const result = await validateAndHealImageUrl(imageUrl, STRICT_TIMEOUT_MS);
    
    // Update the item with the healed URL
    return {
      ...item,
      image_url: result.url,
      // Preserve original fields for backward compatibility
      image: item.image || result.url
    };
  };

  // Process in smaller batches to prevent resource exhaustion
  const results: T[] = [];
  for (let i = 0; i < items.length; i += maxConcurrent) {
    const batch = items.slice(i, i + maxConcurrent);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
    
    // Add small delay between batches to prevent rate limiting/DoS
    if (i + maxConcurrent < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

/**
 * Generate image healing report for diagnostics
 */
export function generateImageReport(items: Array<{ name?: string; id?: string | number; image_url?: string }>) {
  const report = {
    timestamp: new Date().toISOString(),
    total: items.length,
    stats: {
      valid: 0,
      placeholders: 0,
      missing: 0,
      blocked: 0
    },
    security: {
      trustedCDNs: TRUSTED_CDN_DOMAINS.length,
      timeoutMs: STRICT_TIMEOUT_MS,
      maxSizeMB: MAX_RESPONSE_SIZE / (1024 * 1024)
    },
    issues: [] as Array<{ id: string | number; name: string; issue: string; url?: string }>
  };

  items.forEach((item) => {
    const url = item.image_url;
    const id = item.id || 'unknown';
    const name = item.name || `Item ${id}`;

    if (!url) {
      report.stats.missing++;
      report.issues.push({ id, name, issue: 'Missing image URL' });
    } else if (url.includes('placeholder')) {
      report.stats.placeholders++;
    } else if (url === PLACEHOLDER_URL) {
      report.stats.blocked++;
      report.issues.push({ id, name, issue: 'URL was blocked by security measures' });
    } else {
      report.stats.valid++;
    }
  });

  return report;
}

/**
 * Test security measures with various attack vectors
 * FOR TESTING ONLY - DO NOT USE IN PRODUCTION
 */
export async function testSecurityMeasures(): Promise<{ passed: number; failed: number; details: Array<{ test: string; passed: boolean; reason?: string }> }> {
  const testCases = [
    // Private IP tests
    { url: 'http://127.0.0.1/test', shouldBlock: true, description: 'Localhost' },
    { url: 'http://10.0.0.1/test', shouldBlock: true, description: 'Private network (10.x)' },
    { url: 'http://192.168.1.1/test', shouldBlock: true, description: 'Private network (192.168.x)' },
    { url: 'http://172.16.1.1/test', shouldBlock: true, description: 'Private network (172.16.x)' },
    { url: 'http://169.254.169.254/metadata', shouldBlock: true, description: 'AWS metadata service' },
    { url: 'http://[::1]/test', shouldBlock: true, description: 'IPv6 localhost' },
    
    // Protocol tests
    { url: 'file:///etc/passwd', shouldBlock: true, description: 'File protocol' },
    { url: 'ftp://example.com/test', shouldBlock: true, description: 'FTP protocol' },
    
    // Valid URLs that should work
    { url: 'https://via.placeholder.com/300x200', shouldBlock: false, description: 'Trusted CDN' },
    { url: '/api/placeholder/300/200', shouldBlock: false, description: 'Local placeholder' },
    
    // Invalid formats
    { url: 'not-a-url', shouldBlock: true, description: 'Invalid URL format' }
  ];

  const results = {
    passed: 0,
    failed: 0,
    details: [] as Array<{ test: string; passed: boolean; reason?: string }>
  };

  for (const testCase of testCases) {
    try {
      const result = await validateAndHealImageUrl(testCase.url);
      const wasBlocked = result.wasHealed && result.url === PLACEHOLDER_URL;
      const testPassed = wasBlocked === testCase.shouldBlock;
      
      if (testPassed) {
        results.passed++;
      } else {
        results.failed++;
      }
      
      results.details.push({
        test: testCase.description,
        passed: testPassed,
        reason: testPassed ? undefined : `Expected ${testCase.shouldBlock ? 'blocked' : 'allowed'}, got ${wasBlocked ? 'blocked' : 'allowed'}`
      });
    } catch (error) {
      results.failed++;
      results.details.push({
        test: testCase.description,
        passed: false,
        reason: `Test threw error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  return results;
}