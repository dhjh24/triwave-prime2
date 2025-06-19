import { writable } from 'svelte/store';
import { loadCart } from '$utils/cart-client';

export const cartQuantity = writable('');
export const cart = writable([]);
export const search = writable('');

export const getCartItems = async () => {
  let cartId = JSON.parse(localStorage.getItem('cartId'));

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
