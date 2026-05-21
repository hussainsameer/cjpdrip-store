'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function Nav() {
  const { count, ready } = useCart();
  return (
    <nav className="nav">
      <Link href="/" className="nav-brand" aria-label="CJP Drip home">
        <img src="/logo.png" alt="Cockroach Janta Party" className="nav-logo" />
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Shop</Link>
        <Link href="/#manifesto" className="nav-link">Manifesto</Link>
        <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer" className="nav-link">The Party ↗</a>
        <Link href="/join" className="nav-join">Join the Party</Link>
        <Link href="/cart" className="nav-cart">
          Cart
          {ready && count > 0 && <span className="nav-cart-badge">{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
