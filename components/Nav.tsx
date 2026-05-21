'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';
import CJPLogo from './CJPLogo';

export default function Nav() {
  const { count, ready } = useCart();
  return (
    <nav className="nav">
      <Link href="/" className="nav-brand" aria-label="CJP Drip home">
        <CJPLogo height={48} />
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Shop</Link>
        <Link href="/stickers" className="nav-link">Stickers</Link>
        <Link href="/#manifesto" className="nav-link">Manifesto</Link>
        <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer" className="nav-link">The Party ↗</a>
        <a
          href="https://www.instagram.com/cockroach_janta_party.merch/"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-ig"
          aria-label="Follow on Instagram"
          title="Follow @cockroach_janta_party.merch"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
        </a>
        <Link href="/join" className="nav-join">Join the Party</Link>
        <Link href="/cart" className="nav-cart">
          Cart
          {ready && count > 0 && <span className="nav-cart-badge">{count}</span>}
        </Link>
      </div>
    </nav>
  );
}
