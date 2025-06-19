import { json } from '@sveltejs/kit';
import { createCart, loadCart, addToCart, updateCart, deleteCart } from '$utils/local-cart';

// Handle all cart operations
/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
  const { id } = params;
  
  try {
    if (id) {
      // Get specific cart
      const response = loadCart(id);
      return json(response.body, { status: response.status });
    } else {
      // Create new cart
      const response = createCart();
      return json(response.body, { status: response.status });
    }
  } catch (error) {
    console.error('Cart GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
  const { id } = params;
  
  try {
    const { variantId, quantity } = await request.json();

    if (!id) {
      return json({ error: 'Cart ID is required' }, { status: 400 });
    }

    const response = addToCart(id, variantId, quantity);
    return json(response.body, { status: response.status });
  } catch (error) {
    console.error('Cart POST error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
  const { id } = params;
  
  try {
    const { lines } = await request.json();

    if (!id) {
      return json({ error: 'Cart ID is required' }, { status: 400 });
    }

    const response = updateCart(id, lines);
    return json(response.body, { status: response.status });
  } catch (error) {
    console.error('Cart PUT error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params }) {
  const { id } = params;

  try {
    if (!id) {
      return json({ error: 'Cart ID is required' }, { status: 400 });
    }

    const response = deleteCart(id);
    return json(response.body, { status: response.status });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
