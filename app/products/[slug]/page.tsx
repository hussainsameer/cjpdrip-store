'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getProduct, SIZES, type Size } from '@/lib/products';
import { TeeDesign } from '@/components/TeeDesign';
import { useCart } from '@/components/CartProvider';
import { notFound } from 'next/navigation';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const product = getProduct(slug);
  if (!product) notFound();

  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<Size>('M');
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    add({ slug: product.slug, name: product.name, price: product.price, size, color: color.name, qty });
    setTimeout(() => router.push('/cart'), 350);
  };

  // Set tee background based on selected color
  const teeBg = color.hex;
  const teeFg = color.name === 'black' ? '#EFE6D2' : '#1A1714';

  return (
    <main className="pdp">
      <div>
        <Link href="/" className="pdp-back">Back to shop</Link>
        <div className="pdp-image-wrap" style={{ background: teeBg, color: teeFg }}>
          <TeeDesign design={product} />
        </div>
      </div>

      <div>
        <div className="pdp-eyebrow">№ {product.subtitle} · CJP Drop 001</div>
        <h1 className="pdp-title">{product.name}</h1>
        <div className="pdp-subtitle">{product.tagline}</div>
        <p className="pdp-desc">{product.description}</p>

        <div className="pdp-price">
          <span>₹{product.price}</span>
          <span className="pdp-price-tax">Incl. GST · Ships in 5–7 days</span>
        </div>

        <div className="pdp-option-label"><span>Color</span><span>{color.label}</span></div>
        <div className="pdp-colors">
          {product.colors.map(c => (
            <button
              key={c.name}
              onClick={() => setColor(c)}
              className={`pdp-color ${c.name === color.name ? 'active' : ''}`}
              style={{ background: c.hex }}
              aria-label={c.label}
            />
          ))}
        </div>

        <div className="pdp-option-label"><span>Size</span><span>Size guide</span></div>
        <div className="pdp-sizes">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`pdp-size ${s === size ? 'active' : ''}`}
            >{s}</button>
          ))}
        </div>

        <div className="pdp-option-label"><span>Quantity</span><span /></div>
        <div className="pdp-qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <div className="pdp-qty-val">{qty}</div>
          <button onClick={() => setQty(q => q + 1)}>+</button>
        </div>

        <button className="pdp-add" onClick={handleAdd} disabled={adding}>
          <span>{adding ? 'Added →' : `Add to Resistance · ₹${product.price * qty}`}</span>
          <span className="pdp-add-arrow">{adding ? '✓' : '→'}</span>
        </button>

        <div className="pdp-notes">
          [ 100% Cotton · 200 GSM ] · [ Screen Printed ] · [ Pre-washed ] · [ Lazily Shipped ]
        </div>
      </div>
    </main>
  );
}
