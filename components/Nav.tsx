'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import { RoachIcon } from './TeeDesign';

export default function Nav() {
  const { count, ready } = useCart();
  return (
    <nav className="nav">
      <Link href="/" className="nav-brand">
        <div className="nav-brand-mark">
          <span style={{ color: 'var(--cream)' }}><RoachIcon size={22} /></span>
        </div>
        <div>
          <div className="nav-brand-text">CJP · Merch</div>
          <div className="nav-brand-sub">Voice of the Lazy</div>
        </div>
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Shop</Link>
        <Link href="/#manifesto" className="nav-link">Manifesto</Link>
        <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer" className="nav-link">The Party ↗</a>
        <Link href="/cart" className="nav-cart">
          Cart
          {ready && count > 0 && <span className="nav-cart-badge">{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
