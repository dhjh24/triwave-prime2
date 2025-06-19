import { getProducts } from '../utils/printify.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fetchPrintifyProducts() {
  try {
    // Configuration for Printify API
    const config = {
      apiKey: process.env.VITE_PRINTIFY_API_KEY || process.env.PRINTIFY_API_KEY,
      shopId: process.env.VITE_PRINTIFY_SHOP_ID || process.env.PRINTIFY_SHOP_ID,
      baseUrl: 'https://api.printify.com'
    };

    // Check if credentials are available
    if (!config.apiKey || !config.shopId) {
      console.error('Missing Printify API credentials. Please set VITE_PRINTIFY_API_KEY and VITE_PRINTIFY_SHOP_ID in your .env file');
      process.exit(1);
    }

    console.log('Fetching products from Printify...');
    console.log(`Shop ID: ${config.shopId}`);
    
    // Fetch products
    const response = await getProducts(config);
    
    if (response.status === 200 && response.body) {
      const products = response.body.data || response.body;
      
      console.log(`\nSuccessfully fetched ${products.length} products from Printify`);
      
      // Store products data without displaying
      // You can process the products here as needed
      // For example, save to a file, database, or process further
      
      // Log basic statistics without displaying product details
      console.log('\nProduct Statistics:');
      console.log(`- Total products: ${products.length}`);
      
      if (products.length > 0) {
        const publishedProducts = products.filter(p => p.is_published);
        console.log(`- Published products: ${publishedProducts.length}`);
        console.log(`- Unpublished products: ${products.length - publishedProducts.length}`);
        
        // Count products by status
        const statusCounts = products.reduce((acc, product) => {
          acc[product.status] = (acc[product.status] || 0) + 1;
          return acc;
        }, {});
        
        console.log('\nProducts by status:');
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`- ${status}: ${count}`);
        });
      }
      
      // Return the products data for further processing
      return products;
    } else {
      console.error('Failed to fetch products:', response);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Printify products:', error.message);
    if (error.details) {
      console.error('Error details:', error.details);
    }
    process.exit(1);
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fetchPrintifyProducts().then(products => {
    console.log('\nProducts fetched successfully. Data is available for processing.');
    // You can add additional processing here if needed
    process.exit(0);
  });
}

export { fetchPrintifyProducts };
