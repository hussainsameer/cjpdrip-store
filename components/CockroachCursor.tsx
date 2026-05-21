'use client';

import { useEffect, useRef, useState } from 'react';

export default function CockroachCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [angle, setAngle] = useState(0);
  const [visible, setVisible] = useState(false);
  const lastMouseTime = useRef(Date.now());
  const drift = useRef({ vx: 0, vy: 0, targetAngle: 0 });
  const posRef = useRef({ x: -100, y: -100 });
  const angleRef = useRef(0);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window === 'undefined' || matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e: MouseEvent) => {
      setVisible(true);
      posRef.current = { x: e.clientX, y: e.clientY };
      setPos({ x: e.clientX, y: e.clientY });
      lastMouseTime.current = Date.now();
      drift.current = { vx: 0, vy: 0, targetAngle: angleRef.current };
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16, 3);
      last = now;

      // Slow constant rotation
      angleRef.current = (angleRef.current + 0.25 * dt) % 360;

      // Autonomous drift when mouse idle > 1.5s
      const idle = Date.now() - lastMouseTime.current;
      if (idle > 1500) {
        if (Math.random() < 0.04) {
          drift.current.vx += (Math.random() - 0.5) * 0.6;
          drift.current.vy += (Math.random() - 0.5) * 0.6;
        }
        drift.current.vx *= 0.985;
        drift.current.vy *= 0.985;
        const speed = Math.hypot(drift.current.vx, drift.current.vy);
        const maxSpeed = 1.2;
        if (speed > maxSpeed) {
          drift.current.vx *= maxSpeed / speed;
          drift.current.vy *= maxSpeed / speed;
        }

        posRef.current.x = Math.max(
          10,
          Math.min(window.innerWidth - 10, posRef.current.x + drift.current.vx * dt)
        );
        posRef.current.y = Math.max(
          10,
          Math.min(window.innerHeight - 10, posRef.current.y + drift.current.vy * dt)
        );
        setPos({ x: posRef.current.x, y: posRef.current.y });
      }

      setAngle(angleRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
        pointerEvents: 'none',
        zIndex: 99999,
        width: 28,
        height: 28,
        willChange: 'transform, left, top',
      }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28">
        {/* antennae */}
        <path d="M14 5 Q11 3 9 6" fill="none" stroke="#1A1714" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M18 5 Q21 3 23 6" fill="none" stroke="#1A1714" strokeWidth="1.3" strokeLinecap="round" />
        {/* head */}
        <ellipse cx="16" cy="9" rx="4.5" ry="3" fill="#1A1714" />
        {/* body (thorax + abdomen) */}
        <ellipse cx="16" cy="18" rx="6" ry="9" fill="#1A1714" />
        {/* wing line down the middle */}
        <line x1="16" y1="12" x2="16" y2="25" stroke="#3a3128" strokeWidth="0.6" />
        {/* legs - left side */}
        <path d="M11 14 L6 12" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M10 18 L4 19" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M11 22 L6 25" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
        {/* legs - right side */}
        <path d="M21 14 L26 12" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M22 18 L28 19" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M21 22 L26 25" stroke="#1A1714" strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </div>
  );
}
