import { error } from '@sveltejs/kit';

// Rate limiting configuration (30 requests per minute per shop)
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Max requests per windowMs
};

// Track rate limits per shop
const rateLimits = new Map();

/**
 * Simple in-memory rate limiter
 */
function rateLimit(limitConfig) {
  const requests = [];
  
  return {
    check() {
      const now = Date.now();
      
      // Remove old requests outside the time window
      while (requests.length && now - requests[0] >= limitConfig.windowMs) {
        requests.shift();
      }
      
      // Check if we've exceeded the limit
      if (requests.length >= limitConfig.max) {
        return false;
      }
      
      // Add current timestamp
      requests.push(now);
      return true;
    }
  };
}

/**
 * Get rate limiter for a specific shop
 * @param {string} shopId - The Printify shop ID
 * @returns {Object} Rate limiter instance
 */
function getRateLimiter(shopId) {
  if (!rateLimits.has(shopId)) {
    rateLimits.set(shopId, rateLimit(RATE_LIMIT));
  }
  return rateLimits.get(shopId);
}

/**
 * Make API requests to Printify
 * @param {Object} options - Request options
 * @param {string} options.endpoint - API endpoint (e.g., '/shops/{shop_id}/products.json')
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON.stringified)
 * @param {string} [options.shopId] - Optional shop ID override
 * @param {Object} options.config - Printify configuration object with apiKey, shopId, and baseUrl
 * @returns {Promise<{status: number, body: any}>} - Response data
 * @throws {Error} If the request fails or rate limit is exceeded
 */
export async function printifyFetch({ endpoint, method = 'GET', body, shopId: providedShopId, config }) {
  try {
    // Get API key and shop ID from config
    const apiKey = config.apiKey;
    const shopId = providedShopId || config.shopId;
    
    // Get rate limiter for this shop
    const limiter = getRateLimiter(shopId);
    
    // Check rate limit
    if (!limiter.check()) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    
    // Process endpoint and create URL
    const processedEndpoint = endpoint.replace('{shop_id}', shopId);
    // Remove leading slash from endpoint if present
    const cleanEndpoint = processedEndpoint.startsWith('/') ? processedEndpoint.slice(1) : processedEndpoint;
    const url = new URL(`${config.baseUrl}/${cleanEndpoint}`);

    console.log(`[Printify API] ${method} ${url}`);
    
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'SvelteKit Commerce/1.0',
        'Accept': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || 'Printify API request failed');
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return {
      status: response.status,
      body: data
    };
  } catch (error) {
    console.error('Printify API Error:', {
      endpoint: endpoint.replace('{shop_id}', providedShopId || config.shopId),
      method,
      error: error.message,
      status: error.status,
    });
    throw error;
  }
}

export async function getProducts(config) {
  try {
    const response = await printifyFetch({ 
      endpoint: '/v1/shops/{shop_id}/products.json',
      method: 'GET',
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to fetch products: ${response.status}`);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProduct(productId, config) {
  try {
    const response = await printifyFetch({ 
      endpoint: `/v1/shops/{shop_id}/products/${productId}.json`,
      method: 'GET',
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to fetch product: ${response.status}`);
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createProduct(productData, config) {
  try {
    const response = await printifyFetch({
      endpoint: '/v1/shops/{shop_id}/products.json',
      method: 'POST',
      body: productData,
      config
    });
    if (response.status === 201) {
      return response;
    }
    throw new Error(`Failed to create product: ${response.status}`);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(productId, productData, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/products/${productId}.json`,
      method: 'PUT',
      body: productData,
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to update product: ${response.status}`);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(productId, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/products/${productId}.json`,
      method: 'DELETE',
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to delete product: ${response.status}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function createOrder(orderData, config) {
  return printifyFetch({
    endpoint: `/v1/shops/{shop_id}/orders`,
    method: 'POST',
    body: orderData,
    config
  });
}

export async function getOrders(config) {
  return printifyFetch({ endpoint: `/v1/shops/{shop_id}/orders`, config });
}

export async function getOrder(orderId, config) {
  return printifyFetch({ endpoint: `/v1/shops/{shop_id}/orders/${orderId}`, config });
}

// Cart functions - Note: Printify doesn't have a cart system like Shopify
// These are simplified implementations for compatibility
export async function createCart(config) {
  try {
    const response = await printifyFetch({
      endpoint: '/v1/shops/{shop_id}/carts.json',
      method: 'POST',
      body: {
        cart: {
          items: []
        }
      },
      config
    });
    if (response.status === 201) {
      return response;
    }
    throw new Error(`Failed to create cart: ${response.status}`);
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export async function loadCart(cartId, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/carts/${cartId}.json`,
      method: 'GET',
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to load cart: ${response.status}`);
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
}

export async function addToCart(cartId, variantId, quantity = 1, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/carts/${cartId}.json`,
      method: 'PUT',
      body: {
        cart: {
          items: [
            {
              variant_id: variantId,
              quantity: quantity
            }
          ]
        }
      },
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to add to cart: ${response.status}`);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateCart(cartId, lines, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/carts/${cartId}.json`,
      method: 'PUT',
      body: {
        cart: {
          items: lines.map(line => ({
            variant_id: line.variant_id,
            quantity: line.quantity
          }))
        }
      },
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to update cart: ${response.status}`);
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

export async function deleteCart(cartId, config) {
  try {
    const response = await printifyFetch({
      endpoint: `/v1/shops/{shop_id}/carts/${cartId}.json`,
      method: 'DELETE',
      config
    });
    if (response.status === 200) {
      return response;
    }
    throw new Error(`Failed to delete cart: ${response.status}`);
  } catch (error) {
    console.error('Error deleting cart:', error);
    throw error;
  }
}

export async function getAllCollections(config) {
  // Printify doesn't have collections like Shopify
  // You might want to create categories or tags instead
  return {
    status: 200,
    body: {
      data: {
        collections: {
          edges: []
        }
      }
    }
  };
}
