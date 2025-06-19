import { json } from '@sveltejs/kit';
import { createCart, loadCart, addToCart, updateCart, deleteCart } from '$utils/printify-server';

// Handle all cart operations
/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
  const { id } = params;
  
  try {
    if (id) {
      // Get specific cart
      const response = await loadCart(id);
      return json(response);
    } else {
      // Create new cart
      const response = await createCart();
      return json(response);
    }
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
  const { id } = params;
  const { variantId, quantity } = await request.json();

  try {
    if (!id) {
      return json({ error: 'Cart ID is required' }, { status: 400 });
    }

    const response = await addToCart(id, variantId, quantity);
    return json(response);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request, params }) {
  const { id } = params;
  const { lines } = await request.json();

  try {
    if (!id) {
      return json({ error: 'Cart ID is required' }, { status: 400 });
    }

    const response = await updateCart(id, lines);
    return json(response);
  } catch (error) {
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

    const response = await deleteCart(id);
    return json(response);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}
