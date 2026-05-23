// CJP Instagram Reels content generator
// Produces vertical 9:16 portrait graphics suitable as Reel covers, openers,
// or slideshow Reels. Output goes to instagram-content/reels/images/.

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(1); }

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'instagram-content/reels/images';

const STRICT = `Strict rules: spell "COCKROACHES" exactly C-O-C-K-R-O-A-C-H-E-S. NO Indian flag, no saffron-white-green tricolor stripes, no Ashoka Chakra. Use only ink black, deep red #C8331C, cream #EFE6D2 as design colors. No watermarks, no AI signatures.`;

const STYLE_BASE = `Vertical 9:16 mobile portrait poster, designed for Instagram Reels. Tall portrait composition with content flowing top-to-bottom. Bold typographic design, screen-print/riso aesthetic with paper grain, heavy ink texture. Premium contrast and readability on small phone screens. ${STRICT}`;

const REELS = [
  // --- 5 STICKER REELS ---
  {
    slug: 'reel-sticker-cjp-logo',
    prompt: `${STYLE_BASE}\n\nA hyper-real product photograph (9:16 vertical) of a CJP cockroach logo vinyl sticker being peeled by a hand and placed onto a black laptop lid. The sticker shows a cockroach silhouette inside a bold circle with "CJP" text. Top of frame: heavy bold display text "STICK / WITH / US." (last word red). Bottom strip: monospace text "CJPDRIP.STORE · ₹79". Sticker looks real — has shadow, slight peel curl. Cinematic close-up. Phone wallpaper feel.`,
  },
  {
    slug: 'reel-sticker-parasite',
    prompt: `${STYLE_BASE}\n\nA 9:16 vertical product reel cover. Bold typographic top half: "PARASITE / OF THE / SYSTEM." in massive heavy display type, last word red. Bottom half: a real die-cut vinyl sticker showing the "PARASITE" stamp, photographed slightly tilted on a textured concrete surface with realistic shadow. Bottom strip monospace: "STICKER · ₹79 · CJPDRIP.STORE"`,
  },
  {
    slug: 'reel-sticker-roach-pack',
    prompt: `${STYLE_BASE}\n\nA 9:16 vertical Reel cover. Top text in heavy display: "6 ROACHES / FOR THE / PRICE OF / NONE." (last line red). Below: a hyper-real overhead photograph of six small cockroach silhouette stickers in various sizes scattered on a cream surface, casting realistic shadows. Bottom strip monospace: "PACK OF 6 · ₹149 · CJPDRIP.STORE"`,
  },
  {
    slug: 'reel-sticker-main-bhi-cockroach',
    prompt: `${STYLE_BASE}\n\nA 9:16 vertical Reel cover. TOP HALF — massive Devanagari script "मैं भी कॉकरोच" in heavy bold weight, centered. Below in display: "MAIN BHI / COCKROACH." (second line red). BOTTOM HALF — a real die-cut vinyl sticker of this design photographed on a desk next to a cup of chai, slight peel at corner. Bottom monospace strip: "STICKER · ₹79 · CJPDRIP.STORE"`,
  },
  {
    slug: 'reel-sticker-roach-before-rozgar',
    prompt: `${STYLE_BASE}\n\nA 9:16 vertical Reel cover. Top in heavy display: "ROACH / BEFORE / ROZGAR." (last word red). Below: a hyper-real product photograph of the sticker placed on the back of a laptop in a coworking space, blurred coffee cup in background. Bottom strip monospace: "STICKER · ₹79 · CJPDRIP.STORE"`,
  },

  // --- VIRAL DESIGNER RECRUITMENT REEL ---
  {
    slug: 'reel-designers-wanted',
    prompt: `${STYLE_BASE}\n\nA 9:16 vertical viral protest-poster style Reel cover. MASSIVE bold display text filling 60% of the canvas: "WANTED:" (top), then "DESIGNERS." (centered, red, biggest). Below in heavy condensed: "ILLUSTRATORS. / TROUBLEMAKERS." Bottom section in monospace lines stacked: "WE PAY. / WE PUBLISH. / WE CREDIT YOU." then a thick black bordered box containing "APPLY → CJPDRIP.STORE/ARTISTS". At very bottom, tiny italic: "(must love cockroaches.)" Heavy ink texture, vintage protest poster paper grain. No images, pure type-driven poster.`,
  },
];

async function gen(reel, index, total) {
  console.log(`\n[${index + 1}/${total}] ${reel.slug}`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = { contents: [{ parts: [{ text: reel.prompt }] }] };
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
        if (res.status === 429) { console.log('  rate limited — waiting 12s…'); await new Promise(r => setTimeout(r, 12000)); continue; }
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const inline = parts.find(p => p.inlineData?.data || p.inline_data?.data);
      const b64 = inline?.inlineData?.data || inline?.inline_data?.data;
      if (!b64) throw new Error('No image in response');
      const buf = Buffer.from(b64, 'base64');
      const outPath = join(OUT_DIR, `${reel.slug}.png`);
      await writeFile(outPath, buf);
      console.log(`  ✓ saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      return true;
    } catch (err) {
      console.warn(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await new Promise(r => setTimeout(r, 3000));
    }
  }
  console.error(`  ✗ giving up on ${reel.slug}`);
  return false;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const arg = process.argv[2];
  const targets = arg ? REELS.filter(r => r.slug === arg) : REELS;
  console.log(`Generating ${targets.length} reel covers into ${OUT_DIR}/…`);
  let ok = 0;
  for (let i = 0; i < targets.length; i++) {
    if (await gen(targets[i], i, targets.length)) ok++;
    if (i < targets.length - 1) await new Promise(r => setTimeout(r, 2500));
  }
  console.log(`\nDone. ${ok}/${targets.length} succeeded.`);
}

main().catch(err => { console.error(err); process.exit(1); });
