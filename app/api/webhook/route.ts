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

    // For captured payments originating from our checkout, forward to the
    // Google Sheet with full customer + order details.
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl && eventType === 'payment.captured') {
      try {
        const p = event.payload?.payment?.entity || {};
        const notes = p.notes || {};

        // Skip donate-button / razorpay.me payments — only log real store orders
        if (notes.source !== 'cjpdrip-store') {
          console.log('[WEBHOOK] skipping non-store payment:', p.id);
        } else {
          const amountInr = p.amount ? p.amount / 100 : 0;
          const phone = notes.customer_phone || p.contact || '';
          const fullAddress = [notes.address, notes.city, notes.state, notes.pincode]
            .filter(Boolean)
            .join(', ');
          // Cram everything into the Reason field so it works even if the
          // user's Apps Script only writes the original 6 columns.
          const reasonFull = [
            `₹${amountInr}`,
            notes.items_summary || `${notes.item_count || '?'} items`,
            phone && `📞 ${phone}`,
            fullAddress && `📍 ${fullAddress}`,
            `Order ${p.order_id}`,
            `Pay ${p.id}`,
          ]
            .filter(Boolean)
            .join(' · ');

          await fetch(sheetUrl, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              name: notes.customer_name || '',
              email: notes.customer_email || p.email || '',
              city: notes.city || '',
              reason: reasonFull,
              source: 'order-paid',
              // Also send structured fields — useful once Apps Script is updated to use them
              phone,
              address: notes.address || '',
              state: notes.state || '',
              pincode: notes.pincode || '',
              amount: amountInr,
              order_id: p.order_id || '',
              payment_id: p.id || '',
              method: p.method || '',
            }),
          });
        }
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
