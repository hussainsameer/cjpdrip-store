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
        </div>
        <div style={{ textAlign: 'right' }}>
          <div>© 2026</div>
          <div style={{ opacity: 0.5, marginTop: 4 }}>Made in India · Shipped Lazily</div>
        </div>
      </div>
    </footer>
  );
}
