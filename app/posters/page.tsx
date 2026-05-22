import Link from 'next/link';
import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import DesignVisual from '@/components/DesignVisual';

export const metadata: Metadata = {
  title: 'Posters · CJP Drip',
  description: 'CJP riso-printed posters. A3, heavy cream paper, screen-print quality. From ₹299.',
};

export default function PostersPage() {
  const posters = PRODUCTS.filter((p) => p.category === 'poster');

  return (
    <>
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span>Drop № 003 · Posters</span>
              <span>From ₹299 · A3 Riso</span>
            </div>
            <h1 className="hero-title">
              Posters for<br />
              <span className="red">the swarm.</span><br />
              <em>Wall it up.</em>
            </h1>
            <p className="hero-tagline">
              Screen-printed on heavy cream paper. A3 size. Tape them, frame them, paste them
              on protest walls. <strong>One movement, one wall at a time.</strong>
            </p>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-row"><span>Designs</span><span>{posters.length}</span></div>
            <div className="hero-meta-row"><span>Size</span><span>A3 · 297 × 420 mm</span></div>
            <div className="hero-meta-row"><span>Paper</span><span>200 GSM Cream</span></div>
            <div className="hero-meta-row"><span>Print</span><span>Riso · Screen</span></div>
            <div className="hero-meta-row"><span>Ships</span><span>Rolled, India-wide</span></div>
            <div className="hero-meta-row"><span>From</span><span>₹299</span></div>
          </div>
        </div>
      </section>

      <section className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">[ The Wall ]</div>
            <h2 className="section-title">Hang the<br />Movement</h2>
          </div>
          <div className="section-counter">{String(posters.length).padStart(2, '0')} / {String(posters.length).padStart(2, '0')} IN STOCK</div>
        </div>
      </section>

      <div className="products-grid">
        {posters.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
            {p.featured && <div className="featured-badge">Featured</div>}
            <div className="product-tee-bg">
              <DesignVisual design={p} />
            </div>
            <div className="product-info">
              <div className="product-number">№ {String(i + 1).padStart(2, '0')} · {p.subtitle}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-meta-row">
                <span className="product-price">₹{p.price}</span>
                <span className="product-cta">View</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
