// CJP Design Generator — calls Google's Gemini 2.5 Flash Image (Nano Banana)
// for each tee design, saves PNGs to /public/designs/.
//
// USAGE:
//   set GEMINI_API_KEY=AIzaSy...            (Windows cmd)
//   $env:GEMINI_API_KEY="AIzaSy..."         (PowerShell)
//   export GEMINI_API_KEY=AIzaSy...         (mac/linux)
//   node scripts/generate-designs.mjs
//
// You can also generate a single design by passing its slug:
//   node scripts/generate-designs.mjs black-protest-tee

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
if (!API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY env var.');
  console.error('   Get one at https://aistudio.google.com/app/apikey');
  process.exit(1);
}

const MODEL = 'gemini-2.5-flash-image';
const OUT_DIR = 'public/designs';

// Shared style preamble — keeps every design visually consistent.
const STYLE = `Create a high-contrast, screen-printed graphic t-shirt artwork. Style: bold riso/screen-print aesthetic with subtle paper grain. Color palette strictly: ink black #1A1714, deep red #C8331C, cream #EFE6D2 with optional Indian flag accents saffron #FF9933 and green #138808. Centered composition on a cream-colored 1:1 square canvas, 1024×1024. Typography: heavy display sans-serif for headlines, monospace for small text. Distressed ink edges, vintage Indian political poster meets modern streetwear. No photographs, no gradients, no glossy effects. Print-ready flat artwork. Now design: `;

const DESIGNS = [
  {
    slug: 'black-protest-tee',
    prompt: `A single bold pure-black cockroach silhouette, centered on the cream canvas. NO red stripes on the body, NO Spider-Man references. Pure black ink silhouette only. Antennae arched upward. Minimal, iconic, like a heritage brand logomark (think Adidas trefoil simplicity). Below the cockroach in small monospace: "CJP · EST 2026". Wordless above. Strong negative space.`,
  },
  {
    slug: 'parasite-of-the-system',
    prompt: `A large bold word "PARASITE" in heavy display type, "OF·THE·SYSTEM" in monospace beneath separated by horizontal rules, a small cockroach silhouette below, "★ CERTIFIED ★ STAMPED ★ PROUD ★" in tiny monospace at top. Vintage rubber-stamp badge feel.`,
  },
  {
    slug: 'secular-socialist-democratic-lazy',
    prompt: `Four words stacked vertically in massive display type: "SECULAR." "SOCIALIST." "DEMOCRATIC." "LAZY." — the last word in red. Above: "— THE PARTY LINE —" in monospace. Constitutional preamble energy.`,
  },
  {
    slug: 'cjp-official-logo',
    prompt: `A cockroach standing upright, holding a SMARTPHONE in one of its front legs (held up like reading/scrolling). STRICTLY NO BROOMS, NO JHADU, NO STICKS. Just a cockroach with a cellphone. The phone has a faint screen glow. Inside a bold black circle frame. Below the circle: "COCKROACH JANTA PARTY" in heavy display type. Bottom tagline: "★ VOICE OF THE DOOMSCROLL ★" in red monospace. The smartphone is the only object — no other props.`,
  },
  {
    slug: 'unemployed-by-profession',
    prompt: `A vintage business card layout with double-rule border. Inside: "YOUR NAME HERE" in big display type, "Unemployed by Profession" in italic monospace, divider line, then "EXP — 0 YRS / CTC — ₹0.00 LPA / STATUS — STILL HERE" stacked in monospace. "CJP·2026" in tiny mono bottom-right.`,
  },
  {
    slug: 'apocalypse-no-job',
    prompt: `Bold stacked headline: "WILL / SURVIVE / THE APOCALYPSE" (the third line in red), then "──── still ────" in monospace, then "WON'T GET / A JOB." Heavy display type, manifesto poster energy.`,
  },
  {
    slug: 'roach-before-rozgar',
    prompt: `A small cockroach icon at top. Below: "ROACH" in massive display type, "· BEFORE ·" in monospace, "ROZGAR" in massive display type red. Bottom: "PRIORITIES · SET" in a thin monospace bordered box.`,
  },
  {
    slug: 'main-bhi-cockroach',
    prompt: `Big Devanagari script: "मैं भी कॉकरोच" in heavy bold, beneath it a divider, then "MAIN BHI / COCKROACH." in display type (second line red). Above: "—— A DECLARATION ——" in monospace. Solidarity-poster feel.`,
  },
  {
    slug: 'vote-for-the-lazy',
    prompt: `"★ OFFICIAL CAMPAIGN ★" in a thin bordered box at top. Then stacked massive display: "VOTE / FOR THE / LAZY" (last word huge and red). A small cockroach centered between horizontal rules. Bottom: "BANKIPUR · BIHAR · 2026" in monospace and "(satire. probably.)" in tiny italic.`,
  },
  {
    slug: 'annual-report-survived',
    prompt: `A mock government annual report cover: bordered box, "GOVERNMENT OF NOWHERE / MINISTRY OF SURVIVING" tiny monospace, divider, "ANNUAL / REPORT / SURVIVED" stacked display (last in red), then "F.Y. 2025–26 / VOL. 1 · PG. 1" monospace. Bottom: "— only kpi: still here —" italic.`,
  },
  {
    slug: 'address-to-the-nation',
    prompt: `A cockroach in sunglasses standing behind a podium, microphone at front, fist raised. Crowd silhouettes faintly behind. Above: "—— PRIME-TIME ADDRESS ——" monospace. Below: "ADDRESS / TO THE / NATION" stacked display (last word red). Tiny italic: "'my fellow cockroaches…'"`,
  },
  {
    slug: 'cool-under-fire',
    prompt: `A large cockroach head close-up with black sunglasses, antennae arching up. Below: "NEVER NOT / CHILL." in massive display (second line red). A bordered monospace tag: "★ COOL UNDER FIRE ★".`,
  },
  {
    slug: 'tricolor-roach',
    prompt: `A horizontal tricolor band design: saffron stripe top, cream middle, green stripe bottom, with a centered cockroach silhouette on the cream band. Below: "THE TRICOLOR / ROACH" display (second word red). Bottom: "SECULAR · SOCIALIST · LAZY" monospace.`,
  },
  {
    slug: 'cockroach-in-chief',
    prompt: `A formal "official portrait" composition. Inside a double-line oval frame: a dignified cockroach in sunglasses centered, presidential pose. Above: "—— OFFICIAL PORTRAIT ——" monospace. Below: "COCKROACH / IN CHIEF" display (second in red). Bottom: "EST · 16 · MAY · 2026" tiny monospace letter-spaced.`,
  },
  {
    slug: 'inflation-survivor',
    prompt: `A vintage grocery receipt design with dashed top and bottom borders. Header: "—— RECEIPT N° 2026 —— / BHARAT KIRANA · GST APPLIED" monospace. Itemized list: "ATTA 1KG ₹65", "DAL 500G ₹120", "TOMATO ₹180", "HOPE 1 KG OUT OF STK". Below: "INFLATION / SURVIVOR" display (second word red).`,
  },
  {
    slug: 'wifi-greater-than-wages',
    prompt: `"—— THE MODERN INEQUALITY ——" monospace at top. Then huge display: "WiFi  >  WAGES" with the > symbol enormous in red. Below: "VERIFIED · 100% TRUE" in a monospace bordered box.`,
  },
  {
    slug: 'unmute-the-mic',
    prompt: `"[ ARTICLE 19(1)(a) ]" monospace at top. Centered massive display: "FREE / SPEECH" with a thick red strike-through diagonal line through it. Below in a thick black bordered box: "*T&C APPLY" monospace. Tiny italic: "(unmute the mic.)"`,
  },
  {
    slug: 'pothole-insurance',
    prompt: `A mock insurance policy card with double-line border. Inside: "POLICY №. CJP·2026·PIT" monospace, divider, "POTHOLE / INSURANCE / CO. LTD." stacked display (last in red), divider, "COVERAGE: ALL OF BHARAT / VALID: TILL NEXT MONSOON" monospace. Bottom italic: "* claims processed never".`,
  },
  {
    slug: 'power-cut-champion',
    prompt: `"—— NATIONAL AWARD ——" monospace at top. A huge ★ star symbol. Then "POWER CUT / CHAMPION" stacked display (second in red). Below three bordered monospace badges side by side: "8 HRS · DAILY · CANDLELIT". Bottom italic: "'survived. somehow.'"`,
  },
];

async function generateOne(design, index, total) {
  const fullPrompt = STYLE + design.prompt;
  console.log(`\n[${index + 1}/${total}] Generating: ${design.slug}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
  const body = {
    contents: [{ parts: [{ text: fullPrompt }] }],
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
          console.log(`  rate limited — waiting 12s before retry…`);
          await new Promise((r) => setTimeout(r, 12000));
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const parts = data?.candidates?.[0]?.content?.parts || [];
      const imgPart = parts.find((p) => p.inlineData?.data || p.inline_data?.data);
      const inline = imgPart?.inlineData || imgPart?.inline_data;
      if (!inline?.data) {
        throw new Error(`No image in response: ${JSON.stringify(data).slice(0, 200)}`);
      }
      const buf = Buffer.from(inline.data, 'base64');
      const outPath = join(OUT_DIR, `${design.slug}.png`);
      await writeFile(outPath, buf);
      console.log(`  ✓ saved ${outPath} (${(buf.length / 1024).toFixed(0)} KB)`);
      return true;
    } catch (err) {
      console.warn(`  attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 3000));
    }
  }
  console.error(`  ✗ giving up on ${design.slug}`);
  return false;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const arg = process.argv[2];
  const targets = arg ? DESIGNS.filter((d) => d.slug === arg) : DESIGNS;
  if (arg && targets.length === 0) {
    console.error(`No design with slug "${arg}"`);
    console.error('Available slugs:', DESIGNS.map((d) => d.slug).join(', '));
    process.exit(1);
  }

  console.log(`Generating ${targets.length} designs into ${OUT_DIR}/…`);
  let ok = 0;
  for (let i = 0; i < targets.length; i++) {
    const success = await generateOne(targets[i], i, targets.length);
    if (success) ok++;
    // Gentle pacing between requests (Gemini free tier RPM)
    if (i < targets.length - 1) await new Promise((r) => setTimeout(r, 2500));
  }
  console.log(`\nDone. ${ok}/${targets.length} succeeded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
