'use client';

import { useState } from 'react';
import type { TeeDesign as TeeDesignType } from '@/lib/products';
import { TeeDesign } from './TeeDesign';

/**
 * Render priority:
 *   1. /mockups/{slug}.png   — product mockup (tee laid flat, mug, poster, sticker)
 *   2. /designs/{slug}.png   — flat artwork fallback
 *   3. inline SVG            — final fallback
 */
export default function DesignVisual({
  design,
  customization,
}: {
  design: TeeDesignType;
  customization?: { name?: string; exp?: string };
}) {
  // 0 = mockup, 1 = design, 2 = SVG
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  if (stage === 2) {
    return <TeeDesign design={design} customization={customization} />;
  }

  const src =
    stage === 0
      ? `/mockups/${design.slug}.png`
      : `/designs/${design.slug}.png`;

  return (
    <img
      src={src}
      alt={design.name}
      className="design-image"
      onError={() => setStage((s) => (s === 0 ? 1 : 2))}
      loading="lazy"
      draggable={false}
    />
  );
}
