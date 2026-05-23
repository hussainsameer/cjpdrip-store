// CJP Instagram Posts — Volume 2 (15 fresh posts across content pillars)
import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }
const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'instagram-content/posts-v2';

const STRICT = `Strict: spell "COCKROACHES" exactly C-O-C-K-R-O-A-C-H-E-S. NO Indian flag, no saffron-white-green stripes, no Ashoka Chakra. Use only ink black, deep red #C8331C, cream #EFE6D2. No watermarks.`;
const STYLE = `Square 1:1 Instagram post composition. Bold riso/screen-print aesthetic with paper grain texture. Heavy ink typography, premium readability on mobile. ${STRICT}`;

const POSTS = [
  // === QUOTE POSTS (3) ===
  {
    slug: 'quote-cji-original',
    prompt: `${STYLE}\n\nLarge cream-paper poster style. Top quotation mark in red, then italic serif quote: "There are youngsters like cockroaches, who don't get any employment or have any place in the profession…" — attribution at bottom right in monospace: "— CJI SURYA KANT · OPEN COURT · 15 MAY 2026". Centered, dignified, looks like a museum quote display. Bottom strip in red monospace: "WE TOOK THE WORD. WE MADE IT MERCH."`,
  },
  {
    slug: 'quote-orwell',
    prompt: `${STYLE}\n\nA typographic quote poster. Italic serif: "In a time of universal deceit, telling the truth is a revolutionary act." Attribution in monospace: "— GEORGE ORWELL". At the bottom in heavy display sans-serif in red: "ALSO: WEARING THE TRUTH." Below in tiny monospace: "CJPDRIP.STORE"`,
  },
  {
    slug: 'quote-ambedkar',
    prompt: `${STYLE}\n\nQuote poster. Italic serif: "I measure the progress of a community by the degree of progress which women have achieved." Attribution in monospace: "— DR. B. R. AMBEDKAR". Bottom in red heavy display: "AND ALSO: BY HOW MANY OF THEM CALL THEMSELVES COCKROACHES." Tiny monospace bottom: "CJPDRIP.STORE"`,
  },

  // === MEME REACTIONS (3) ===
  {
    slug: 'meme-graduates-stat',
    prompt: `${STYLE}\n\nA bold statistics infographic poster. Massive red number "29.1%" filling top half. Below in monospace: "of Indian graduates are unemployed." Below in heavy display: "WE BUILT A POLITICAL PARTY / FOR THE OTHER 29.1%." At bottom in tiny italic: "(source: govt data)" then CJPDRIP.STORE`,
  },
  {
    slug: 'meme-job-applications',
    prompt: `${STYLE}\n\nA fake email inbox screenshot graphic style. Header: "INBOX · 2,847 APPLICATIONS SENT". Stack of email subject lines: "We regret to inform you…" repeated 5 times in monospace gray. The last line in big red display: "FINE. I'LL START MY OWN PARTY." Below in cream: "JOIN @COCKROACHJANTAPARTY.MERCH"`,
  },
  {
    slug: 'meme-resume-vs-roach',
    prompt: `${STYLE}\n\nTwo-column comparison poster. Left column header "YOUR RESUME" in monospace with a worn paper texture below showing "REJECTED" stamped diagonally in red. Right column header "A COCKROACH" with a confident cockroach silhouette + green checkmark below it. Big text below both columns: "ONE OF YOU WILL SURVIVE THE APOCALYPSE." Bottom: "CJPDRIP.STORE"`,
  },

  // === CAROUSEL COVERS (3) ===
  {
    slug: 'carousel-5-reasons',
    prompt: `${STYLE}\n\nA bold carousel-cover-style poster. Top in monospace: "→ SWIPE →". Massive heavy display center: "5 REASONS / WE'RE / COCKROACHES." (last line red). Bottom strip in monospace: "1/6 · CJP MANIFESTO · @CJPDRIP". A small subtle cockroach icon top right.`,
  },
  {
    slug: 'carousel-10-jobs',
    prompt: `${STYLE}\n\nCarousel cover poster. Top monospace: "→ SWIPE FOR DESPAIR →". Center heavy display: "10 JOBS / WE WON'T / GET." (last line red). Bottom monospace strip: "1/11 · A CAREER GUIDE · CJPDRIP.STORE"`,
  },
  {
    slug: 'carousel-spot-roach',
    prompt: `${STYLE}\n\nCarousel cover. Top monospace: "→ A FIELD GUIDE →". Center heavy display: "HOW TO / SPOT A / FELLOW / COCKROACH." (third line red, fourth line in italic). Bottom monospace: "1/7 · CJP SCIENCE · CJPDRIP.STORE"`,
  },

  // === BEHIND THE SCENES (3) ===
  {
    slug: 'bts-design-process',
    prompt: `${STYLE}\n\nFlatlay style behind-the-scenes graphic. Top: "—— THE DESIGN ROOM ——" monospace. A real-feeling overhead photograph of a designer's desk: open sketchbook with cockroach doodles, a half-eaten Parle-G biscuit, chai mug, laptop showing Procreate, pencils scattered. Overlay text in big display: "EVERY TEE / STARTS HERE." (second line red). Bottom: "CJPDRIP.STORE · DROP 001"`,
  },
  {
    slug: 'bts-screen-print',
    prompt: `${STYLE}\n\nPhoto-realistic behind-the-scenes shot of a screen-printing studio: a hand pulling a squeegee across a screen, red ink visible, a freshly printed black tee on the press. Overlay text top in monospace: "—— THE PRESS ROOM ——". Bottom heavy display overlay: "PRINTED. / NOT FACTORY-MADE." (second line red). Bottom monospace: "EVERY TEE · HAND-PULLED · CJPDRIP.STORE"`,
  },
  {
    slug: 'bts-packing',
    prompt: `${STYLE}\n\nFlatlay overhead shot of a tee being folded into a kraft-paper packaging box with a handwritten "thank you" note, a CJP sticker on top. Soft daylight, cardboard texture. Top monospace overlay: "—— SHIPPING DEPT ——". Bottom heavy display: "EVERY ORDER / GETS A STICKER. / FREE." (last line red). Tiny monospace: "CJPDRIP.STORE"`,
  },

  // === TOPICAL REACTIONS (3) ===
  {
    slug: 'topical-election-day',
    prompt: `${STYLE}\n\nElection-day style protest poster. Top in heavy display: "ELECTION DAY?" Below in even bigger display in red: "VOTE / WITH YOUR / CHEST." A small printed "I VOTED" sticker mock-up in the corner. Bottom monospace: "WEAR YOUR PARTY · CJPDRIP.STORE"`,
  },
  {
    slug: 'topical-exam-results',
    prompt: `${STYLE}\n\nMock report card design. Top: "INDIAN BOARD OF / COCKROACH STUDIES" monospace. Below a name field: "NAME: ___________" and subject grades — all "F" or "ABSENT" except one row: "SURVIVAL ········· A+" in red. Bottom heavy display: "WE PASSED / THE ONLY EXAM / THAT MATTERS." Tiny: "CJPDRIP.STORE"`,
  },
  {
    slug: 'topical-monsoon',
    prompt: `${STYLE}\n\nMonsoon-themed poster. Top monospace: "—— MONSOON SEASON ——". Big display centered: "POTHOLES: +1247 / RAINFALL: 312mm / COCKROACHES: STILL HERE." (third line in red). At bottom: a small cockroach silhouette wading through puddles. Tiny monospace: "MONSOON DROP · CJPDRIP.STORE · WATERPROOF STICKERS NOW LIVE"`,
  },
];

async function gen(post, i, total) {
  console.log(`\n[${i + 1}/${total}] ${post.slug}`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = { contents: [{ parts: [{ text: post.prompt }] }] };
  let attempt = 0;
  while (attempt < 3) {
    attempt++;
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const txt = await res.text();
        if (res.status === 429) { console.log('  rate limited — waiting 12s…'); await new Promise(r => setTimeout(r, 12000)); continue; }
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const inline = parts.find(p => p.inlineData?.data || p.inline_data?.data);
      const b64 = inline?.inlineData?.data || inline?.inline_data?.data;
      if (!b64) throw new Error('No image in response');
      const buf = Buffer.from(b64, 'base64');
      await writeFile(join(OUT_DIR, `${post.slug}.png`), buf);
      console.log(`  ✓ saved ${post.slug}.png (${(buf.length / 1024).toFixed(0)} KB)`);
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
  console.log(`Generating ${POSTS.length} new IG posts into ${OUT_DIR}/…`);
  let ok = 0;
  for (let i = 0; i < POSTS.length; i++) {
    if (await gen(POSTS[i], i, POSTS.length)) ok++;
    if (i < POSTS.length - 1) await new Promise(r => setTimeout(r, 2500));
  }
  console.log(`\nDone. ${ok}/${POSTS.length} succeeded.`);
}

main().catch(e => { console.error(e); process.exit(1); });
