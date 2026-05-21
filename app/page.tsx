import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { TeeDesign } from '@/components/TeeDesign';

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-stamp">
          <span>EST.</span>
          <strong>16·05·26</strong>
        </div>
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow">
              <span>Drop № 001 · Vol. 1</span>
              <span>Cockroach Janta Party · Official Merch</span>
            </div>
            <h1 className="hero-title">
              They called us<br />
              <span className="red">cockroaches.</span><br />
              <em>So we made</em><br />
              merch.
            </h1>
            <p className="hero-tagline">
              A tee shirt drop for the <strong>lazy</strong>, the <strong>unemployed</strong>, the
              over-qualified-but-still-broke. Wear the joke. Wear the protest.
              Mostly wear the joke.
            </p>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-row"><span>Designs</span><span>18</span></div>
            <div className="hero-meta-row"><span>Sizes</span><span>S — XXL</span></div>
            <div className="hero-meta-row"><span>Material</span><span>200 GSM Cotton</span></div>
            <div className="hero-meta-row"><span>Print</span><span>Screen, Riso-style</span></div>
            <div className="hero-meta-row"><span>Pay</span><span>UPI · Card · Netbank</span></div>
            <div className="hero-meta-row"><span>Ships</span><span>All over India</span></div>
            <div className="hero-meta-row"><span>From</span><span>₹499</span></div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, repeat) => (
            <span key={repeat} className="marquee-item">
              <span>SECULAR</span>
              <span className="marquee-dot">●</span>
              <span>SOCIALIST</span>
              <span className="marquee-dot">●</span>
              <span>DEMOCRATIC</span>
              <span className="marquee-dot">●</span>
              <span style={{ color: 'var(--ochre)' }}>LAZY</span>
              <span className="marquee-dot">●</span>
              <span>VOICE OF THE LAZY</span>
              <span className="marquee-dot">●</span>
              <span>ROACH BEFORE ROZGAR</span>
              <span className="marquee-dot">●</span>
              <span>WE SURVIVED</span>
              <span className="marquee-dot">●</span>
            </span>
          ))}
        </div>
      </div>

      {/* BRAND MASCOT */}
      <section className="mascot-section">
        <div className="mascot-inner">
          <div className="mascot-image-wrap">
            <img src="/CJP.png" alt="Cockroach Janta Party — official mascot" className="mascot-image" />
          </div>
          <div className="mascot-text">
            <div className="mascot-eyebrow">[ The Mascot ]</div>
            <h2 className="mascot-title">Meet the<br /><span className="red">Cockroach in Chief.</span></h2>
            <p className="mascot-body">
              Sunglasses on. Six legs planted. Speaking from a podium that doesn't exist
              to a nation that doesn't listen. He is the face of the party, the voice of the
              lazy, the mascot of survival. He will outlive the rest of us. Wear him on your chest.
            </p>
            <div className="mascot-tags">
              <span>★ EST. 16·MAY·2026</span>
              <span>★ SECULAR · SOCIALIST · DEMOCRATIC · LAZY</span>
              <span>★ ROACH FIRST. ROZGAR LATER.</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">[ The Drop ]</div>
            <h2 className="section-title">Eighteen Tees<br />For The People</h2>
          </div>
          <div className="section-counter">18 / 18 IN STOCK</div>
        </div>
      </section>

      <div className="products-grid">
        {PRODUCTS.map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
            {p.featured && <div className="featured-badge">Featured</div>}
            <div className="product-tee-bg">
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

      {/* MANIFESTO */}
      <section className="manifesto" id="manifesto">
        <div className="manifesto-inner">
          <div className="manifesto-label">— Manifesto —</div>
          <div>
            <div className="manifesto-text">
              We are <span className="red">secular.</span><br />
              We are socialist.<br />
              We are democratic.<br />
              <span className="red">And we are lazy.</span>
            </div>
            <p className="manifesto-quote">
              "There are youngsters like cockroaches, who don't get any employment…" — they said it on
              record. We took the word, sewed it onto cotton, and made it ours. This is not a party.
              It is not a movement. It is a tee shirt. Maybe that is enough.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
