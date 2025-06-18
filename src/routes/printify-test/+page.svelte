<script>
  import { onMount } from 'svelte';
  
  let isLoading = true;
  let testResult = null;
  let error = null;
  
  async function testConnection() {
    try {
      isLoading = true;
      error = null;
      
      const response = await fetch('/api/printify/test');
      testResult = await response.json();
      
      if (!response.ok) {
        throw new Error(testResult.error || 'Failed to test Printify connection');
      }
    } catch (err) {
      console.error('Test failed:', err);
      error = {
        message: err.message,
        details: err.details || {}
      };
    } finally {
      isLoading = false;
    }
  }
  
  onMount(() => {
    testConnection();
  });
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Printify API Test</h1>
    
    {#if isLoading}
      <div class="flex items-center justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    {:else if error}
      <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700">
              {error.message}
              {#if error.details}
                <pre class="mt-2 text-xs text-red-600 overflow-auto">{JSON.stringify(error.details, null, 2)}</pre>
              {/if}
            </p>
          </div>
        </div>
      </div>
      
      <button
        on:click={testConnection}
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Retry Test
      </button>
    {:else if testResult}
      <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-green-700">
              {testResult.message}
              {#if testResult.config}
                <pre class="mt-2 text-xs text-green-600 overflow-auto">{JSON.stringify(testResult.config, null, 2)}</pre>
              {/if}
            </p>
          </div>
        </div>
      </div>
      
      <div class="mt-6">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Next Steps</h2>
        <ul class="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>Check the browser console for API request logs</li>
          <li>Try accessing the <a href="/api/printify/test" class="text-blue-600 hover:underline" target="_blank" rel="noopener">test endpoint</a> directly</li>
          <li>Review your environment variables in Vercel or .env file</li>
        </ul>
      </div>
    {/if}
  </div>
</div>
