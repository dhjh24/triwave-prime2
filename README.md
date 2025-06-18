# SvelteKit Commerce with Printify

<img width="843" alt="sveltekit-commerce" src="https://user-images.githubusercontent.com/9113740/176811983-2bc99cac-e994-4c65-b8b2-5e2f845b3b8e.png">

SvelteKit Commerce is an open-source, customizable ecommerce template built with SvelteKit, Tailwind CSS, and Printify for print-on-demand products.

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?demo-title=SvelteKit%20Commerce&demo-description=An%20all-in-one%20starter%20kit%20for%20high-performance%20e-commerce%20sites%20built%20with%20SvelteKit.&demo-url=https%3A%2F%2Fsveltekit-commerce.vercel.app&demo-image=%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F3XUMB0FmezRUsbDFLZzqw9%2Fef0f3ad80a5e2e02dca2e2f94a3f174f%2FCleanShot_2022-07-29_at_17.13.28_2x.png&project-name=SvelteKit%20Commerce&repository-name=sveltekit-commerce&repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fsveltekit-commerce)

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Printify API Configuration
VITE_PRINTIFY_API_KEY=your_printify_api_key_here
VITE_PRINTIFY_SHOP_ID=your_shop_id_here

# For production, you can also use these environment variables:
PRINTIFY_API_KEY=your_printify_api_key_here
PRINTIFY_SHOP_ID=your_shop_id_here
```

## API Endpoints

### Cart API
- `POST /api/cart` - Create a new cart
- `GET /api/cart/[cartId]` - Get cart by ID
- `POST /api/cart/[cartId]` - Add item to cart
- `PUT /api/cart/[cartId]` - Update cart items
- `DELETE /api/cart/[cartId]` - Remove cart

### Test Endpoint
- `GET /api/test/printify` - Test Printify API connection

## Running Locally

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Copy `.env.example` to `.env` and fill in your Printify credentials:
   ```bash
   cp .env.example .env
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Build for production:
   ```bash
   pnpm build
   ```

5. Preview production build:
   ```bash
   pnpm preview
   ```

## Testing

Test the Printify API connection:
```bash
curl http://localhost:5173/api/test/printify
```
