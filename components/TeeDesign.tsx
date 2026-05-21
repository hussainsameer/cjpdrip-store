'use client';

import type { TeeDesign as TeeDesignType } from '@/lib/products';

/**
 * Renders a unique design for each tee.
 * Each design is a CSS/SVG composition (not a photo).
 * Designs sit "on" a tee silhouette — but we keep it abstract/poster-like.
 */
export function TeeDesign({
  design,
  scale = 1,
  customization,
}: {
  design: TeeDesignType;
  scale?: number;
  customization?: { name?: string; exp?: string };
}) {
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
      <Comp customization={customization} />
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
  card: ({ customization }: any = {}) => {
    const displayName = (customization?.name?.trim() || 'YOUR NAME HERE').toUpperCase();
    const exp = customization?.exp?.trim() || '0';
    return (
      <div style={{ width: '95%', border: '2px solid currentColor', padding: '18px 20px', textAlign: 'left' }}>
        <div style={{ ...D.mono, fontSize: 8, opacity: 0.6, marginBottom: 10 }}>— PROFESSIONAL CARD —</div>
        <div style={{ ...D.display, fontSize: 'clamp(18px, 3.8vw, 30px)', marginBottom: 4 }}>{displayName}</div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontStyle: 'italic', marginBottom: 14 }}>Unemployed by Profession</div>
        <div style={{ height: 1, background: 'currentColor', opacity: 0.4, marginBottom: 14 }} />
        <div style={{ ...D.mono, fontSize: 9, lineHeight: 1.8 }}>
          <div>EXP — {exp} YRS</div>
          <div>CTC — ₹0.00 LPA</div>
          <div>STATUS — STILL HERE</div>
        </div>
        <div style={{ ...D.mono, fontSize: 8, marginTop: 12, opacity: 0.6, textAlign: 'right' }}>CJP·2026</div>
      </div>
    );
  },

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

  // 10. Address to the Nation — podium
  podium: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 6, opacity: 0.7 }}>—— PRIME-TIME ADDRESS ——</div>
      <RoachWithShades size={68} />
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 36px)', marginTop: 6 }}>ADDRESS</div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 36px)' }}>TO THE</div>
      <div style={{ ...D.display, fontSize: 'clamp(30px, 7vw, 56px)', color: 'var(--red)' }}>NATION</div>
      <div style={{ ...D.mono, fontSize: 9, marginTop: 8, opacity: 0.6 }}>"my fellow cockroaches..."</div>
    </div>
  ),

  // 11. Cool Under Fire — shades close-up
  shades: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <RoachWithShades size={110} />
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 56px)', marginTop: 6 }}>NEVER NOT</div>
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 56px)', color: 'var(--red)' }}>CHILL.</div>
      <div style={{ ...D.mono, fontSize: 9, marginTop: 10, padding: '4px 12px', border: '1px solid currentColor', display: 'inline-block', opacity: 0.8 }}>★ COOL UNDER FIRE ★</div>
    </div>
  ),

  // 12. Tricolor Roach — flag bands
  tricolor: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', border: '2px solid currentColor', overflow: 'hidden' }}>
        <div style={{ background: '#FF9933', height: 14 }} />
        <div style={{ background: '#F5F1E8', padding: '14px 0', display: 'grid', placeItems: 'center', position: 'relative' }}>
          <RoachIcon size={52} />
        </div>
        <div style={{ background: '#138808', height: 14 }} />
      </div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 38px)', marginTop: 10 }}>THE TRICOLOR</div>
      <div style={{ ...D.display, fontSize: 'clamp(28px, 6.5vw, 50px)', color: 'var(--red)' }}>ROACH</div>
      <div style={{ ...D.mono, fontSize: 9, marginTop: 6, opacity: 0.7 }}>SECULAR · SOCIALIST · LAZY</div>
    </div>
  ),

  // 13. Cockroach in Chief — portrait frame
  inchief: () => (
    <div style={{ textAlign: 'center', width: '88%' }}>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.7, marginBottom: 6 }}>—— OFFICIAL PORTRAIT ——</div>
      <div style={{ border: '3px double currentColor', padding: 12, position: 'relative' }}>
        <RoachWithShades size={88} />
      </div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 40px)', marginTop: 10 }}>COCKROACH</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 40px)', color: 'var(--red)' }}>IN CHIEF</div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 8, opacity: 0.6, letterSpacing: '0.18em' }}>EST · 16 · MAY · 2026</div>
    </div>
  ),

  // Sticker — CJP logo (centered, bold)
  stickerlogo: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ width: 110, height: 110, margin: '0 auto', border: '4px solid currentColor', borderRadius: '50%', display: 'grid', placeItems: 'center', position: 'relative' }}>
        <RoachIcon size={64} />
      </div>
      <div style={{ ...D.mono, fontSize: 10, marginTop: 8, letterSpacing: '0.18em', opacity: 0.8 }}>CJP · OFFICIAL</div>
    </div>
  ),

  // Sticker pack — multiple roaches
  stickerpack: () => (
    <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 8 }}>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={28} /></div>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={36} /></div>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={28} /></div>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={36} /></div>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={44} /></div>
      <div style={{ display: 'grid', placeItems: 'center' }}><RoachIcon size={36} /></div>
    </div>
  ),

  // Sticker badge — parasite stamp
  stickerbadge: () => (
    <div style={{ textAlign: 'center', border: '3px solid currentColor', padding: '12px 16px', width: '90%' }}>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.7 }}>★ CERTIFIED ★</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 38px)' }}>PARASITE</div>
      <div style={{ ...D.mono, fontSize: 9, padding: '4px 0', borderTop: '1px solid currentColor', borderBottom: '1px solid currentColor', margin: '4px 0' }}>OF·THE·SYSTEM</div>
      <RoachIcon size={32} />
    </div>
  ),

  // 0. Black Protest Tee — Spiderman-style centered cockroach, black + red
  protest: () => (
    <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <ProtestRoach size={170} />
    </div>
  ),

  // 14. Inflation Survivor — receipt
  inflation: () => (
    <div style={{ width: '80%', background: 'transparent' }}>
      <div style={{ ...D.mono, fontSize: 8, textAlign: 'center', opacity: 0.7 }}>—— RECEIPT N° 2026 ——</div>
      <div style={{ ...D.mono, fontSize: 8, textAlign: 'center', marginBottom: 8, opacity: 0.7 }}>BHARAT KIRANA · GST APPLIED</div>
      <div style={{ borderTop: '1px dashed currentColor', borderBottom: '1px dashed currentColor', padding: '8px 0', ...D.mono, fontSize: 10, lineHeight: 1.7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ATTA 1KG</span><span>₹65</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>DAL 500G</span><span>₹120</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>TOMATO</span><span>₹180</span></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>HOPE 1 KG</span><span>OUT OF STK</span></div>
      </div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 36px)', marginTop: 10, textAlign: 'center' }}>INFLATION</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 40px)', color: 'var(--red)', textAlign: 'center' }}>SURVIVOR</div>
    </div>
  ),

  // 15. WiFi > Wages — inequality
  wifi: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 14, opacity: 0.7 }}>—— THE MODERN INEQUALITY ——</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ ...D.display, fontSize: 'clamp(36px, 8vw, 64px)' }}>WiFi</div>
        <div style={{ ...D.display, fontSize: 'clamp(50px, 10vw, 84px)', color: 'var(--red)' }}>&gt;</div>
        <div style={{ ...D.display, fontSize: 'clamp(36px, 8vw, 64px)' }}>WAGES</div>
      </div>
      <div style={{ ...D.mono, fontSize: 9, marginTop: 14, padding: '4px 14px', border: '1px solid currentColor', display: 'inline-block', opacity: 0.8 }}>VERIFIED · 100% TRUE</div>
    </div>
  ),

  // 16. Unmute the Mic — censorship satire
  censor: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 8, opacity: 0.7 }}>[ ARTICLE 19(1)(a) ]</div>
      <div style={{ position: 'relative', display: 'inline-block', padding: '0 4px' }}>
        <div style={{ ...D.display, fontSize: 'clamp(34px, 8vw, 64px)' }}>FREE</div>
        <div style={{ ...D.display, fontSize: 'clamp(34px, 8vw, 64px)' }}>SPEECH</div>
        <div style={{ position: 'absolute', top: '38%', left: '-8%', right: '-8%', height: 8, background: 'var(--red)', transform: 'rotate(-3deg)' }} />
      </div>
      <div style={{ ...D.mono, fontSize: 10, marginTop: 14, padding: '6px 12px', border: '2px solid currentColor', display: 'inline-block' }}>*T&amp;C APPLY</div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 8, opacity: 0.6, fontStyle: 'italic' }}>(unmute the mic.)</div>
    </div>
  ),

  // 17. Pothole Insurance — mock policy
  pothole: () => (
    <div style={{ width: '88%', border: '2px solid currentColor', padding: 14, textAlign: 'center' }}>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.7 }}>POLICY №. CJP·2026·PIT</div>
      <div style={{ height: 1, background: 'currentColor', opacity: 0.5, margin: '8px 0' }} />
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 34px)' }}>POTHOLE</div>
      <div style={{ ...D.display, fontSize: 'clamp(20px, 4.5vw, 34px)' }}>INSURANCE</div>
      <div style={{ ...D.display, fontSize: 'clamp(22px, 5vw, 38px)', color: 'var(--red)' }}>CO. LTD.</div>
      <div style={{ height: 1, background: 'currentColor', opacity: 0.5, margin: '10px 0' }} />
      <div style={{ ...D.mono, fontSize: 9, opacity: 0.8 }}>COVERAGE: ALL OF BHARAT</div>
      <div style={{ ...D.mono, fontSize: 9, opacity: 0.8 }}>VALID: TILL NEXT MONSOON</div>
      <div style={{ ...D.mono, fontSize: 8, marginTop: 8, opacity: 0.5, fontStyle: 'italic' }}>* claims processed never</div>
    </div>
  ),

  // 18. Power Cut Champion — trophy / award
  powercut: () => (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div style={{ ...D.mono, fontSize: 9, marginBottom: 6, opacity: 0.7 }}>—— NATIONAL AWARD ——</div>
      <div style={{ ...D.display, fontSize: 'clamp(36px, 7vw, 56px)' }}>★</div>
      <div style={{ ...D.display, fontSize: 'clamp(24px, 5.5vw, 42px)' }}>POWER CUT</div>
      <div style={{ ...D.display, fontSize: 'clamp(30px, 7vw, 54px)', color: 'var(--red)' }}>CHAMPION</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '10px 0' }}>
        <span style={{ ...D.mono, fontSize: 9, padding: '3px 8px', border: '1px solid currentColor' }}>8 HRS</span>
        <span style={{ ...D.mono, fontSize: 9, padding: '3px 8px', border: '1px solid currentColor' }}>DAILY</span>
        <span style={{ ...D.mono, fontSize: 9, padding: '3px 8px', border: '1px solid currentColor' }}>CANDLELIT</span>
      </div>
      <div style={{ ...D.mono, fontSize: 8, opacity: 0.6, fontStyle: 'italic' }}>"survived. somehow."</div>
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

function RoachWithShades({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'inline-block' }}>
      {/* antennae */}
      <path d="M 32 14 Q 22 4 16 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 48 14 Q 58 4 64 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* head */}
      <ellipse cx="40" cy="22" rx="14" ry="10" fill="currentColor" />
      {/* sunglasses (two black lenses + bridge) */}
      <rect x="28" y="18" width="11" height="7" rx="1.5" fill="#000" stroke="#000" />
      <rect x="41" y="18" width="11" height="7" rx="1.5" fill="#000" stroke="#000" />
      <line x1="39" y1="21" x2="41" y2="21" stroke="#000" strokeWidth="1.5" />
      {/* shades highlight */}
      <line x1="30" y1="20" x2="34" y2="20" stroke="#EFE6D2" strokeWidth="0.8" opacity="0.7" />
      <line x1="43" y1="20" x2="47" y2="20" stroke="#EFE6D2" strokeWidth="0.8" opacity="0.7" />
      {/* body / thorax */}
      <ellipse cx="40" cy="50" rx="18" ry="22" fill="currentColor" />
      {/* center wing line */}
      <line x1="40" y1="32" x2="40" y2="70" stroke="#3a3128" strokeWidth="0.7" opacity="0.5" />
      {/* legs */}
      <path d="M 22 40 L 8 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 20 52 L 4 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 22 64 L 12 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 58 40 L 72 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 60 52 L 76 54" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 58 64 L 68 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ProtestRoach({ size = 140 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" style={{ display: 'block' }}>
      {/* antennae */}
      <path d="M 32 16 Q 22 4 14 8" stroke="#1A1714" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 48 16 Q 58 4 66 8" stroke="#1A1714" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* head — black */}
      <ellipse cx="40" cy="22" rx="14" ry="10" fill="#1A1714" />
      {/* body — black */}
      <ellipse cx="40" cy="48" rx="22" ry="28" fill="#1A1714" />
      {/* RED Spider-man-style stripe across upper body */}
      <rect x="22" y="40" width="36" height="5" fill="#C8331C" />
      {/* red center wing line */}
      <line x1="40" y1="32" x2="40" y2="74" stroke="#C8331C" strokeWidth="2.6" />
      {/* red eyes */}
      <ellipse cx="35" cy="22" rx="2.4" ry="1.6" fill="#C8331C" />
      <ellipse cx="45" cy="22" rx="2.4" ry="1.6" fill="#C8331C" />
      {/* legs — black */}
      <path d="M 20 38 L 4 32" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      <path d="M 18 50 L 2 52" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      <path d="M 22 62 L 10 72" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      <path d="M 60 38 L 76 32" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      <path d="M 62 50 L 78 52" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
      <path d="M 58 62 L 70 72" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export { RoachIcon };
