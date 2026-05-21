import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

/**
 * Razorpay webhook receiver.
 * Configure this URL in Razorpay dashboard → Webhooks:
 *   https://YOUR_DOMAIN/api/webhook
 * Set the webhook secret in .env.local as RAZORPAY_WEBHOOK_SECRET.
 *
 * Subscribed events should include:
 *   - payment.captured
 *   - payment.failed
 *   - order.paid
 *   - refund.processed
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook secret missing');
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

    if (expected !== signature) {
      console.warn('Invalid webhook signature');
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Log webhook event
    const dir = path.join(process.cwd(), '.orders');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `WEBHOOK_${Date.now()}_${eventType}.json`),
      JSON.stringify(event, null, 2)
    );

    // Handle events
    switch (eventType) {
      case 'payment.captured':
        console.log('✓ Payment captured:', event.payload.payment.entity.id);
        // TODO: trigger fulfillment, email customer
        break;
      case 'payment.failed':
        console.log('✗ Payment failed:', event.payload.payment.entity.id);
        break;
      case 'order.paid':
        console.log('✓ Order paid:', event.payload.order.entity.id);
        break;
      default:
        console.log('Webhook received:', eventType);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
