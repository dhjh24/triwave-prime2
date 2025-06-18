import { getAllProducts } from '$utils/printify';
import { error } from '@sveltejs/kit';

export async function load() {
  const res = await getAllProducts();

  if (res.status === 200) {
    const allProducts = res.body?.data.products;

    if (allProducts) {
      return {
        body: { allProducts }
      };
    }

    error(404);
  }  else {
    error(res.status);
  }
}