// CJP Product Mockup Generator
// Produces real product mockups (tee laid flat, mug, sticker, poster) with the
// design "printed" on them — replaces the flat-artwork PNGs in /designs/ with
// proper product photography mockups in /mockups/.

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error('Missing GEMINI_API_KEY env var.');
  process.exit(1);
}

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'public/mockups';

// ─── Strict no-flag, correct-spelling rules baked into every prompt ───
const STRICT_RULES = `STRICT RULES applied to the printed design: (1) Spell "COCKROACHES" exactly C-O-C-K-R-O-A-C-H-E-S — no misspellings. (2) Do NOT include any Indian flag, NO saffron-white-green tricolor stripes, NO Ashoka Chakra (24-spoke wheel), NO national flag of any country, NO ribbon, NO emblem. (3) Use only ink black, deep red #C8331C, and cream #EFE6D2 as design colors. (4) No watermarks, no AI signatures, no "Gemini" text. (5) Crisp clean spelling on every word.`;

// ─── Templates for each product format ───
const TEMPLATES = {
  tee: (artwork) =>
    `Product photograph of a charcoal heather grey cotton t-shirt laid perfectly flat on a textured weathered concrete grunge background with subtle cracks. Square frame, top-down view, the tee fills most of the frame. Crew neck visible at top. Centered on the chest of the tee is a vintage screen-printed graphic design featuring: ${artwork}. The print has authentic ink texture, slight registration imperfections, paper-grain feel. Premium streetwear product photography — Souled Store / Bewakoof quality. ${STRICT_RULES}`,

  mug: (artwork) =>
    `Product photograph of a glossy white ceramic coffee mug on a textured concrete background. Side view, handle on the right. The mug is straight-sided, photographed in soft daylight. A vintage screen-printed graphic wraps the front of the mug: ${artwork}. The print appears as if applied directly to the ceramic — slight curvature distortion. Premium product photography. ${STRICT_RULES}`,

  sticker: (artwork) =>
    `Product photograph of a single die-cut vinyl sticker laid on a weathered concrete or brown paper surface, photographed top-down. The sticker has a thin white die-cut border revealing the printed design: ${artwork}. Bold, screen-print riso aesthetic. The sticker corner is slightly peeled to show it's a real vinyl sticker. Clean product photography. ${STRICT_RULES}`,

  poster: (artwork) =>
    `Product photograph of a vintage screen-printed protest poster on aged cream paper with subtle coffee stains and worn edges, taped with brown masking tape to a weathered concrete wall. The poster shows: ${artwork}. Bold riso/screen-print style with heavy ink texture and slight paper crinkles. Vertical poster format (4:5 aspect within the square frame). Authentic protest-poster feel like 1970s Indian political posters. ${STRICT_RULES}`,
};

// ─── Each artwork concept (used inside the template) ───
const ARTWORK = {
  'black-protest-tee':
    `a single bold pure-black cockroach silhouette, centered, antennae arched upward, with tiny monospace text "CJP · EST 2026" below the cockroach. Minimal, two-tone black and cream only`,

  'parasite-of-the-system':
    `the word "PARASITE" in massive heavy condensed display type, "OF·THE·SYSTEM" in monospace beneath separated by thin horizontal rules, a small cockroach silhouette below, "★ CERTIFIED ★ STAMPED ★ PROUD ★" tiny monospace at top`,

  'cjp-official-logo':
    `a cockroach standing upright holding a glowing rectangular smartphone in its front legs (doomscroll mascot, NO BROOM, NO STICK), inside a bold black circular vinyl-record-label border, with "COCKROACH JANTA PARTY" in heavy display below the circle, and "★ VOICE OF THE DOOMSCROLL ★" red monospace tagline`,

  'apocalypse-no-job':
    `the words "WILL / SURVIVE / THE APOCALYPSE" stacked vertically in massive heavy display type, the third line in red, then "──── still ────" in monospace, then "WON'T GET / A JOB." stacked below`,

  'roach-before-rozgar':
    `a small cockroach icon at top, "ROACH" in massive heavy display below it, "· BEFORE ·" monospace, "ROZGAR" in massive red display, and "PRIORITIES · SET" in a bordered monospace box at the bottom`,

  'main-bhi-cockroach':
    `large Devanagari script "मैं भी कॉकरोच" in heavy bold weight, a divider line beneath, then "MAIN BHI / COCKROACH." in display type (second line red), with "—— A DECLARATION ——" monospace above`,

  'vote-for-the-lazy':
    `"★ OFFICIAL CAMPAIGN ★" in a thin bordered monospace box at top, then stacked massive display "VOTE / FOR THE / LAZY" with the last word huge and red, a small cockroach centered between horizontal rules, and "(satire. probably.)" tiny italic at bottom`,

  'annual-report-survived':
    `a mock government annual report cover in a bordered box, "GOVERNMENT OF NOWHERE / MINISTRY OF SURVIVING" tiny monospace at top, divider, "ANNUAL / REPORT / SURVIVED" stacked display (last word red), then "F.Y. 2025–26 / VOL. 1 · PG. 1" monospace, with "— only kpi: still here —" italic at bottom`,

  'address-to-the-nation':
    `"—— PRIME-TIME ADDRESS ——" in monospace at top, a cockroach in dark sunglasses behind a wooden podium with microphone, fist raised, faint crowd silhouettes behind, then "ADDRESS / TO THE / NATION" in massive stacked display (last word red), and "'my fellow COCKROACHES…'" italic tiny line at bottom — spell COCKROACHES correctly C-O-C-K-R-O-A-C-H-E-S`,

  'cool-under-fire':
    `a large cockroach head close-up wearing black sunglasses with antennae arching upward, then "NEVER NOT / CHILL." in massive display (second line red), and a bordered monospace tag "★ COOL UNDER FIRE ★" below`,

  'cockroach-in-chief':
    `a formal official-portrait composition inside a thick double-line oval frame: a dignified cockroach in sunglasses with a black suit and tie, centered, presidential stance. Above the frame: "—— OFFICIAL PORTRAIT ——" monospace. Below the frame: "COCKROACH / IN CHIEF" stacked display (second line red). At the bottom: "EST · 16 · MAY · 2026" tiny letter-spaced monospace`,

  'inflation-survivor':
    `a vintage grocery receipt design with dashed top and bottom borders, "—— RECEIPT N° 2026 —— / BHARAT KIRANA · GST APPLIED" monospace header, an itemized list "ATTA 1KG ₹65 / DAL 500G ₹120 / TOMATO ₹180 / HOPE 1 KG OUT OF STK", then "INFLATION / SURVIVOR" massive stacked display below (second word red)`,

  'wifi-greater-than-wages':
    `"—— THE MODERN INEQUALITY ——" in monospace at top, then a huge typographic equation "WiFi  >  WAGES" with the greater-than symbol enormous and red, and "VERIFIED · 100% TRUE" in a bordered monospace box below`,

  'pothole-insurance':
    `a mock insurance policy card with double-line border, "POLICY №. CJP·2026·PIT" monospace at top, divider, "POTHOLE / INSURANCE / CO. LTD." stacked display (last line red), divider, "COVERAGE: ALL OF BHARAT / VALID: TILL NEXT MONSOON" monospace, then "* claims processed never" italic at bottom`,

  'power-cut-champion':
    `"—— NATIONAL AWARD ——" monospace at top, a huge ★ star symbol, then "POWER CUT / CHAMPION" stacked display (second line red), three small bordered monospace badges side by side "8 HRS · DAILY · CANDLELIT", and "'survived. somehow.'" italic at bottom`,
};

// ─── Generation queue ───
// Each entry: { type: 'tee'|'mug'|'sticker'|'poster', slug: 'design-key', outFile: 'filename.png' }
const QUEUE = [
  // T-SHIRTS (15 — the current tee catalog)
  ...['black-protest-tee', 'parasite-of-the-system', 'cjp-official-logo', 'apocalypse-no-job',
      'roach-before-rozgar', 'main-bhi-cockroach', 'vote-for-the-lazy', 'annual-report-survived',
      'address-to-the-nation', 'cool-under-fire', 'cockroach-in-chief', 'inflation-survivor',
      'wifi-greater-than-wages', 'pothole-insurance', 'power-cut-champion']
    .map((slug) => ({ type: 'tee', slug, outFile: `${slug}.png` })),

  // MUGS (4 — current mug catalog reuses tee designs)
  { type: 'mug', slug: 'cockroach-in-chief', outFile: 'mug-cockroach-in-chief.png' },
  { type: 'mug', slug: 'wifi-greater-than-wages', outFile: 'mug-wifi-greater-than-wages.png' },
  { type: 'mug', slug: 'parasite-of-the-system', outFile: 'mug-parasite-of-the-system.png' },
  { type: 'mug', slug: 'roach-before-rozgar', outFile: 'mug-roach-before-rozgar.png' },

  // STICKERS (5 — current sticker catalog)
  { type: 'sticker', slug: 'cjp-official-logo', outFile: 'sticker-cjp-logo.png' },
  { type: 'sticker', slug: 'parasite-of-the-system', outFile: 'sticker-parasite.png' },
  { type: 'sticker', slug: 'main-bhi-cockroach', outFile: 'sticker-main-bhi-cockroach.png' },
  { type: 'sticker', slug: 'roach-before-rozgar', outFile: 'sticker-roach-before-rozgar.png' },
  { type: 'sticker', slug: 'black-protest-tee', outFile: 'sticker-roach-pack.png' },

  // POSTERS (3 — new product category)
  { type: 'poster', slug: 'cockroach-in-chief', outFile: 'poster-cockroach-in-chief.png' },
  { type: 'poster', slug: 'address-to-the-nation', outFile: 'poster-address-to-the-nation.png' },
  { type: 'poster', slug: 'vote-for-the-lazy', outFile: 'poster-vote-for-the-lazy.png' },
];

// ─── Generate one image ───
async function generateOne(item, index, total) {
  const artwork = ARTWORK[item.slug];
  if (!artwork) {
    console.warn(`No artwork defined for slug "${item.slug}", skipping.`);
    return false;
  }
  const prompt = TEMPLATES[item.type](artwork);
  console.log(`\n[${index + 1}/${total}] ${item.type.toUpperCase()} : ${item.outFile}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  let attempt = 0;
  while (attempt < 3) {
    attempt++;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        if (res.status === 429) {
          console.log(`  rate limited — waiting 12s…`);
          await new Promise((r) => setTimeout(r, 12000));
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const inline = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
      const dataB64 = inline?.inlineData?.data || inline?.inline_data?.data;
      if (!dataB64) {
        throw new Error(`No image in response: ${JSON.stringify(data).slice(0, 200)}`);
      }
      const buf = Buffer.from(dataB64, 'base64');
      const outPath = join(OUT_DIR, item.outFile);
      await writeFile(outPath, buf);
      console.log(`  ✓ saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      return true;
    } catch (err) {
      console.warn(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error(`  ✗ giving up on ${item.outFile}`);
  return false;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const arg = process.argv[2];
  const targets = arg
    ? QUEUE.filter((q) => q.outFile === arg || q.outFile === `${arg}.png` || q.slug === arg)
    : QUEUE;
  if (arg && targets.length === 0) {
    console.error(`No queue item matches "${arg}"`);
    process.exit(1);
  }

  console.log(`Generating ${targets.length} mockups into ${OUT_DIR}/…`);
  let ok = 0;
  for (let i = 0; i < targets.length; i++) {
    if (await generateOne(targets[i], i, targets.length)) ok++;
    if (i < targets.length - 1) await new Promise((r) => setTimeout(r, 2500));
  }
  console.log(`\nDone. ${ok}/${targets.length} succeeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
