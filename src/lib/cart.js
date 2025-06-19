/**
 * Cart utility functions for interacting with the cart API
 * All functions make requests to server endpoints which then call the Printify API
 */

/**
 * Create a new cart
 * @returns {Promise<Object>} The created cart
 */
export async function createCart() {
  try {
    const response = await fetch('/api/cart/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

/**
 * Get cart by ID
 * @param {string} cartId - The cart ID
 * @returns {Promise<Object>} The cart data
 */
export async function getCart(cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}/`);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

/**
 * Add item to cart
 * @param {string} cartId - The cart ID
 * @param {string} variantId - The product variant ID
 * @param {number} [quantity=1] - Quantity to add
 * @returns {Promise<Object>} Updated cart data
 */
export async function addCartItem(cartId, variantId, quantity = 1) {
  try {
    const response = await fetch(`/api/cart/${cartId}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ variantId, quantity }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to add item to cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
}

/**
 * Update cart items
 * @param {string} cartId - The cart ID
 * @param {Array} lines - Array of line items to update
 * @returns {Promise<Object>} Updated cart data
 */
export async function updateCartItems(cartId, lines) {
  try {
    const response = await fetch(`/api/cart/${cartId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lines }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to update cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

/**
 * Remove cart
 * @param {string} cartId - The cart ID to remove
 * @returns {Promise<Object>} Deletion status
 */
export async function removeCart(cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}/`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to remove cart');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing cart:', error);
    throw error;
  }
}
