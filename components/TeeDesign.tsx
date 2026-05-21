'use client';

import type { TeeDesign as TeeDesignType } from '@/lib/products';

/**
 * Renders a unique design for each tee.
 * Each design is a CSS/SVG composition (not a photo).
 * Designs sit "on" a tee silhouette — but we keep it abstract/poster-like.
 */
export function TeeDesign({ design, scale = 1 }: { design: TeeDesignType; scale?: number }) {
  const Comp = DESIGNS[design.designType] ?? DESIGNS.badge;
  return (
    <div className="design-canvas" style={{
      width: '78%',
      aspectRatio: '4/5',
      background: 'transparent',
      color: 'inherit',
      display: 'grid',
      placeItems: 'center',
      padding: `${20 * scale}px`,
    }}>
      <Comp />
    </div>
  );
}

const D = {
  // shared inline style helpers
  border: { border: '2px solid currentColor' as const },
  borderThick: { border: '3px solid currentColor' as const },
  mono: { fontFamily: "'DM Mono', monospace" as const, letterSpacing: '0.1em', textTransform: 'uppercase' as const },
  display: { fontFamily: "'Antonio', sans-serif" as const, fontWeight: 700, textTransform: 'uppercase' as const, lineHeight: 0.9 },
};

const DESIGNS = {
  // 1. Parasite of the System — bold badge
  badge: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 8, opacity: 0.7 }}>★ CERTIFIED ★ STAMPED ★ PROUD ★</div>
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 56px)' }}>PARASITE</div>
      <div style={{ ...D.mono, fontSize: 10, padding: '4px 0', borderTop: '1px solid currentColor', borderBottom: '1px solid currentColor', margin: '6px 0' }}>OF·THE·SYSTEM</div>
      <RoachIcon size={48} />
      <div style={{ ...D.mono, fontSize: 8, marginTop: 8, opacity: 0.6 }}>EST. 16·MAY·2026</div>
    </div>
  ),

  // 2. Manifesto — 4 words stacked, party-poster
  manifesto: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 10, opacity: 0.7 }}>— THE PARTY LINE —</div>
      {['SECULAR.', 'SOCIALIST.', 'DEMOCRATIC.', 'LAZY.'].map((w, i) => (
        <div key={w} style={{
          ...D.display,
          fontSize: 'clamp(22px, 5vw, 42px)',
          color: i === 3 ? 'var(--red)' : 'inherit',
          padding: '2px 0',
        }}>{w}</div>
      ))}
      <div style={{ ...D.mono, fontSize: 9, marginTop: 12, opacity: 0.7, padding: '6px 0', borderTop: '1px solid currentColor' }}>COCKROACH JANTA PARTY</div>
    </div>
  ),

  // 3. CJP official logo — cockroach + broom, election-symbol parody
  logo: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 8 }}>★ ELECTION SYMBOL ★</div>
      <div style={{ display: 'inline-block', padding: 16, border: '3px solid currentColor', borderRadius: '50%', marginBottom: 12 }}>
        <RoachWithBroom size={72} />
      </div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 38px)' }}>COCKROACH</div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 38px)' }}>JANTA PARTY</div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 8, opacity: 0.7 }}>VOTE · WITH · YOUR · CHEST</div>
    </div>
  ),

  // 4. Unemployed by Profession — business card
  card: () => (
    <div style={{ width: '95%', border: '2px solid currentColor', padding: '18px 20px', textAlign: 'left' }}>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.6, marginBottom: 10 }}>— PROFESSIONAL CARD —</div>
      <div style={{ ...D.display, fontSize: 'clamp(18px, 3.8vw, 30px)', marginBottom: 4 }}>YOUR NAME HERE</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontStyle: 'italic', marginBottom: 14 }}>Unemployed by Profession</div>
      <div style={{ height: 1, background: 'currentColor', opacity: 0.4, marginBottom: 14 }} />
      <div style={{ ...D.mono, fontSize: 9, lineHeight: 1.8 }}>
        <div>EXP — 0 YRS</div>
        <div>CTC — ₹0.00 LPA</div>
        <div>STATUS — STILL HERE</div>
      </div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 12, opacity: 0.6, textAlign: 'right' }}>CJP·2026</div>
    </div>
  ),

  // 5. Apocalypse, no job — the thesis
  thesis: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 14, opacity: 0.7 }}>:: EVOLUTIONARY GUARANTEE ::</div>
      <div style={{ ...D.display, fontSize: 'clamp(24px, 5.5vw, 46px)' }}>WILL</div>
      <div style={{ ...D.display, fontSize: 'clamp(24px, 5.5vw, 46px)' }}>SURVIVE</div>
      <div style={{ ...D.display, fontSize: 'clamp(24px, 5.5vw, 46px)', color: 'var(--red)' }}>THE APOCALYPSE</div>
      <div style={{ ...D.mono, fontSize: 11, margin: '10px 0', opacity: 0.8 }}>──── still ────</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 42px)' }}>WON'T GET</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 42px)' }}>A JOB.</div>
    </div>
  ),

  // 6. Roach before Rozgar — Hinglish wordplay
  wordplay: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <RoachIcon size={36} />
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 54px)', marginTop: 8 }}>ROACH</div>
      <div style={{ ...D.mono, fontSize: 13, margin: '6px 0', opacity: 0.7 }}>· BEFORE ·</div>
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 54px)', color: 'var(--red)' }}>ROZGAR</div>
      <div style={{ ...D.mono, fontSize: 9, marginTop: 14, opacity: 0.6, padding: '6px 18px', border: '1px solid currentColor', display: 'inline-block' }}>PRIORITIES · SET</div>
    </div>
  ),

  // 7. Main Bhi Cockroach — Devanagari + English solidarity
  solidarity: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 14, opacity: 0.7 }}>—— A DECLARATION ——</div>
      <div style={{
        fontFamily: "'Hind', sans-serif",
        fontWeight: 700,
        fontSize: 'clamp(36px, 8vw, 72px)',
        lineHeight: 1,
        marginBottom: 14,
      }}>मैं भी<br />कॉकरोच</div>
      <div style={{ height: 2, width: 60, background: 'currentColor', margin: '0 auto 14px' }} />
      <div style={{ ...D.display, fontSize: 'clamp(18px, 4vw, 30px)' }}>MAIN BHI</div>
      <div style={{ ...D.display, fontSize: 'clamp(18px, 4vw, 30px)', color: 'var(--red)' }}>COCKROACH.</div>
    </div>
  ),

  // 8. Vote for the Lazy — election poster
  campaign: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, padding: '4px 12px', border: '2px solid currentColor', display: 'inline-block', marginBottom: 10 }}>★ OFFICIAL CAMPAIGN ★</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 40px)' }}>VOTE</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 40px)' }}>FOR THE</div>
      <div style={{ ...D.display, fontSize: 'clamp(36px, 9vw, 72px)', color: 'var(--red)', margin: '4px 0' }}>LAZY</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0' }}>
        <span style={{ height: 1, width: 30, background: 'currentColor' }} />
        <RoachIcon size={22} />
        <span style={{ height: 1, width: 30, background: 'currentColor' }} />
      </div>
      <div style={{ ...D.mono, fontSize: 9, opacity: 0.7 }}>BANKIPUR · BIHAR · 2026</div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 6, opacity: 0.5, fontStyle: 'italic' }}>(satire. probably.)</div>
    </div>
  ),

  // 9. Annual Report Survived — govt doc cover
  report: () => (
    <div style={{ width: '88%', border: '2px solid currentColor', padding: '18px 16px', textAlign: 'center' }}>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.7, marginBottom: 4 }}>GOVERNMENT OF NOWHERE</div>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.7, marginBottom: 14 }}>MINISTRY OF SURVIVING</div>
      <div style={{ height: 2, background: 'currentColor', marginBottom: 14 }} />
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 36px)' }}>ANNUAL</div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 36px)' }}>REPORT</div>
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6vw, 50px)', color: 'var(--red)', marginTop: 8 }}>SURVIVED</div>
      <div style={{ height: 1, background: 'currentColor', opacity: 0.4, margin: '14px 0' }} />
      <div style={{ ...D.mono, fontSize: 9, lineHeight: 1.8 }}>
        <div>F.Y. 2025—26</div>
        <div>VOL. 1 · PG. 1</div>
      </div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 12, opacity: 0.6, fontStyle: 'italic' }}>— only kpi: still here —</div>
    </div>
  ),
};

function RoachIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="currentColor" style={{ display: 'inline-block' }}>
      {/* body */}
      <ellipse cx="30" cy="34" rx="14" ry="18" />
      {/* head */}
      <ellipse cx="30" cy="16" rx="8" ry="6" />
      {/* antennae */}
      <path d="M 26 12 Q 18 4 14 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 34 12 Q 42 4 46 8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* legs */}
      <path d="M 16 28 L 6 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 16 36 L 4 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 18 46 L 10 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 44 28 L 54 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 44 36 L 56 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 42 46 L 50 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="27" cy="15" r="1.2" fill="var(--cream)" />
      <circle cx="33" cy="15" r="1.2" fill="var(--cream)" />
      {/* wing line */}
      <path d="M 30 18 L 30 48" stroke="var(--cream)" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function RoachWithBroom({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="currentColor">
      {/* broom handle */}
      <line x1="58" y1="14" x2="38" y2="62" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* broom bristles */}
      <path d="M 54 10 L 66 16 L 64 22 L 50 16 Z" />
      <line x1="55" y1="12" x2="62" y2="6" stroke="currentColor" strokeWidth="1" />
      <line x1="58" y1="14" x2="66" y2="10" stroke="currentColor" strokeWidth="1" />
      <line x1="61" y1="16" x2="68" y2="14" stroke="currentColor" strokeWidth="1" />
      {/* roach body */}
      <ellipse cx="32" cy="48" rx="14" ry="18" />
      <ellipse cx="32" cy="32" rx="8" ry="6" />
      <path d="M 28 28 Q 22 22 18 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 36 28 Q 42 22 46 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 18 44 L 8 40" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 18 50 L 6 54" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 20 60 L 14 68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 46 44 L 52 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="29" cy="31" r="1.2" fill="var(--cream)" />
      <circle cx="35" cy="31" r="1.2" fill="var(--cream)" />
    </svg>
  );
}

export { RoachIcon };
