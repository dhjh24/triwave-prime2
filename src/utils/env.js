/**
 * Get environment variable with fallbacks
 * Works in both server and client contexts
 */
export function getEnvVar(name) {
  // Server-side (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  
  // Client-side (Vite)
  if (import.meta && import.meta.env) {
    return import.meta.env[`VITE_${name}`] || import.meta.env[name];
  }
  
  return undefined;
}

/**
 * Get required environment variable
 * @throws {Error} If the environment variable is not set
 */
export function requireEnvVar(name) {
  const value = getEnvVar(name) || getEnvVar(`VITE_${name}`);
  
  if (!value) {
    const error = new Error(`Missing required environment variable: ${name}`);
    error.code = 'MISSING_ENV_VAR';
    error.details = { variable: name };
    throw error;
  }
  
  return value;
}

// Printify specific environment variables
export const printifyConfig = {
  get apiKey() {
    return requireEnvVar('PRINTIFY_API_KEY');
  },
  get shopId() {
    return requireEnvVar('PRINTIFY_SHOP_ID');
  },
  get baseUrl() {
    return 'https://api.printify.com/v1';
  }
};

// Log environment status (only in development)
if (import.meta.env?.MODE === 'development') {
  console.log('Environment variables status:', {
    NODE_ENV: getEnvVar('NODE_ENV'),
    MODE: getEnvVar('MODE'),
    PRINTIFY_API_KEY: getEnvVar('PRINTIFY_API_KEY') ? '***' : 'Not set',
    PRINTIFY_SHOP_ID: getEnvVar('PRINTIFY_SHOP_ID') || 'Not set',
  });
}
