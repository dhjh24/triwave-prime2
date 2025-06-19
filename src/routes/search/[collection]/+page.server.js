import { getAllCollections } from '$utils/printify-server';
import { error } from '@sveltejs/kit';

export async function load() {
  const res = await getAllCollections();

  if (res.status === 200) {
    const collections = res.body?.data?.collections?.edges || [];
    if (collections) {
      return {
        body: { collections }
      };
    }

    error(404);
  } else {
    error(res.status);
  }
}
