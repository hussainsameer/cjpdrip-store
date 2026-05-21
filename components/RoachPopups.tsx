'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Two roaches:
//   - Designer roach slides from LEFT, asks people to apply (Google Form URL)
//   - Joiner roach slides from RIGHT, points to /join page
//
// Behavior: Pops up every 30s. Auto-hides after 8s if ignored. Once a user
// clicks the X to dismiss a specific roach, that one is gone for the session.
// Skipped entirely on cart/checkout/legal pages so we don't interrupt buyers.

const SUPPRESSED_PATHS = ['/cart', '/checkout', '/terms', '/privacy', '/shipping', '/refunds', '/contact', '/artists', '/join', '/predict', '/news'];

const DESIGNER_FORM_URL = '/artists';

export default function RoachPopups() {
  const pathname = usePathname();
  const [activeRoach, setActiveRoach] = useState<null | 'designer' | 'join'>(null);
  const [dismissed, setDismissed] = useState({ designer: false, join: false });

  useEffect(() => {
    if (SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p))) return;

    // Try to read prior session dismissals
    try {
      const dDes = sessionStorage.getItem('cjp-roach-dismissed-designer') === '1';
      const dJoin = sessionStorage.getItem('cjp-roach-dismissed-join') === '1';
      if (dDes || dJoin) setDismissed({ designer: dDes, join: dJoin });
    } catch {}

    let cycleIndex = 0;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const showNext = () => {
      // Pick which roach to show this cycle (alternate)
      const order: ('designer' | 'join')[] = ['designer', 'join'];
      // Find first non-dismissed starting from cycleIndex
      let picked: 'designer' | 'join' | null = null;
      for (let i = 0; i < order.length; i++) {
        const cand = order[(cycleIndex + i) % order.length];
        const isDismissed =
          (cand === 'designer' && (dismissedRef.current.designer)) ||
          (cand === 'join' && (dismissedRef.current.join));
        if (!isDismissed) {
          picked = cand;
          break;
        }
      }
      cycleIndex = (cycleIndex + 1) % order.length;
      if (!picked) return;
      setActiveRoach(picked);
      // auto-hide after 8s
      hideTimer = setTimeout(() => setActiveRoach(null), 8000);
    };

    const dismissedRef = { current: dismissed };

    // First show after 15s
    const firstTimer = setTimeout(showNext, 15000);
    // Then every 30s
    const interval = setInterval(showNext, 30000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
      if (hideTimer) clearTimeout(hideTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const dismiss = (which: 'designer' | 'join') => {
    setActiveRoach(null);
    setDismissed((d) => ({ ...d, [which]: true }));
    try {
      sessionStorage.setItem(`cjp-roach-dismissed-${which}`, '1');
    } catch {}
  };

  if (SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p))) return null;

  return (
    <>
      <DesignerRoach
        visible={activeRoach === 'designer' && !dismissed.designer}
        onDismiss={() => dismiss('designer')}
      />
      <JoinerRoach
        visible={activeRoach === 'join' && !dismissed.join}
        onDismiss={() => dismiss('join')}
      />
    </>
  );
}

function DesignerRoach({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  return (
    <div className={`roach-popup roach-popup--left ${visible ? 'is-visible' : ''}`} aria-live="polite">
      <button className="roach-popup-close" onClick={onDismiss} aria-label="Dismiss">×</button>
      <div className="roach-popup-icon">
        <RoachWithBrush />
      </div>
      <div className="roach-popup-body">
        <div className="roach-popup-eyebrow">— Pssst. —</div>
        <div className="roach-popup-title">We need<br /><span>designers.</span></div>
        <div className="roach-popup-text">
          Got a Procreate file and an opinion?<br />Apply to the cockroach studio.
        </div>
        <a
          className="roach-popup-cta"
          href={DESIGNER_FORM_URL}
          onClick={onDismiss}
        >
          Apply →
        </a>
      </div>
    </div>
  );
}

function JoinerRoach({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  return (
    <div className={`roach-popup roach-popup--right ${visible ? 'is-visible' : ''}`} aria-live="polite">
      <button className="roach-popup-close" onClick={onDismiss} aria-label="Dismiss">×</button>
      <div className="roach-popup-icon">
        <RoachWithClipboard />
      </div>
      <div className="roach-popup-body">
        <div className="roach-popup-eyebrow">— Oye. —</div>
        <div className="roach-popup-title">Join the<br /><span>swarm.</span></div>
        <div className="roach-popup-text">
          Membership is free.<br />Resignation is impossible.
        </div>
        <a className="roach-popup-cta" href="/join" onClick={onDismiss}>Join →</a>
      </div>
    </div>
  );
}

function RoachWithBrush() {
  return (
    <svg viewBox="0 0 90 90" width="68" height="68">
      <g>
        {/* paintbrush handle */}
        <line x1="60" y1="12" x2="76" y2="28" stroke="#1A1714" strokeWidth="3" strokeLinecap="round" />
        {/* paintbrush ferrule */}
        <rect x="56" y="6" width="10" height="6" rx="1" transform="rotate(45 61 9)" fill="#1A1714" />
        {/* paint blob */}
        <ellipse cx="74" cy="32" rx="6" ry="4" fill="#C8331C" />
        {/* body */}
        <ellipse cx="40" cy="55" rx="20" ry="26" fill="#1A1714" />
        {/* head */}
        <ellipse cx="40" cy="30" rx="13" ry="10" fill="#1A1714" />
        {/* antennae */}
        <path d="M 32 22 Q 22 12 16 16" stroke="#1A1714" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 48 22 Q 58 12 64 16" stroke="#1A1714" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="35" cy="30" r="1.6" fill="#EFE6D2" />
        <circle cx="45" cy="30" r="1.6" fill="#EFE6D2" />
        {/* legs */}
        <path d="M 22 48 L 8 44" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 22 58 L 6 60" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 24 70 L 14 80" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 58 48 L 72 44" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 58 58 L 78 60" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 56 70 L 66 80" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        {/* wing line */}
        <line x1="40" y1="38" x2="40" y2="78" stroke="#3a3128" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

function RoachWithClipboard() {
  return (
    <svg viewBox="0 0 90 90" width="68" height="68">
      <g>
        {/* clipboard back */}
        <rect x="60" y="10" width="22" height="30" rx="2" fill="#EFE6D2" stroke="#1A1714" strokeWidth="2" />
        {/* clip */}
        <rect x="66" y="6" width="10" height="5" rx="1" fill="#1A1714" />
        {/* clipboard lines */}
        <line x1="64" y1="20" x2="78" y2="20" stroke="#1A1714" strokeWidth="1" />
        <line x1="64" y1="25" x2="78" y2="25" stroke="#1A1714" strokeWidth="1" />
        <line x1="64" y1="30" x2="74" y2="30" stroke="#1A1714" strokeWidth="1" />
        {/* body */}
        <ellipse cx="36" cy="55" rx="20" ry="26" fill="#1A1714" />
        {/* head */}
        <ellipse cx="36" cy="30" rx="13" ry="10" fill="#1A1714" />
        {/* antennae */}
        <path d="M 28 22 Q 18 12 12 16" stroke="#1A1714" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M 44 22 Q 54 12 60 16" stroke="#1A1714" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="31" cy="30" r="1.6" fill="#EFE6D2" />
        <circle cx="41" cy="30" r="1.6" fill="#EFE6D2" />
        {/* legs */}
        <path d="M 18 48 L 4 44" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 18 58 L 2 60" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 20 70 L 10 80" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 54 48 L 68 44" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M 54 58 L 74 60" stroke="#1A1714" strokeWidth="2.4" strokeLinecap="round" />
        {/* wing line */}
        <line x1="36" y1="38" x2="36" y2="78" stroke="#3a3128" strokeWidth="0.8" />
      </g>
    </svg>
  );
}
