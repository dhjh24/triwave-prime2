/**
 * Client-side cart utilities
 * These functions call the API endpoints instead of directly accessing Printify
 */

export async function createCart() {
  try {
    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

export async function loadCart(cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to load cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
}

export async function addToCart(cartId, variantId, quantity = 1) {
  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ variantId, quantity }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add to cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateCart(cartId, lines) {
  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lines }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
}

export async function deleteCart(cartId) {
  try {
    const response = await fetch(`/api/cart/${cartId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete cart: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting cart:', error);
    throw error;
  }
}
