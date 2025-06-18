/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Environment variables are now accessed directly in the printifyFetch function
  const response = await resolve(event);
  return response;
}
