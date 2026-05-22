'use client';

import { useState } from 'react';
import type { TeeDesign as TeeDesignType } from '@/lib/products';
import { TeeDesign } from './TeeDesign';

/**
 * Tries to render a real PNG design from /public/designs/{slug}.png.
 * If the image fails to load (file not generated yet), falls back to the
 * inline SVG version from TeeDesign.
 */
export default function DesignVisual({
  design,
  customization,
}: {
  design: TeeDesignType;
  customization?: { name?: string; exp?: string };
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <TeeDesign design={design} customization={customization} />;
  }

  return (
    <img
      src={`/designs/${design.slug}.png`}
      alt={design.name}
      className="design-image"
      onError={() => setFailed(true)}
      loading="lazy"
      draggable={false}
    />
  );
}
