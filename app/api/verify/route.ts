import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_data } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: 'Missing fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ verified: false, error: 'Secret not configured' }, { status: 500 });
    }

    // Verify the signature — this is the security-critical step.
    // Razorpay sends: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
    const expected = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const verified = expected === razorpay_signature;

    if (verified) {
      // Save confirmed order
      await saveConfirmedOrder({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        amount: order_data?.amount,
        items: order_data?.items,
        customer: order_data?.customer,
        status: 'paid',
        confirmed_at: new Date().toISOString(),
      });
      // TODO: send confirmation email (Resend / SendGrid) — wire this in Step 5
      return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false, error: 'Signature mismatch' }, { status: 400 });
  } catch (err: any) {
    console.error('Verify failed:', err);
    return NextResponse.json({ verified: false, error: err.message }, { status: 500 });
  }
}

async function saveConfirmedOrder(data: any) {
  try {
    const dir = path.join(process.cwd(), '.orders');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `CONFIRMED_${data.order_id}.json`), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Confirmed order save failed:', e);
  }
}
