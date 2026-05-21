import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { amount, items, customer } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret || keyId.includes('xxxxx')) {
      return NextResponse.json({
        error: 'Razorpay keys not configured. Add real keys to .env.local — see README Step 3.'
      }, { status: 500 });
    }

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });

    // Razorpay expects amount in paise (smallest unit)
    const itemsSummary =
      Array.isArray(items) && items.length > 0
        ? items
            .map(
              (i: any) =>
                `${i.name} (${i.size || '-'}/${i.color || '-'}) × ${i.qty || 1}`,
            )
            .join(' | ')
            .slice(0, 480)
        : '';

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `cjp_${Date.now()}`,
      notes: {
        source: 'cjpdrip-store',
        customer_name: customer?.name || '',
        customer_email: customer?.email || '',
        customer_phone: customer?.phone || '',
        address: customer?.address || '',
        city: customer?.city || '',
        state: customer?.state || '',
        pincode: customer?.pincode || '',
        item_count: String(items?.length || 0),
        items_summary: itemsSummary,
      },
    });

    // Save pending order to local file (replace with DB in prod)
    await savePendingOrder({
      order_id: order.id,
      amount,
      items,
      customer,
      created_at: new Date().toISOString(),
      status: 'created',
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.error('Razorpay order creation failed:', err);
    return NextResponse.json({
      error: err?.error?.description || err?.message || 'Failed to create order'
    }, { status: 500 });
  }
}

async function savePendingOrder(data: any) {
  try {
    const dir = path.join(process.cwd(), '.orders');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, `${data.order_id}.json`), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Order save failed:', e);
  }
}
