// CJP News Auto-Updater
// Pulls Google News RSS for CJP-related queries, dedupes against existing
// entries in lib/news.ts, and appends new items. Runs in a GitHub Action.

import { readFile, writeFile } from 'node:fs/promises';

const NEWS_FILE = 'lib/news.ts';
const MARKER = '// AUTO_NEWS_BELOW';

const QUERIES = [
  'Cockroach Janta Party',
  '"CJP" India satire',
  'Abhijeet Dipke',
  'Cockroach party India followers',
];

// Title must include one of these to be considered relevant
const RELEVANCE_KEYWORDS = ['cockroach', 'janta party', 'dipke', 'cjp'];

// Cap how many new items we append in one run (avoids floods)
const MAX_NEW_ITEMS = 8;

async function fetchRSS(query) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-IN&gl=IN&ceid=IN:en`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CJP-News-Bot/1.0 (+https://cjpdrip.store)' } });
    if (!res.ok) {
      console.warn(`RSS fetch failed for "${query}": ${res.status}`);
      return '';
    }
    return await res.text();
  } catch (err) {
    console.warn(`RSS fetch error for "${query}":`, err.message);
    return '';
  }
}

function matchOne(str, re) {
  const m = str.match(re);
  return m ? m[1] : '';
}

function cleanText(s) {
  if (!s) return '';
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const it = m[1];
    items.push({
      title: cleanText(matchOne(it, /<title>([\s\S]*?)<\/title>/)),
      link: cleanText(matchOne(it, /<link>([\s\S]*?)<\/link>/)),
      pubDate: cleanText(matchOne(it, /<pubDate>([\s\S]*?)<\/pubDate>/)),
      description: cleanText(matchOne(it, /<description>([\s\S]*?)<\/description>/)),
      source: cleanText(matchOne(it, /<source[^>]*>([\s\S]*?)<\/source>/)),
    });
  }
  return items;
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'news-' + Date.now().toString(36);
}

function isoDate(s) {
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
    return d.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function isRelevant(title) {
  const t = (title || '').toLowerCase();
  return RELEVANCE_KEYWORDS.some((k) => t.includes(k));
}

function tsLiteral(value) {
  return JSON.stringify(value);
}

async function main() {
  const file = await readFile(NEWS_FILE, 'utf8');

  // Collect existing URLs + IDs to avoid dupes
  const existingUrls = new Set();
  for (const m of file.matchAll(/url:\s*'([^']+)'/g)) existingUrls.add(m[1]);
  for (const m of file.matchAll(/url:\s*"([^"]+)"/g)) existingUrls.add(m[1]);
  const existingIds = new Set();
  for (const m of file.matchAll(/id:\s*'([^']+)'/g)) existingIds.add(m[1]);
  for (const m of file.matchAll(/id:\s*"([^"]+)"/g)) existingIds.add(m[1]);

  console.log(`Existing items: ${existingUrls.size} URLs / ${existingIds.size} IDs`);

  // Fetch RSS feeds
  const seen = new Set(existingUrls);
  const newItems = [];
  for (const query of QUERIES) {
    const xml = await fetchRSS(query);
    if (!xml) continue;
    const parsed = parseRSS(xml);
    for (const item of parsed) {
      if (!item.link || !item.title) continue;
      if (seen.has(item.link)) continue;
      if (!isRelevant(item.title)) continue;
      seen.add(item.link);
      newItems.push(item);
      if (newItems.length >= MAX_NEW_ITEMS) break;
    }
    if (newItems.length >= MAX_NEW_ITEMS) break;
  }

  if (newItems.length === 0) {
    console.log('No new items.');
    return;
  }

  console.log(`Found ${newItems.length} new items.`);

  // Generate TS entries
  const usedIds = new Set(existingIds);
  const entries = newItems.map((item) => {
    let id = slugify(item.title);
    let suffix = 1;
    let candidate = id;
    while (usedIds.has(candidate)) {
      suffix += 1;
      candidate = `${id}-${suffix}`;
    }
    usedIds.add(candidate);
    const date = isoDate(item.pubDate);
    const source = item.source || 'Google News';
    // Google News RSS descriptions are just HTML-wrapped title repeats — use a
    // generic blurb instead so the news page stays clean.
    const blurb = `Read the full story on ${source}.`;

    return `  {
    id: ${tsLiteral(candidate)},
    date: ${tsLiteral(date)},
    source: ${tsLiteral(source)},
    sourceType: 'press',
    title: ${tsLiteral(item.title)},
    blurb: ${tsLiteral(blurb)},
    url: ${tsLiteral(item.link)},
    external: true,
  },`;
  });

  const insertion = entries.join('\n');

  let updated;
  if (file.includes(MARKER)) {
    updated = file.replace(MARKER, `${insertion}\n  ${MARKER}`);
  } else {
    // Fallback: insert before the array closer
    updated = file.replace(/\n\];?\s*$/, `\n${insertion}\n];\n`);
  }

  if (updated === file) {
    console.log('No file change produced (marker missing?).');
    return;
  }

  await writeFile(NEWS_FILE, updated);
  console.log(`Appended ${newItems.length} new items to ${NEWS_FILE}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
