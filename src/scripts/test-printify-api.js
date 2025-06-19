import { printifyFetch } from '../utils/printify.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testPrintifyAPI() {
  try {
    // Configuration for Printify API
    const config = {
      apiKey: process.env.VITE_PRINTIFY_API_KEY || process.env.PRINTIFY_API_KEY,
      shopId: process.env.VITE_PRINTIFY_SHOP_ID || process.env.PRINTIFY_SHOP_ID,
      baseUrl: 'https://api.printify.com'
    };

    // Check if API key is available
    if (!config.apiKey) {
      console.error('Missing Printify API key. Please set VITE_PRINTIFY_API_KEY in your .env file');
      process.exit(1);
    }

    console.log('Testing Printify API connection...');
    console.log(`Using Shop ID: ${config.shopId}`);
    
    // First, try to get list of shops to verify API key
    console.log('\n1. Testing API key by fetching shops...');
    try {
      const shopsResponse = await printifyFetch({
        endpoint: '/v1/shops.json',
        method: 'GET',
        config
      });
      
      if (shopsResponse.status === 200 && shopsResponse.body) {
        const shops = shopsResponse.body;
        console.log(`✓ API key is valid. Found ${shops.length} shop(s):`);
        shops.forEach(shop => {
          console.log(`  - Shop ID: ${shop.id}, Title: ${shop.title}`);
        });
        
        // Check if the configured shop ID exists
        const configuredShop = shops.find(shop => shop.id.toString() === config.shopId.toString());
        if (!configuredShop) {
          console.log(`\n⚠️  Warning: Configured shop ID ${config.shopId} not found in your shops.`);
          if (shops.length > 0) {
            console.log(`   Using first available shop: ${shops[0].id}`);
            config.shopId = shops[0].id.toString();
          }
        }
      }
    } catch (error) {
      console.error('✗ Failed to fetch shops:', error.message);
      if (error.status === 401) {
        console.error('   Invalid API key. Please check your VITE_PRINTIFY_API_KEY in .env file');
        process.exit(1);
      }
    }
    
    // Now try to fetch products
    console.log(`\n2. Fetching products from shop ${config.shopId}...`);
    try {
      const productsResponse = await printifyFetch({
        endpoint: `/v1/shops/${config.shopId}/products.json`,
        method: 'GET',
        config
      });
      
      if (productsResponse.status === 200 && productsResponse.body) {
        const products = productsResponse.body.data || productsResponse.body;
        console.log(`✓ Successfully fetched ${products.length} products`);
        
        if (products.length > 0) {
          console.log('\nFirst 3 products (without full details):');
          products.slice(0, 3).forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.title} (ID: ${product.id})`);
            console.log(`     - Status: ${product.status}`);
            console.log(`     - Published: ${product.is_published ? 'Yes' : 'No'}`);
          });
        }
        
        return products;
      }
    } catch (error) {
      console.error('✗ Failed to fetch products:', error.message);
      if (error.details) {
        console.error('   Error details:', error.details);
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error.message);
    process.exit(1);
  }
}

// Run the script
testPrintifyAPI().then(() => {
  console.log('\nAPI test completed.');
  process.exit(0);
});
