const RATE_LIMIT_WINDOW = 60000; // 60 seconds in ms
const MAX_REQUESTS = 600;
const requests = [];

// Rate limiting middleware
function rateLimit() {
  const now = Date.now();
  // Remove old requests in-place
  while (requests.length && now - requests[0] >= RATE_LIMIT_WINDOW) {
    requests.shift();
  }
  if (requests.length >= MAX_REQUESTS) {
    const oldestRequest = requests[0];
    const waitTime = RATE_LIMIT_WINDOW - (now - oldestRequest);
    throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds`);
  }
  requests.push(now);
}

export async function printifyFetch({ endpoint, method = 'GET', body }) {
  try {
    // Check rate limit
    rateLimit();

    const apiUrl = 'https://api.printify.com/v1';
    const apiKey = import.meta.env.VITE_PRINTIFY_API_KEY;
    const shopId = import.meta.env.VITE_PRINTIFY_SHOP_ID;

    // Replace {shop_id} placeholder with actual shop ID
    const processedEndpoint = endpoint.replace('{shop_id}', shopId);

    const response = await fetch(`${apiUrl}${processedEndpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'SvelteKit Commerce' // Required by Printify API
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Printify API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return {
      status: response.status,
      body: result // Return raw result instead of wrapping in data
    };
  } catch (error) {
    console.error('Printify API Error:', error);
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
