import { getProducts } from '$utils/printify';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function load({ url }) {
  try {
    const res = await getProducts();
    if (res.status === 200) {
      const products = res.body?.data?.products || res.body?.products || [];
      // Split products into two collections for the grid layout
      const featured = products.slice(0, 3);
      const clothes = products.slice(3, 6);
      
      return { 
        products: [
          { node: { products: { edges: featured } } },
          { node: { products: { edges: clothes } } }
        ]
      };
    }
    console.error('Unexpected response from Printify getProducts:', res);
    return {
      error: true,
      message: 'Unexpected response from Printify',
      details: res
    };
  } catch (err) {
    console.error('Error fetching products:', err);
    return {
      error: true,
      message: 'Error fetching products',
      details: err?.message || err
    };
  }
}
