import { json } from '@sveltejs/kit';
import { printifyConfig } from '$utils/env';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    // Test if we can access the environment variables
    const config = {
      hasApiKey: !!printifyConfig.apiKey,
      hasShopId: !!printifyConfig.shopId,
      baseUrl: printifyConfig.baseUrl,
    };

    if (!config.hasApiKey || !config.hasShopId) {
      return json({
        success: false,
        message: 'Missing required environment variables',
        config,
        env: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
        },
      }, { status: 500 });
    }

    return json({
      success: true,
      message: 'Printify configuration is valid',
      config: {
        hasApiKey: true,
        hasShopId: true,
        baseUrl: printifyConfig.baseUrl,
      },
    });
  } catch (error) {
    console.error('Test Printify Config Error:', error);
    
    return json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}
