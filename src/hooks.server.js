import { PRIVATE_PRINTIFY_API_KEY, PRIVATE_PRINTIFY_SHOP_ID } from '$env/static/private';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Make environment variables available in the locals object
  event.locals.printify = {
    apiKey: PRIVATE_PRINTIFY_API_KEY,
    shopId: PRIVATE_PRINTIFY_SHOP_ID
  };

  const response = await resolve(event);
  return response;
}
