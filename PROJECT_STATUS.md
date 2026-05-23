# CJP DRIP — Project Status & Handoff

**Last updated:** 23 May 2026
**Live at:** [cjpdrip.store](https://cjpdrip.store)
**Repo:** github.com/hussainsameer/cjpdrip-store
**Owner:** Sayyad Sameer Hussain (`hussainzsameer@gmail.com`, +91 70664 57710)

---

## 🟢 What's LIVE

### The website
- **Domain:** cjpdrip.store (GoDaddy, A record → Vercel `216.198.79.1`, CNAME `www → cname.vercel-dns.com`)
- **Hosting:** Vercel — project `cjpdrip-store` under team `sameer-s-projects7`
- **Stack:** Next.js 14, deployed from `main` branch
- **SSL:** Auto (Let's Encrypt via Vercel)

### Payments — LIVE MODE
- **Razorpay account:** activated, KYC done
- **Live keys:** `rzp_live_Ss2kJXGsndWfEa` (Key ID) + secret in Vercel env vars
- **Webhook:** `https://cjpdrip.store/api/webhook`, secret `cjp_whk_8f3c9a2b7e1d4f6c5a8b9d2e3f4a5b6c`, events: `payment.captured / payment.failed / order.paid`
- **Settlement balance:** small balance accumulated from test orders
- **Donate link:** `razorpay.me/@cjpdrip` (separate from store checkout)

### Product catalog (24 products)
| Category | Count | Products |
|----------|-------|----------|
| Tees | 15 | parasite-of-the-system, black-protest-tee, cjp-official-logo, apocalypse-no-job, roach-before-rozgar, main-bhi-cockroach, vote-for-the-lazy, annual-report-survived, address-to-the-nation, cool-under-fire, cockroach-in-chief, inflation-survivor, wifi-greater-than-wages, pothole-insurance, power-cut-champion |
| Mugs | 4 | cockroach-in-chief, wifi-greater-than-wages, parasite, roach-before-rozgar |
| Stickers | 5 | cjp-logo, roach-pack, parasite, main-bhi-cockroach, roach-before-rozgar |
| Posters | 3 | cockroach-in-chief, address-to-the-nation, vote-for-the-lazy |

**Removed/legally pulled:** Tricolor Roach (flag), Unemployed by Profession (personalization broke with PNG), Manifesto Tee+Mug (flag elements), Unmute the Mic (flag elements)

### Pages built
- `/` — homepage (mobile scroller + grid)
- `/products/[slug]` — PDP with size/colour/qty + Razorpay checkout
- `/stickers` — stickers section
- `/posters` — posters section
- `/news` — auto-updated press archive (15+ entries, bot adds more 3×/day)
- `/predict` — Sunday Bet page (live IG follower ticker + 6 vote options + share buttons)
- `/join` — Join the Party form
- `/artists` — Designer applications form
- `/cart`, `/checkout`, `/success`
- `/terms`, `/privacy`, `/shipping`, `/refunds`, `/contact`

### Integrations
- **Google Search Console:** verified (HTML file `googlec0b9874e9650431e.html`), sitemap submitted
- **Bing Webmaster:** imported from GSC
- **Google Sheet capture:** all form submissions land in [CJP Drip — Members Sheet](https://docs.google.com/spreadsheets/d/13Hlbn_5fjNndfnFdIu5soH0Qup5ij_3N2-R7MWwWv7g/edit)
  - Apps Script Web App URL stored in Vercel env `GOOGLE_SHEET_WEBHOOK_URL`
  - Columns: Timestamp, Name, Email, City, Reason, Source, Phone, Address, State, Pincode, Amount, Order ID, Payment ID
  - Sources distinguished: `join-page`, `artist-application`, `prediction-vote`, `order-paid`
  - Dedups by Payment ID
- **Instagram (manual posting):** @cockroach_janta_party.merch
- **Auto news bot:** GitHub Action, runs 9 AM/3 PM/9 PM IST. Fetches Google News RSS for "Cockroach Janta Party"/"Abhijeet Dipke"/etc., dedupes, appends to `lib/news.ts`, commits. Requires GitHub repo write permission (Settings → Actions → workflow permissions → Read and write).

### Brand assets in repo
- **CJP logo:** built as inline SVG component (`components/CJPLogo.tsx`) — no image dependency
- **Mascot image:** `/public/cjp.jpeg` (used in `og:image` for sharing)
- **Cockroach cursor:** desktop + mobile (`components/CockroachCursor.tsx`) — animated, drifts when idle, drop-shadow halo for dark bgs

### Special features
- **Side-popup cockroaches:** "Designer Roach" (links to /artists) and "Joiner Roach" (links to /join) — appear every 30s, can be dismissed
- **Donate FAB:** bottom-right red button "Fund a Tee → make a roach employed", links to razorpay.me handle
- **Mobile scroller:** horizontal swipeable product carousel at top of homepage on mobile
- **Hamburger menu:** mobile nav with full-screen overlay

---

## 📁 Important file paths

```
M:\CJP\cjp-shop-extracted\cjp-shop\
├── lib/
│   ├── products.ts            ← all 24 products
│   └── news.ts                ← news archive (manual + bot-appended)
├── app/
│   ├── api/
│   │   ├── razorpay/route.ts  ← order creation (live keys env)
│   │   ├── verify/route.ts    ← signature verification
│   │   ├── webhook/route.ts   ← Razorpay webhook (forwards to Sheet)
│   │   ├── join/route.ts      ← members form (forwards to Sheet)
│   │   └── predict/route.ts   ← vote tracking (forwards to Sheet)
│   └── [pages]
├── components/
│   ├── Nav.tsx                ← desktop nav + mobile hamburger
│   ├── DesignVisual.tsx       ← PNG → SVG fallback chain
│   ├── MobileProductScroller.tsx
│   ├── CockroachCursor.tsx
│   ├── DonateButton.tsx
│   ├── RoachPopups.tsx
│   └── CJPLogo.tsx
├── public/
│   ├── designs/               ← flat artwork PNGs (fallback)
│   ├── mockups/               ← product mockup PNGs (preferred)
│   └── cjp.jpeg               ← mascot / OG image
├── scripts/
│   ├── update-news.mjs        ← run by GitHub Action 3×/day
│   ├── generate-designs.mjs   ← regen flat artwork
│   ├── generate-mockups.mjs   ← regen product mockups (tees, mugs, stickers, posters)
│   ├── generate-instagram.mjs ← IG posts Vol 1 (10 graphics)
│   ├── generate-posts-v2.mjs  ← IG posts Vol 2 (15 graphics)
│   └── generate-reels.mjs     ← 6 Reel covers
├── instagram-content/
│   ├── CALENDAR.md            ← 14-day plan (Vol 1)
│   ├── images/                ← 10 Vol 1 PNGs
│   ├── posts-v2/
│   │   ├── CAPTIONS.md        ← captions for 15 Vol 2 posts
│   │   └── *.png              ← 15 Vol 2 graphics
│   └── reels/
│       ├── REELS_PLAYBOOK.md  ← scripts + music + filming for 6 Reels
│       └── images/            ← 6 Reel covers
└── .github/workflows/
    └── news-update.yml        ← cron 3×/day, auto-news
```

---

## 🔑 Vercel environment variables (set, redeploy if changed)

| Name | Value | Notes |
|------|-------|-------|
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_Ss2kJXGsndWfEa` | Public, embedded in checkout |
| `RAZORPAY_KEY_SECRET` | (private, in Vercel only) | Used by /api/razorpay |
| `RAZORPAY_WEBHOOK_SECRET` | `cjp_whk_8f3c9a2b7e1d4f6c5a8b9d2e3f4a5b6c` | Validates webhook payloads |
| `GOOGLE_SHEET_WEBHOOK_URL` | `https://script.google.com/macros/s/AKfycbzvCmPABrNlFDm6pSoTQCcwEX7Bc0e-RbayTCtBTklOTjw4e__rXsnPcI3_CSKA_0LQoQ/exec` | Members Sheet endpoint |

---

## 🔑 External services & access

| Service | Account | Purpose |
|---------|---------|---------|
| **GoDaddy** | hussainzsameer@gmail.com | Domain cjpdrip.store |
| **Vercel** | sameer-s-projects7 (via GitHub) | Hosting |
| **GitHub** | hussainsameer | Repo, Actions |
| **Razorpay** | hussainzsameer@gmail.com | Payments (LIVE mode) |
| **Google Cloud** | hussainzsameer@gmail.com | Billing for Gemini API (My First Project) |
| **Google AI Studio** | API key for Gemini Image — burn this after launch, regen if exposed |
| **Google Sheets** | CJP Drip — Members (auto-capture all form data) |
| **Google Search Console** | hussainzsameer@gmail.com | SEO indexing |
| **Bing Webmaster** | imported from GSC | Bing/DuckDuckGo SEO |
| **Instagram** | @cockroach_janta_party.merch (merch) + @cockroachjantaparty (party) | Social |
| **cockroachjantaparty.org** | (party site) | Linked from nav/footer "The Party ↗" |

---

## ❌ What's NOT done yet

1. **Real product photography** — current mockups are AI-generated. Print sample tees, photograph them, replace PNGs in `/public/mockups/`
2. **Email infrastructure** — `support@cjpdrip.store` doesn't exist. Set up via GoDaddy email forwarding (free) or Zoho Mail
3. **PNG compression** — current PNGs are 1.5-2 MB each. TinyPNG/Sharp would cut 80%
4. **Instagram automation** — currently manual posting. Could wire up Meta Graph API for auto-scheduling
5. **Live Instagram follower count on /predict** — currently a simulated counter. Real data needs Instagram Graph API setup
6. **Live deploy verification on mobile** — user has reported mobile sometimes doesn't show latest. Hard refresh in incognito normally fixes
7. **Trademark filing** — "CJP DRIP" + logo not registered with IP India yet (~₹4,500 + 18 mo wait)

---

## ⚠️ Known risks / things to keep an eye on

1. **Indian flag content** — strict rule: NO saffron/white/green stripes, NO Ashoka Chakra, NO national symbols. Any AI-generated content must be checked. Three products were pulled for this reason.
2. **Party symbol confusion** — AAP = broom 🧹. We replaced the broom cockroach with a smartphone-holding cockroach. Don't reintroduce broom/jhadu imagery.
3. **API key exposure** — the Gemini key `AIzaSyCPEYBlQr_OHZtryT2WMjPHN0fyzVfmmFU` was used during the session. Burn it after launch — go to AI Studio → Delete key → regenerate.
4. **Gemini's text spelling** — ~30% of generated mockups misspell "COCKROACHES". Visual QA needed before pushing to production. Already happened with "COSCRRICHES".
5. **Plan limits** — Anthropic 5-hour limit hit ~94% during this session. May need to switch to fresh chat or different model variant.

---

## 🚀 Recommended next steps (priority order)

### This week
1. **Schedule all 25 IG posts + 6 Reels** in Meta Business Suite (one Sunday evening = done for 2-3 weeks)
2. **Print 2-3 sample tees** from a local screen printer, photograph in good light, replace mockups for those slugs
3. **Set up `support@cjpdrip.store` email forwarding** in GoDaddy
4. **Burn the Gemini API key**, regenerate, update Vercel env

### Next 2 weeks
5. **Add Google Analytics 4** for traffic insights
6. **Compress all PNGs** (TinyPNG bulk upload, 30 min)
7. **Real Instagram Graph API integration** for live follower count
8. **Test full payment flow** with a ₹50 self-order

### Month 1
9. **Trademark "CJP DRIP" + logo** via IP India (vakil/legal service)
10. **Add Cloudflare in front of Vercel** for DDoS protection (free)
11. **Real product photography session** for all 24 products
12. **Hire 1 designer via /artists form** + start commissioning new drops

---

## 💬 How to pick up where this left off

When opening a fresh Claude chat:

1. **Copy-paste the contents of this file** as your first message, prefixed with: *"This is the project I'm continuing. Read this and confirm you understand the current state."*
2. Then ask Claude for the **next thing** you want to do (more designs, fix a bug, launch something).
3. Claude can read the repo at `M:\CJP\cjp-shop-extracted\cjp-shop\` and pick up immediately.

**Key files to share/show:**
- `lib/products.ts` for product catalog
- `instagram-content/` for social state
- `PROJECT_STATUS.md` (this file) for everything else

---

## 📞 Emergency commands

```bash
# Local dev server
cd "M:\CJP\cjp-shop-extracted\cjp-shop"
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm run dev

# Regenerate one product mockup
$env:GEMINI_API_KEY="<your-key>"
node scripts/generate-mockups.mjs <slug>

# Trigger Vercel redeploy (when webhook misses)
git commit --allow-empty -m "Re-trigger deploy"
git push

# Force news bot to run now
# Go to GitHub Actions → News Auto-Update → Run workflow
```

---

**Built between 21–23 May 2026. ~50 hours of focused work. From zero to live political-satire merch store.**

**The swarm is online. Vote with your chest.**
