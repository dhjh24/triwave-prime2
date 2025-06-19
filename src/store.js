import { writable } from 'svelte/store';
import { loadCart } from '$utils/cart-client';

export const cartQuantity = writable('');
export const cart = writable([]);
export const search = writable('');

export const getCartItems = async () => {
  let cartId;
  try {
    const raw = localStorage.getItem('cartId');
    cartId = raw ? JSON.parse(raw) : null;
  } catch {
    cartId = null;
  }

  try {
    const printifyResponse = await loadCart(cartId);

    let sum = 0;
    printifyResponse.body?.data?.cart?.lines?.edges?.forEach((d) => {
      sum += d.node.quantity;
    });
    cartQuantity.set(sum);
    return printifyResponse;
  } catch (error) {
    console.log(error);
  }
};
