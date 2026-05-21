'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

declare global {
  interface Window { Razorpay: any; }
}

type Form = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  const [form, setForm] = useState<Form>({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0 && !loading) {
    return (
      <main className="page-wrap">
        <h1 className="page-title">Nothing to check out</h1>
        <div className="page-sub">[ your cart is empty ]</div>
        <button className="cart-empty-btn" onClick={() => router.push('/')}>Back to shop →</button>
      </main>
    );
  }

  const update = (k: keyof Form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = (): string | null => {
    if (!form.name.trim()) return 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Valid email required';
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Valid 10-digit Indian phone required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.city.trim()) return 'City is required';
    if (!form.state.trim()) return 'State is required';
    if (!/^\d{6}$/.test(form.pincode)) return 'Valid 6-digit pincode required';
    return null;
  };

  const handlePay = async () => {
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: grandTotal,
          items,
          customer: form,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create order. Check that Razorpay keys are set in .env.local');
      }

      const order = await orderRes.json();

      // 2. Open Razorpay checkout
      if (!window.Razorpay) {
        throw new Error('Razorpay script not loaded yet. Refresh and try again.');
      }

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'CJP · Merch',
        description: `${items.length} tee${items.length > 1 ? 's' : ''} for the resistance`,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#1A1714' },
        handler: async (response: any) => {
          // 3. Verify signature on backend
          const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_data: { items, customer: form, amount: grandTotal },
            }),
          });
          const data = await verifyRes.json();
          if (data.verified) {
            clear();
            router.push(`/success?id=${response.razorpay_payment_id}`);
          } else {
            setError('Payment verification failed. Contact support with payment ID: ' + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.on('payment.failed', (resp: any) => {
        setError(`Payment failed: ${resp.error.description || 'Unknown error'}`);
        setLoading(false);
      });

      rzp.open();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <main className="page-wrap">
      <h1 className="page-title">Checkout</h1>
      <div className="page-sub">[ shipping details · then pay ]</div>

      <div className="cart-grid">
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 20, opacity: 0.7 }}>
            — Where do we ship the resistance? —
          </div>
          <div className="form-grid">
            <div className="form-field full">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit number" />
            </div>
            <div className="form-field full">
              <label className="form-label">Address</label>
              <input className="form-input" value={form.address} onChange={e => update('address', e.target.value)} placeholder="House / street / area" />
            </div>
            <div className="form-field">
              <label className="form-label">City</label>
              <input className="form-input" value={form.city} onChange={e => update('city', e.target.value)} placeholder="City" />
            </div>
            <div className="form-field">
              <label className="form-label">State</label>
              <input className="form-input" value={form.state} onChange={e => update('state', e.target.value)} placeholder="State" />
            </div>
            <div className="form-field">
              <label className="form-label">Pincode</label>
              <input className="form-input" value={form.pincode} onChange={e => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6 digits" />
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--red)', color: 'var(--cream)', padding: 14, fontFamily: "'DM Mono', monospace", fontSize: 12, marginTop: 16 }}>
              ⚠ {error}
            </div>
          )}
        </div>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order</h2>
          {items.map(i => (
            <div key={`${i.slug}-${i.size}-${i.color}`} className="cart-summary-row">
              <span style={{ flex: 1 }}>{i.name.slice(0, 24)}{i.name.length > 24 ? '…' : ''} <span style={{ opacity: 0.5 }}>× {i.qty}</span></span>
              <span>₹{i.price * i.qty}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px dashed var(--ink)', marginTop: 12, paddingTop: 12 }}>
            <div className="cart-summary-row"><span>Subtotal</span><span>₹{total}</span></div>
            <div className="cart-summary-row"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="cart-summary-row total"><span className="label">Total</span><span>₹{grandTotal}</span></div>
          </div>
          <button className="cart-checkout-btn" onClick={handlePay} disabled={loading}>
            {loading ? 'Opening Razorpay…' : `Pay ₹${grandTotal} →`}
          </button>
          <div style={{ marginTop: 14, fontFamily: "'DM Mono', monospace", fontSize: 10, opacity: 0.5, textAlign: 'center', letterSpacing: '0.08em' }}>
            🔒 Secured by Razorpay · UPI · Card · Netbank
          </div>
        </aside>
      </div>
    </main>
  );
}
