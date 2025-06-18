import { json } from '@sveltejs/kit';
import { getProducts } from '$utils/printify';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    // Test fetching products from Printify
    const response = await getProducts();
    
    return json({
      success: true,
      status: response.status,
      data: response.body,
      message: 'Successfully connected to Printify API'
    });
  } catch (error) {
    console.error('Test Printify API Error:', error);
    
    return json({
      success: false,
      status: error.status || 500,
      error: error.message,
      details: error.details || {}
    }, { status: error.status || 500 });
  }
}
