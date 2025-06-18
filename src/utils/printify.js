// This file contains server-side only code for interacting with the Printify API
// All functions must be called from server-side code only

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000; // 60 seconds in ms
const MAX_REQUESTS = 600;
const requests = new Map();

/**
 * Rate limiting middleware
 * @param {string} shopId - Shop ID for rate limiting
 */
function rateLimit(shopId) {
  const now = Date.now();
  const shopRequests = requests.get(shopId) || [];
  
  // Remove old requests
  while (shopRequests.length && now - shopRequests[0] >= RATE_LIMIT_WINDOW) {
    shopRequests.shift();
  }
  
  if (shopRequests.length >= MAX_REQUESTS) {
    const oldestRequest = shopRequests[0];
    const waitTime = RATE_LIMIT_WINDOW - (now - oldestRequest);
    throw new Error(`Rate limit exceeded for shop ${shopId}. Please wait ${Math.ceil(waitTime / 1000)} seconds`);
  }
  
  shopRequests.push(now);
  requests.set(shopId, shopRequests);
}

/**
 * Make API requests to Printify
 * @param {Object} options - Request options
 * @param {string} options.endpoint - API endpoint (e.g., '/shops/{shop_id}/products.json')
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method='GET'] - HTTP method
 * @param {Object} [options.body] - Request body (will be JSON.stringified)
 * @param {string} [options.shopId] - Optional shop ID override
 * @returns {Promise<{status: number, body: any}>} - Response data
 * @throws {Error} If the request fails or rate limit is exceeded
 */
export async function printifyFetch({ endpoint, method = 'GET', body, shopId: providedShopId }) {
  // Get environment variables (works in both Vercel and local development)
  const apiKey = process.env.VITE_PRINTIFY_API_KEY || 
                process.env.PRINTIFY_API_KEY;
                
  const shopId = providedShopId || 
                process.env.VITE_PRINTIFY_SHOP_ID || 
                process.env.PRINTIFY_SHOP_ID;

  // Validate required configuration
  if (!apiKey || !shopId) {
    const error = new Error('Printify API key and shop ID must be configured');
    error.code = 'MISSING_CONFIGURATION';
    throw error;
  }

  // Apply rate limiting per shop
  rateLimit(shopId);

  const apiUrl = 'https://api.printify.com/v1';
  const processedEndpoint = endpoint.replace('{shop_id}', shopId);
  const url = new URL(processedEndpoint, apiUrl);

  try {
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
      endpoint: processedEndpoint,
      method,
      error: error.message,
      status: error.status,
    });
    throw error;
  }
}

export async function getProducts() {
  try {
    const response = await printifyFetch({ 
      endpoint: '/shops/{shop_id}/products.json',
      method: 'GET'
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

export async function getProduct(productId) {
  try {
    const response = await printifyFetch({ 
      endpoint: `/shops/{shop_id}/products/${productId}.json`,
      method: 'GET'
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

export async function createProduct(productData) {
  try {
    const response = await printifyFetch({
      endpoint: '/shops/{shop_id}/products.json',
      method: 'POST',
      body: productData
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

export async function updateProduct(productId, productData) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/products/${productId}.json`,
      method: 'PUT',
      body: productData
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

export async function deleteProduct(productId) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/products/${productId}.json`,
      method: 'DELETE'
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

export async function createOrder(orderData) {
  return printifyFetch({
    endpoint: `/shops/{shop_id}/orders`,
    method: 'POST',
    body: orderData
  });
}

export async function getOrders() {
  return printifyFetch({ endpoint: `/shops/{shop_id}/orders` });
}

export async function getOrder(orderId) {
  return printifyFetch({ endpoint: `/shops/{shop_id}/orders/${orderId}` });
}

// Cart functions - Note: Printify doesn't have a cart system like Shopify
// These are simplified implementations for compatibility
export async function createCart() {
  try {
    const response = await printifyFetch({
      endpoint: '/shops/{shop_id}/carts.json',
      method: 'POST',
      body: {
        cart: {
          items: []
        }
      }
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

export async function loadCart(cartId) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/carts/${cartId}.json`,
      method: 'GET'
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

export async function addToCart(cartId, variantId, quantity = 1) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/carts/${cartId}.json`,
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
      }
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

export async function updateCart(cartId, lines) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/carts/${cartId}.json`,
      method: 'PUT',
      body: {
        cart: {
          items: lines.map(line => ({
            variant_id: line.variant_id,
            quantity: line.quantity
          }))
        }
      }
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

export async function deleteCart(cartId) {
  try {
    const response = await printifyFetch({
      endpoint: `/shops/{shop_id}/carts/${cartId}.json`,
      method: 'DELETE'
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

export async function getAllCollections() {
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
