/**
 * Cart utility functions for interacting with the cart API
 */

export async function createCart() {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

export async function getCart(cartId) {
  const response = await fetch(`/api/cart/${cartId}`);
  return response.json();
}

export async function addCartItem(cartId, variantId, quantity = 1) {
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ variantId, quantity }),
  });
  return response.json();
}

export async function updateCartItems(cartId, lines) {
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lines }),
  });
  return response.json();
}

export async function removeCart(cartId) {
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'DELETE',
  });
  return response.json();
}
