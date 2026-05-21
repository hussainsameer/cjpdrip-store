import Link from 'next/link';
import type { Metadata } from 'next';
import { PRODUCTS } from '@/lib/products';
import { TeeDesign } from '@/components/TeeDesign';

export const metadata: Metadata = {
  title: 'Stickers · CJP Drip',
  description: 'Cockroach Janta Party vinyl stickers. Waterproof, kiss-cut, die-cut. From ₹79.',
};

export default function StickersPage() {
  const stickers = PRODUCTS.filter((p) => p.category === 'sticker');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span>Drop № 002 · Stickers</span>
              <span>From ₹79 · Waterproof</span>
            </div>
            <h1 className="hero-title">
              Cockroach<br />
              <span className="red">Stickers.</span><br />
              <em>Stuck.</em>
            </h1>
            <p className="hero-tagline">
              Vinyl die-cut. Waterproof. Survives more washes than your job applications.
              Slap them on laptops, helmets, bottles, fridges. Then ignore them like everyone else.
            </p>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-row"><span>Designs</span><span>{stickers.length}</span></div>
            <div className="hero-meta-row"><span>Material</span><span>Vinyl · Matte</span></div>
            <div className="hero-meta-row"><span>Cut</span><span>Die-cut · Kiss-cut</span></div>
            <div className="hero-meta-row"><span>Weather</span><span>Waterproof · UV-resistant</span></div>
            <div className="hero-meta-row"><span>Ships</span><span>All over India</span></div>
            <div className="hero-meta-row"><span>From</span><span>₹79</span></div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">[ The Stickers ]</div>
            <h2 className="section-title">Stick With Us<br />Forever</h2>
          </div>
          <div className="section-counter">{String(stickers.length).padStart(2, '0')} / {String(stickers.length).padStart(2, '0')} IN STOCK</div>
        </div>
      </section>

      <div className="products-grid">
        {stickers.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
            {p.featured && <div className="featured-badge">Featured</div>}
            <div className="product-tee-bg is-sticker">
              <TeeDesign design={p} />
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

      {/* COMING-SOON NOTE */}
      <section className="sticker-note">
        <div className="sticker-note-inner">
          <div className="sticker-note-eyebrow">[ Template Drop ]</div>
          <h2 className="sticker-note-title">Actual sticker photos<br /><span className="red">coming soon.</span></h2>
          <p>
            Designs above are placeholders. Real die-cut vinyl samples are being printed.
            Want to design one? <Link href="/join" style={{ textDecoration: 'underline' }}>Apply to draw for us.</Link>
          </p>
        </div>
      </section>
    </>
  );
}
