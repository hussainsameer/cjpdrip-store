import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Razorpay webhook receiver.
 * URL to configure in Razorpay → Webhooks: https://cjpdrip.store/api/webhook
 * Env var required: RAZORPAY_WEBHOOK_SECRET
 *
 * Subscribed events:
 *   - payment.captured
 *   - payment.failed
 *   - order.paid
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('[WEBHOOK] secret env var missing');
      return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 500 });
    }

    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
    if (expected !== signature) {
      console.warn('[WEBHOOK] invalid signature');
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event;

    console.log('[WEBHOOK]', eventType, JSON.stringify(event.payload || {}).slice(0, 600));

    // For captured payments, also forward to the Google Sheet so the user has
    // an at-a-glance record of every paid order.
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl && eventType === 'payment.captured') {
      try {
        const p = event.payload?.payment?.entity || {};
        const amountInr = p.amount ? p.amount / 100 : 0;
        const notes = p.notes || {};
        await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: notes.customer_name || p.contact || '',
            email: p.email || '',
            city: '',
            reason: `Order ${p.order_id} · ₹${amountInr} · ${p.method || 'paid'} · ${notes.item_count || '?'} items`,
            source: 'order-paid',
          }),
        });
      } catch (e) {
        console.error('[WEBHOOK] sheet forward failed:', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[WEBHOOK] error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
