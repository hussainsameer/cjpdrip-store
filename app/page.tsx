import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import DesignVisual from '@/components/DesignVisual';
import MobileProductScroller from '@/components/MobileProductScroller';

const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'CJP Drip',
  url: 'https://cjpdrip.store',
  logo: 'https://cjpdrip.store/cjp.jpeg',
  sameAs: ['https://cockroachjantaparty.org'],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hussainzsameer@gmail.com',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
};

const siteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'CJP Drip',
  url: 'https://cjpdrip.store',
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />

      {/* Mobile-only product swipe carousel — first thing users see on phones */}
      <MobileProductScroller />
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
            <div className="hero-meta-row"><span>Designs</span><span>18 tees · 5 mugs</span></div>
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
            <img src="/cjp.jpeg" alt="Cockroach Janta Party — official mascot" className="mascot-image" />
          </div>
          <div className="mascot-text">
            <div className="mascot-eyebrow">[ The Movement ]</div>
            <h2 className="mascot-title">A movement,<br /><span className="red">not a meme.</span></h2>
            <p className="mascot-body">
              We are <strong>secular</strong>. We are <strong>socialist</strong>. We are <strong>democratic</strong>.
              We are 18 million strong and counting. The Cockroach Janta Party is not a party — it is a verdict.
              On the unemployed, the silenced, the survivors. The mascot wears shades because we are not afraid.
              The merch funds the movement. <strong>Wear the verdict.</strong>
            </p>
            <div className="mascot-tags">
              <span>★ EST. 16·MAY·2026</span>
              <span>★ SECULAR · SOCIALIST · DEMOCRATIC</span>
              <span>★ FOR THE UNEMPLOYED · THE SILENCED · THE SURVIVORS</span>
            </div>
            <a
              href="https://www.instagram.com/cockroach_janta_party.merch/"
              target="_blank"
              rel="noopener noreferrer"
              className="mascot-ig"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              Follow @cockroach_janta_party.merch
            </a>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="section-header">
        <div className="section-header-row">
          <div>
            <div className="section-eyebrow">[ The Drop ]</div>
            <h2 className="section-title">Tees &amp; Mugs<br />For The People</h2>
          </div>
          <div className="section-counter">23 / 23 IN STOCK</div>
        </div>
      </section>

      <div className="products-grid">
        {PRODUCTS.filter(p => p.category !== 'sticker' && p.category !== 'poster').map((p, i) => (
          <Link key={p.slug} href={`/products/${p.slug}`} className="product-card">
            {p.featured && <div className="featured-badge">Featured</div>}
            <div className={`product-tee-bg ${p.category === 'mug' ? 'is-mug' : ''}`}>
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
