import type { RequestHandler } from '@sveltejs/kit';

// Optionally, import crypto for signature verification if using a secret
// import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the incoming JSON payload
    const event = await request.json();

    // Optionally verify the signature here if using a secret
    // const signature = request.headers.get('x-printify-signature');
    // if (signature && !verifySignature(event, signature, 'your-secret')) {
    //   return new Response('Invalid signature', { status: 401 });
    // }

    // Log the event for debugging and auditing
    console.log('Received Printify webhook:', event);

    // TODO: Add your event handling logic here

    // Respond with 200 OK to acknowledge receipt
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    // Respond with 400 to trigger Printify retry
    return new Response('Bad Request', { status: 400 });
  }
};

// Uncomment and implement if you want to verify webhook signatures
// function verifySignature(payload: any, signature: string, secret: string): boolean {
//   const expected = crypto
//     .createHmac('sha256', secret)
//     .update(JSON.stringify(payload))
//     .digest('hex');
//   return signature === expected;
// }
