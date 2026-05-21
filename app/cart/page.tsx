'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import { getProduct } from '@/lib/products';
import { TeeDesign } from '@/components/TeeDesign';

export default function CartPage() {
  const { items, updateQty, remove, total, ready } = useCart();
  const router = useRouter();
  const shipping = total > 0 ? (total >= 999 ? 0 : 79) : 0;
  const grandTotal = total + shipping;

  if (!ready) return <main className="page-wrap"><div className="page-title">Loading…</div></main>;

  if (items.length === 0) {
    return (
      <main className="page-wrap">
        <h1 className="page-title">Your Cart</h1>
        <div className="page-sub">[ 00 items · ₹0 ]</div>
        <div className="cart-empty">
          <div className="cart-empty-text">Empty. Like the<br />job market.</div>
          <div className="cart-empty-sub">— go pick a tee —</div>
          <Link href="/" className="cart-empty-btn">Browse the Drop →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <h1 className="page-title">Your Cart</h1>
      <div className="page-sub">[ {String(items.length).padStart(2, '0')} items · review before paying ]</div>

      <div className="cart-grid">
        <div className="cart-items">
          {items.map(item => {
            const product = getProduct(item.slug);
            const colorObj = product?.colors.find(c => c.name === item.color);
            return (
              <div key={`${item.slug}-${item.size}-${item.color}`} className="cart-item">
                <div className="cart-item-img" style={{ background: colorObj?.hex, color: item.color === 'black' ? '#EFE6D2' : '#1A1714' }}>
                  {product && <div style={{ transform: 'scale(0.6)' }}><TeeDesign design={product} /></div>}
                </div>
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">Size {item.size} · {colorObj?.label}</div>
                  <div className="cart-item-qty">
                    <button onClick={() => updateQty(item.slug, item.size, item.color, item.qty - 1)}>−</button>
                    <div className="cart-item-qty-val">{item.qty}</div>
                    <button onClick={() => updateQty(item.slug, item.size, item.color, item.qty + 1)}>+</button>
                  </div>
                </div>
                <div>
                  <div className="cart-item-price">₹{item.price * item.qty}</div>
                  <button className="cart-item-remove" onClick={() => remove(item.slug, item.size, item.color)}>Remove</button>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Summary</h2>
          <div className="cart-summary-row"><span>Subtotal</span><span>₹{total}</span></div>
          <div className="cart-summary-row">
            <span>Shipping {total >= 999 && <em style={{ color: 'var(--red)', fontStyle: 'normal' }}>· FREE</em>}</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
          </div>
          {total < 999 && total > 0 && (
            <div className="cart-summary-row" style={{ fontSize: 11, opacity: 0.6 }}>
              <span>Add ₹{999 - total} more for free shipping</span><span />
            </div>
          )}
          <div className="cart-summary-row total">
            <span className="label">Total</span><span>₹{grandTotal}</span>
          </div>
          <button className="cart-checkout-btn" onClick={() => router.push('/checkout')}>
            Proceed to Checkout →
          </button>
          <div style={{ marginTop: 16, fontFamily: "'DM Mono', monospace", fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
            Pay via UPI · Card · Netbanking
          </div>
        </aside>
      </div>
    </main>
  );
}
