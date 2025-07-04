<script>
  import Icons from './Icons.svelte';

  /** @type {{
    loading?: boolean,
    items?: any[],
    onAddProduct: (item: any) => void,
    onRemoveProduct: (item: any, quantity: number, lineId: string) => void,
    onClose: () => void
  }} */
  let { 
    loading = $bindable(false), 
    items = [], 
    onAddProduct, 
    onRemoveProduct, 
    onClose 
  } = $props();

  function addOneItem(item) {
    loading = true;
    onAddProduct(item.node.merchandise.id);
  }

  function removeOneItem(item) {
    loading = true;
    let quantity = item.node.quantity - 1;
    onRemoveProduct(
      item.node.merchandise.id,
      quantity,
      item.node.id
    );
  }

  function removeEntireItem(item) {
    loading = true;
    onRemoveProduct(
      item.node.merchandise.id,
      0,
      item.node.id
    );
  }

  async function checkout() {
    loading = true;
    let checkoutUrl = localStorage.getItem('cartUrl');
    let url;
    try {
      url = JSON.parse(checkoutUrl);
    } catch {
      url = '';
    }
    if (url) window.open(url, '_blank');
    loading = false;
  }

  function closeCart() {
    onClose();
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      closeCart();
    }
  }
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
  class="absolute inset-0 z-50 flex max-h-screen w-full justify-end overflow-hidden bg-black/50"
  role="dialog"
  aria-modal="true"
  aria-labelledby="cart-title"
  onclick={closeCart}
  onkeydown={handleKeyDown}
  tabindex="-1"
  data-testid="cart-overlay"
>
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="z-50 w-full bg-black p-6 md:w-1/2 lg:w-1/3 relative"
    role="document"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
      }
    }}
    data-testid="cart-content"
  >
    {#if loading}
      <div class="absolute inset-0 bg-black/50 z-50"></div>
    {/if}
    <div class="mb-6 flex w-full items-center justify-between">
      <h2 id="cart-title" class="text-2xl font-medium">My Cart</h2>
      <button onclick={closeCart} class="text-sm uppercase opacity-80 hover:opacity-100">close</button>
    </div>
    {#if items.length === 0}
      <div class="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white">
          <Icons type="cart" strokeColor="#000" />
        </div>
        <div class="mt-6 text-center text-2xl font-bold">Your cart is empty.</div>
      </div>
    {/if}
    <div class="overflow-y-auto" style="height: 80%;">
      {#each items as item, i (i)}
        <div class="mb-2 flex w-full">
          <img
            alt={item.node.merchandise.product.title}
            decoding="async"
            loading="lazy"
            class="w-20 flex-none bg-white"
            src={item.node.merchandise.product.images.edges[0].node.originalSrc}
          />
          <div class="ml-4 flex w-full flex-col justify-between">
            <div class="flex w-full justify-between">
              <div>
                <p class="text-lg font-medium">{item.node.merchandise.product.title}</p>
                <p class="text-sm">{item.node.merchandise.title}</p>
              </div>
              <p class="font-medium">${item.node.estimatedCost.totalAmount.amount}</p>
            </div>
          </div>
        </div>
        <div class="mb-4 flex w-full">
          <button
            onclick={() => removeEntireItem(item)}
            class="mr-2 flex h-8 w-8 items-center justify-center border border-white/40 bg-white/0 hover:bg-white/10"
            aria-label="Remove item"
          >
            <Icons type="close" strokeColor="#fff" />
          </button>
          <div class="flex h-8 w-full border border-white/40">
            <div class="flex h-full items-center px-2">
              {item.node.quantity}
            </div>
            <button
              onclick={() => removeOneItem(item)}
              class="ml-auto flex h-8 w-8 items-center justify-center border-l border-white/40 bg-white/0 hover:bg-white/10"
              aria-label="Decrease quantity"
            >
              <Icons type="minus" strokeColor="#fff" />
            </button>
            <button
              onclick={() => addOneItem(item)}
              class="flex h-8 w-8 items-center justify-center border-l border-white/40 bg-white/0 hover:bg-white/10"
              aria-label="Increase quantity"
            >
              <Icons type="plus" strokeColor="#fff" />
            </button>
          </div>
        </div>
      {/each}
    </div>
    {#if items.length !== 0}
      <button
        onclick={checkout}
        class="mt-6 flex w-full items-center justify-center bg-white p-3 text-sm font-medium uppercase text-black opacity-90 hover:opacity-100"
      >
        <span>Proceed to Checkout</span>
        {#if loading}
          <div class="lds-ring ml-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        {/if}
      </button>
    {/if}
  </div>
</div>

<style>
  .lds-ring {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 16px;
    height: 16px;
    margin: 2px;
    border: 2px solid #000;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #000 transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
