/**
 * Get environment variable with fallbacks
 * Works in both server and client contexts
 */
// SvelteKit server-side environment configuration for Printify integration
import { env } from '$env/dynamic/private';

export const printifyConfig = {
  get apiKey() {
    const apiKey = env.PRINTIFY_API_KEY || env.VITE_PRINTIFY_API_KEY;
    if (!apiKey) {
      throw new Error('Missing PRINTIFY_API_KEY in environment. Set either PRINTIFY_API_KEY or VITE_PRINTIFY_API_KEY in your .env file.');
    }
    return apiKey;
  },
  get shopId() {
    const shopId = env.PRINTIFY_SHOP_ID || env.VITE_PRINTIFY_SHOP_ID;
    if (!shopId) {
      throw new Error('Missing PRINTIFY_SHOP_ID in environment. Set either PRINTIFY_SHOP_ID or VITE_PRINTIFY_SHOP_ID in your .env file.');
    }
    return shopId;
  },
  get baseUrl() {
    return 'https://api.printify.com';
  }
};

// Optionally, log status in development (server-side only)
if (process.env.NODE_ENV === 'development') {
  console.log('Printify env status:', {
    PRINTIFY_API_KEY: (env.PRINTIFY_API_KEY || env.VITE_PRINTIFY_API_KEY) ? '***' : 'Not set',
    PRINTIFY_SHOP_ID: env.PRINTIFY_SHOP_ID || env.VITE_PRINTIFY_SHOP_ID || 'Not set',
  });
}
