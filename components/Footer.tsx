import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ fontFamily: "'Antonio', sans-serif", fontSize: 18, marginBottom: 6 }}>CJP · MERCH</div>
          <div className="footer-disclaimer">
            This is an independent satirical merchandise project. Not affiliated with any registered political party.
            All designs are commentary, parody, and protest under Article 19(1)(a). No cockroaches were employed.
          </div>
          <div className="footer-links">
            <Link href="/contact">Contact</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/refunds">Returns &amp; Refunds</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <a href="https://cockroachjantaparty.org" target="_blank" rel="noopener noreferrer">The Party ↗</a>
            <a href="https://www.instagram.com/cockroach_janta_party.merch/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>
            <Link href="/artists">Design for Us</Link>
            <Link href="/predict">The Sunday Bet</Link>
            <Link href="/news">News</Link>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>© 2026 CJP Drip</div>
          <div style={{ opacity: 0.5, marginTop: 4 }}>Made in India · Shipped Lazily</div>
        </div>
      </div>
    </footer>
  );
}
