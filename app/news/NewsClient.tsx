'use client';

import { useState } from 'react';
import { NEWS_ITEMS } from '@/lib/news';

const FILTERS = [
  { id: 'all', label: 'Everything' },
  { id: 'press', label: 'Press' },
  { id: 'movement', label: 'Movement' },
  { id: 'drop', label: 'Drops' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function badgeColorFor(type: string) {
  switch (type) {
    case 'press':
      return 'var(--red)';
    case 'movement':
      return '#138808';
    case 'drop':
      return '#FF9933';
    default:
      return 'var(--ink)';
  }
}

export default function NewsClient() {
  const [filter, setFilter] = useState<FilterId>('all');

  const items = NEWS_ITEMS.filter((i) => (filter === 'all' ? true : i.sourceType === filter))
    .slice()
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="news-page">
      <div className="news-eyebrow">— The Live Archive · Updated by the Swarm —</div>
      <h1 className="news-title">
        News by the<br />
        <span className="red">Cockroaches.</span>
      </h1>
      <p className="news-tagline">
        Every headline, every milestone, every drop. Real press from real outlets. A swarm
        moving in real time.
      </p>

      <div className="news-filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`news-filter ${filter === f.id ? 'is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
            <span className="news-filter-count">
              {f.id === 'all'
                ? NEWS_ITEMS.length
                : NEWS_ITEMS.filter((i) => i.sourceType === f.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="news-grid">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            className="news-card"
          >
            <div className="news-card-top">
              <span
                className="news-card-badge"
                style={{ background: badgeColorFor(item.sourceType) }}
              >
                {item.source}
              </span>
              <span className="news-card-date">{formatDate(item.date)}</span>
            </div>
            <h2 className="news-card-title">{item.title}</h2>
            <p className="news-card-blurb">{item.blurb}</p>
            <div className="news-card-cta">
              {item.external ? 'Read on source ↗' : 'Open →'}
            </div>
          </a>
        ))}
      </div>

      <div className="news-foot">
        <div className="news-foot-eyebrow">— Got a sighting? —</div>
        <h3 className="news-foot-title">Spotted CJP in the wild?</h3>
        <p className="news-foot-sub">
          Send us the link — viral tweet, news article, meme, podcast mention, anything.
          We curate the best into this archive.
        </p>
        <a className="news-foot-cta" href="mailto:hussainzsameer@gmail.com?subject=CJP%20Roach%20Sighting">
          Send a sighting →
        </a>
      </div>
    </main>
  );
}
