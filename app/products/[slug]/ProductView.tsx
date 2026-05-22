'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SIZES, type Size, type TeeDesign as TeeDesignType } from '@/lib/products';
import DesignVisual from '@/components/DesignVisual';
import { useCart } from '@/components/CartProvider';

export default function ProductView({ product }: { product: TeeDesignType }) {
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<Size>('M');
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [pName, setPName] = useState('');
  const [pExp, setPExp] = useState('');

  const handleAdd = () => {
    setAdding(true);
    const cartItem: any = {
      slug: product.slug,
      name: product.name,
      price: product.price,
      size,
      color: color.name,
      qty,
    };
    if (product.personalizable && (pName.trim() || pExp.trim())) {
      cartItem.personalization = { name: pName.trim(), exp: pExp.trim() };
    }
    add(cartItem);
    setTimeout(() => router.push('/cart'), 350);
  };

  const teeBg = color.hex;
  const teeFg = ['black', 'olive', 'red'].includes(color.name) ? '#EFE6D2' : '#1A1714';
  const isMug = product.category === 'mug';
  const isSticker = product.category === 'sticker';
  const sizeLabel = isMug ? 'Capacity' : 'Size';
  const showSizes = !isMug && !isSticker;

  return (
    <main className="pdp">
      <div>
        <Link href="/" className="pdp-back">Back to shop</Link>
        <div className={`pdp-image-wrap ${isMug ? 'is-mug' : ''} ${isSticker ? 'is-sticker' : ''}`} style={{ background: teeBg, color: teeFg }}>
          <DesignVisual
            design={product}
            customization={product.personalizable ? { name: pName, exp: pExp } : undefined}
          />
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

        {product.personalizable && (
          <div className="pdp-personalize">
            <div className="pdp-personalize-label">★ Make it yours — type your name &amp; years unemployed</div>
            <div className="pdp-personalize-row">
              <input
                type="text"
                placeholder="Your name"
                maxLength={24}
                value={pName}
                onChange={e => setPName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Yrs jobless"
                maxLength={3}
                value={pExp}
                onChange={e => setPExp(e.target.value.replace(/[^0-9]/g, ''))}
              />
            </div>
          </div>
        )}

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

        {showSizes && (
          <>
            <div className="pdp-option-label"><span>{sizeLabel}</span><span>Size guide</span></div>
            <div className="pdp-sizes">
              {SIZES.map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`pdp-size ${s === size ? 'active' : ''}`}
                >{s}</button>
              ))}
            </div>
          </>
        )}

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
          {isMug
            ? '[ Ceramic · 350 ml ] · [ Microwave-safe ] · [ Dishwasher-safe ] · [ Print Wraps Front ]'
            : isSticker
            ? '[ Matte Vinyl ] · [ Waterproof ] · [ UV-Resistant ] · [ Die-Cut ]'
            : '[ 100% Cotton · 200 GSM ] · [ Screen Printed ] · [ Pre-washed ] · [ Lazily Shipped ]'}
        </div>
      </div>
    </main>
  );
}
