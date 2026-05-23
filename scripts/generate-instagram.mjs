// Generate the custom Instagram post graphics referenced by the content calendar.
// All other posts reuse /mockups/ images we already have.

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'instagram-content/images';

const STRICT = `STRICT: Spell COCKROACHES correctly as C-O-C-K-R-O-A-C-H-E-S. NO Indian flag, NO saffron-white-green stripes, NO Ashoka Chakra, NO national symbols. Use only ink black, deep red #C8331C, cream #EFE6D2. No watermarks. Square 1:1 aspect ratio, Instagram-ready.`;

const POSTS = [
  {
    file: 'launch-hero.png',
    prompt: `Square Instagram launch announcement poster. Cream textured paper background with subtle grain. Massive heavy condensed display type stacked: "DROP / №001 / LIVE" with "LIVE" in deep red and large. Above in monospace: "—— CJP DRIP IS HERE ——". A bold cockroach silhouette next to the text. Bottom: "CJPDRIP.STORE" in monospace. Riso/screen-print aesthetic, vintage poster feel. ${STRICT}`,
  },
  {
    file: 'sunday-meme.png',
    prompt: `Square Instagram meme post. Cream textured background. Top heavy display type: "SUNDAY PLANS:". Below, a checklist in monospace mono type:  "[✓] BED  [✓] DOOMSCROLL  [✓] DESPAIR  [✓] ADD CJP TEE TO CART". Bottom line in red bold: "PRODUCTIVITY IS A SCAM". Cockroach silhouette in the corner. Riso print style. ${STRICT}`,
  },
  {
    file: 'cji-quote.png',
    prompt: `Square Instagram quote poster. Aged cream paper background with subtle stains. A pull-quote in massive heavy serif italic display type: "There are youngsters like COCKROACHES, who don't get any employment…" The word COCKROACHES emphasised in red. Attribution below in monospace: "— CJI Surya Kant, in open court". Bottom small text: "8 days later: 18M cockroaches strong. cjpdrip.store". Vintage newspaper editorial feel. ${STRICT}`,
  },
  {
    file: 'poster-drop-announce.png',
    prompt: `Square Instagram announcement poster. Cream background. Top monospace: "—— DROP №003 ——". Below in massive heavy condensed display: "POSTERS" with the word in deep red, very large. Below in display: "A3 · RISO · CREAM PAPER · ₹299". A small illustration of a poster taped to a wall in the corner. Bottom monospace: "cjpdrip.store/posters". Bold screen-print riso poster aesthetic. ${STRICT}`,
  },
  {
    file: 'carousel-cover-5designs.png',
    prompt: `Square Instagram carousel cover. Cream background. Top monospace small: "SWIPE →". Below in massive heavy display type: "5 / DESIGNS / 1 / SWARM" stacked, with "1 SWARM" in deep red. A cockroach silhouette filling the bottom corner. Bottom: "WHICH ONE'S YOUR VERDICT?" in monospace italic. Bold riso/screen-print style. ${STRICT}`,
  },
  {
    file: 'monday-rebellion.png',
    prompt: `Square Instagram meme post. Cream background. Massive heavy display type stacked: "MONDAYS / ARE / PROPAGANDA" with "PROPAGANDA" in deep red, very large. Below in monospace: "CJP rejects this construct.". Below tiny: "Take a nap. Add a tee. Wear the resistance.". Cockroach silhouette in corner. Bold riso poster aesthetic. ${STRICT}`,
  },
  {
    file: 'origin-story.png',
    prompt: `Square Instagram milestone post. Cream background. Top monospace: "—— THE GROWTH ——". Below stacked massive display: "9 DAYS / 18 MILLION / COCKROACHES" with "18 MILLION" in deep red, very large. Below in monospace: "THANK YOU, SWARM 🐛". Bottom: "cjpdrip.store". Vintage poster celebratory feel. ${STRICT}`,
  },
  {
    file: 'discount-friday.png',
    prompt: `Square Instagram sale announcement poster. Cream background. Massive heavy display type stacked: "20% / OFF" with "20%" enormous in deep red. Below in monospace: "TOMORROW. 24 HOURS. CODE SWARM20.". Bottom: "cjpdrip.store · Tees · Mugs · Posters · Stickers". Bold riso poster style. ${STRICT}`,
  },
  {
    file: 'sale-live.png',
    prompt: `Square Instagram sale announcement. Cream background. Top in bold red: "● SALE IS LIVE ●". Below massive display stacked: "20% OFF / EVERYTHING" with the percentage huge in red. Below monospace block: "CODE: SWARM20 · cjpdrip.store · 24 HRS ONLY". Bold riso poster feel. ${STRICT}`,
  },
  {
    file: 'last-4-hours.png',
    prompt: `Square Instagram urgency post. Cream background, slightly distressed. Massive heavy display type stacked: "4 / HOURS / LEFT" with "LEFT" in deep red, very large. Below in monospace: "CODE SWARM20 · 20% OFF · cjpdrip.store". Bottom small italic: "Sale ends midnight. Don't sleep on it. (Actually do.)". Bold riso poster style. ${STRICT}`,
  },
];

async function gen(post, i, total) {
  console.log(`\n[${i + 1}/${total}] ${post.file}`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  let attempt = 0;
  while (attempt < 3) {
    attempt++;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: post.prompt }] }] }),
      });
      if (!res.ok) {
        const txt = await res.text();
        if (res.status === 429) { console.log('  rate limited — waiting 12s…'); await new Promise(r => setTimeout(r, 12000)); continue; }
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 150)}`);
      }
      const data = await res.json();
      const inline = (data?.candidates?.[0]?.content?.parts || []).find(p => p.inlineData?.data || p.inline_data?.data);
      const dataB64 = inline?.inlineData?.data || inline?.inline_data?.data;
      if (!dataB64) throw new Error('No image in response');
      const buf = Buffer.from(dataB64, 'base64');
      const outPath = join(OUT_DIR, post.file);
      await writeFile(outPath, buf);
      console.log(`  ✓ saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      return true;
    } catch (err) {
      console.warn(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
    }
  }
  return false;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log(`Generating ${POSTS.length} Instagram graphics into ${OUT_DIR}/…`);
  let ok = 0;
  for (let i = 0; i < POSTS.length; i++) {
    if (await gen(POSTS[i], i, POSTS.length)) ok++;
    if (i < POSTS.length - 1) await new Promise(r => setTimeout(r, 2500));
  }
  console.log(`\nDone. ${ok}/${POSTS.length} succeeded.`);
}

main().catch(err => { console.error(err); process.exit(1); });
