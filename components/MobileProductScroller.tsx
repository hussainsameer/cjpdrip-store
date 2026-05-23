import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';

/**
 * Horizontal swipeable product carousel shown at the TOP of the homepage
 * on mobile only. Hidden above 900px width (desktop has the full grid).
 *
 * Each card is ~78vw so 1.25 cards are visible at once — invites the swipe.
 */
export default function MobileProductScroller() {
  // First 10 non-sticker, non-poster products (the tees + mugs)
  const featured = PRODUCTS
    .filter((p) => p.category !== 'sticker' && p.category !== 'poster')
    .slice(0, 10);

  return (
    <section className="m-scroller-wrap" aria-label="Featured products">
      <div className="m-scroller-head">
        <div className="m-scroller-eyebrow">— Swipe the shop —</div>
        <Link href="/" className="m-scroller-all">View all →</Link>
      </div>
      <div className="m-scroller">
        {featured.map((p, i) => (
          <Link
            key={p.slug}
            href={`/products/${p.slug}`}
            className="m-scroller-card"
          >
            <div className="m-scroller-img-wrap">
              <img
                src={`/mockups/${p.slug}.png`}
                alt={p.name}
                className="m-scroller-img"
                loading={i < 2 ? 'eager' : 'lazy'}
              />
            </div>
            <div className="m-scroller-meta">
              <div className="m-scroller-num">№ {String(i + 1).padStart(2, '0')}</div>
              <div className="m-scroller-name">{p.name}</div>
              <div className="m-scroller-price-row">
                <span className="m-scroller-price">₹{p.price}</span>
                <span className="m-scroller-cta">Buy →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
