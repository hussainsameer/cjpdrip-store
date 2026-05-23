'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartProvider';
import CJPLogo from './CJPLogo';

export default function Nav() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-brand" aria-label="CJP Drip home" onClick={close}>
          <CJPLogo height={48} />
        </Link>

        {/* Desktop links (hidden on mobile) */}
        <div className="nav-links nav-links--desktop">
          <Link href="/" className="nav-link">Shop</Link>
          <Link href="/posters" className="nav-link">Posters</Link>
          <Link href="/stickers" className="nav-link">Stickers</Link>
          <Link href="/news" className="nav-link">News</Link>
          <Link href="/predict" className="nav-link" style={{ color: 'var(--red)' }}>The Bet</Link>
          <Link href="/#manifesto" className="nav-link">Manifesto</Link>
          <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer" className="nav-link">The Party ↗</a>
          <a
            href="https://www.instagram.com/cockroach_janta_party.merch/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-ig"
            aria-label="Follow on Instagram"
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

        {/* Mobile cluster: cart icon + hamburger */}
        <div className="nav-mobile-cluster">
          <Link href="/cart" className="nav-cart-mobile" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {ready && count > 0 && <span className="nav-cart-mobile-badge">{count}</span>}
          </Link>
          <button
            className="nav-hamburger"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      {open && (
        <div className="nav-overlay" onClick={close}>
          <div className="nav-overlay-inner" onClick={(e) => e.stopPropagation()}>
            <button className="nav-overlay-close" onClick={close} aria-label="Close menu">×</button>
            <nav className="nav-overlay-links">
              <Link href="/" onClick={close}>Shop</Link>
              <Link href="/posters" onClick={close}>Posters</Link>
              <Link href="/stickers" onClick={close}>Stickers</Link>
              <Link href="/news" onClick={close}>News</Link>
              <Link href="/predict" onClick={close} style={{ color: 'var(--red)' }}>The Bet</Link>
              <Link href="/#manifesto" onClick={close}>Manifesto</Link>
              <Link href="/join" onClick={close}>Join the Party</Link>
              <Link href="/artists" onClick={close}>Design for Us</Link>
              <Link href="/cart" onClick={close}>Cart{ready && count > 0 ? ` (${count})` : ''}</Link>
              <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer" onClick={close}>The Party ↗</a>
              <a href="https://www.instagram.com/cockroach_janta_party.merch/" target="_blank" rel="noopener noreferrer" onClick={close}>Instagram ↗</a>
            </nav>
            <div className="nav-overlay-footer">
              <a href="https://cjpdrip.store" onClick={close}>cjpdrip.store</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
