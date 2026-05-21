# CJP · Merch — Cockroach Janta Party Tee Shop

A satirical tee shirt shop riding the Cockroach Janta Party wave.
**Next.js + Razorpay**, full cart → checkout → payment flow.

---

## Step 1 — Run it locally (do this first)

You need **Node.js 18+**. Check with `node -v`.
If you don't have it: download from https://nodejs.org

```bash
cd cjp-shop
npm install
npm run dev
```

Open http://localhost:3000

Right now Razorpay won't work yet (no keys). Everything else does —
browse the 9 designs, add to cart, see checkout. **Look at it first.
Tell me what to change before we wire payments.**

---

## Step 2 — Get Razorpay Test Keys (you do this when ready)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up (just email + phone, no KYC needed for Test mode)
3. After login, top-right toggle says **"Test Mode"** — keep it ON
4. Left sidebar → **Account & Settings → API Keys**
5. Click **"Generate Test Key"**
6. Copy both:
   - **Key Id** (starts with `rzp_test_...`)
   - **Key Secret** (long random string)

⚠ Save the Secret somewhere safe immediately — Razorpay only shows it once.

---

## Step 3 — Plug keys into the app

1. In the project folder, copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Open `.env.local` in any text editor
3. Paste your keys:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
   RAZORPAY_WEBHOOK_SECRET=leave_this_for_now
   ```
4. **Restart the dev server** (Ctrl+C, then `npm run dev` again)

---

## Step 4 — Test the full flow

1. Add a tee to cart → checkout
2. Fill the form with any test details
3. Click "Pay" — Razorpay popup opens
4. Use a **test card**:
   - Card: `4111 1111 1111 1111`
   - Expiry: any future date (e.g. `12/30`)
   - CVV: any 3 digits (e.g. `123`)
   - Name: anything
   - OTP if asked: `1234`
5. You should land on the success page.

Orders save to `.orders/` folder as JSON (we'll upgrade to a real DB later).

**Test UPI:** Use `success@razorpay` for a successful test UPI payment.

---

## Step 5 — (Later) Webhook setup

When you deploy, set up the webhook so Razorpay confirms payments server-to-server:

1. Razorpay dashboard → **Webhooks** → Create New
2. URL: `https://YOUR_DOMAIN/api/webhook`
3. Secret: generate a random string, paste into `RAZORPAY_WEBHOOK_SECRET` in `.env.local`
4. Subscribe to: `payment.captured`, `payment.failed`, `order.paid`

---

## Step 6 — (Later) KYC + Live mode

Test mode is fine for development. To take real money you need KYC:

1. Razorpay dashboard → **Activate Account**
2. You'll need: PAN, Aadhaar, bank account, business proof (proprietorship is fine)
3. KYC review takes 1–3 business days
4. Once approved, generate **Live API Keys** (same place as test keys, toggle Live mode)
5. Replace test keys in production env with live keys

---

## Step 7 — (Later) Deploy

Recommended: **Vercel** (free tier, made by Next.js team)

1. Push code to GitHub
2. Go to https://vercel.com → Import the repo
3. Vercel auto-detects Next.js
4. Add env vars in Vercel dashboard (same as `.env.local`)
5. Deploy — you get a `*.vercel.app` URL
6. Buy a domain later (Namecheap / GoDaddy / Vercel itself), point it at Vercel

---

## What's built

- ✅ 9 satirical tee designs (rendered as SVG/CSS, no real photos yet — replace with product photos before launch)
- ✅ Product grid + product detail pages
- ✅ Size (S–XXL), color, quantity selectors
- ✅ Cart with localStorage persistence
- ✅ Checkout with form validation
- ✅ Razorpay order creation API
- ✅ Razorpay payment signature verification
- ✅ Webhook handler
- ✅ Success page
- ✅ Mobile responsive
- ✅ Satire-safe footer disclaimer

## What's not done yet (next steps)

- ❌ Real product photos (you'll need to print sample tees and photograph them)
- ❌ Email confirmation to customer (will wire Resend / Nodemailer in Step 5)
- ❌ Real database (currently `.orders/` JSON files — fine for testing, swap for Postgres on deploy)
- ❌ Admin panel to view orders
- ❌ Inventory tracking
- ❌ Shipping integration (Shiprocket / Delhivery API)

---

## Folder structure

```
cjp-shop/
├── app/
│   ├── layout.tsx          # Root layout, loads cart + Razorpay script
│   ├── page.tsx            # Homepage with all 9 tees
│   ├── globals.css         # All styles (election-poster aesthetic)
│   ├── products/[slug]/    # Product detail pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout + payment trigger
│   ├── success/            # Order success
│   └── api/
│       ├── razorpay/       # POST: create order
│       ├── verify/         # POST: verify payment signature
│       └── webhook/        # POST: Razorpay webhook receiver
├── components/
│   ├── CartProvider.tsx    # React context for cart state
│   ├── Nav.tsx
│   ├── Footer.tsx
│   └── TeeDesign.tsx       # Renders the 9 unique designs
└── lib/
    └── products.ts         # Single source of truth for the catalog
```

---

## Important — Satire / legal note

The footer carries a disclaimer that this is independent satirical merchandise,
not affiliated with any political party, protected commentary under Article 19(1)(a).
**Designs deliberately avoid naming any individual (e.g. the CJI) personally** — they
target ideas and the system. Keep it that way to stay safe.
