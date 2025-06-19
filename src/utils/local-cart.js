/**
 * Local cart implementation for Printify integration
 * Since Printify doesn't have a cart API, we'll manage carts locally
 */

// In-memory cart storage (in production, use a database or Redis)
const carts = new Map();

// Generate a simple cart ID
function generateCartId() {
  return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createCart() {
  const cartId = generateCartId();
  const cart = {
    id: cartId,
    items: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  carts.set(cartId, cart);
  return { body: cart, status: 201 };
}

export function loadCart(cartId) {
  const cart = carts.get(cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }
  return { body: cart, status: 200 };
}

export function addToCart(cartId, variantId, quantity) {
  const cart = carts.get(cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }
  
  // Check if item already exists
  const existingItem = cart.items.find(item => item.variantId === variantId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      variantId,
      quantity,
      addedAt: new Date().toISOString()
    });
  }
  
  cart.updatedAt = new Date().toISOString();
  return { body: cart, status: 200 };
}

export function updateCart(cartId, lines) {
  const cart = carts.get(cartId);
  if (!cart) {
    throw new Error('Cart not found');
  }
  
  // Update cart items based on lines
  cart.items = lines.map(line => ({
    variantId: line.variantId,
    quantity: line.quantity,
    addedAt: line.addedAt || new Date().toISOString()
  }));
  
  cart.updatedAt = new Date().toISOString();
  return { body: cart, status: 200 };
}

export function deleteCart(cartId) {
  if (!carts.has(cartId)) {
    throw new Error('Cart not found');
  }
  
  carts.delete(cartId);
  return { body: { success: true }, status: 200 };
}
