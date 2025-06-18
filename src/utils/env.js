/**
 * Get environment variable with fallbacks
 * Works in both server and client contexts
 */
// SvelteKit server-side environment configuration for Printify integration
import { PRINTIFY_API_KEY, PRINTIFY_SHOP_ID } from '$env/static/private';

export const printifyConfig = {
  get apiKey() {
    if (!PRINTIFY_API_KEY) {
      throw new Error('Missing PRINTIFY_API_KEY in environment. Set this in your .env file (no VITE_ prefix).');
    }
    return PRINTIFY_API_KEY;
  },
  get shopId() {
    if (!PRINTIFY_SHOP_ID) {
      throw new Error('Missing PRINTIFY_SHOP_ID in environment. Set this in your .env file (no VITE_ prefix).');
    }
    return PRINTIFY_SHOP_ID;
  },
  get baseUrl() {
    return 'https://api.printify.com/v1';
  }
};

// Optionally, log status in development (server-side only)
if (process.env.NODE_ENV === 'development') {
  console.log('Printify env status:', {
    PRINTIFY_API_KEY: PRINTIFY_API_KEY ? '***' : 'Not set',
    PRINTIFY_SHOP_ID: PRINTIFY_SHOP_ID || 'Not set',
  });
}

