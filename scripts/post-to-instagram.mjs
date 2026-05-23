// CJP Instagram Auto-Poster (Meta Graph API)
// Posts queued images + captions to your IG Business account.
//
// SETUP (you do once):
//   1. Convert IG to Business account, link to a Facebook Page
//   2. Create a Meta app at developers.facebook.com → add Instagram Graph API
//   3. Generate a long-lived Page Access Token (60 days, renewable)
//   4. Get your Instagram Business Account ID
//   5. Push all images you want to post into public/ig-queue/ so they're publicly accessible
//   6. Edit instagram-content/queue.json with the posts you want
//
// RUN:
//   $env:IG_ACCESS_TOKEN="EAA..."
//   $env:IG_BUSINESS_ID="178..."
//   node scripts/post-to-instagram.mjs
//
// FLAGS:
//   --dry-run    Show what would post, don't actually post
//   --slug X     Post only the item with id === X
//
// QUEUE FILE FORMAT (instagram-content/queue.json):
//   [
//     {
//       "id": "launch-hero",
//       "image_url": "https://cjpdrip.store/ig-queue/launch-hero.png",
//       "caption": "Day one. The swarm is here. ...\n\n#CJPDrip #...",
//       "posted": false
//     },
//     ...
//   ]

import { readFile, writeFile } from 'node:fs/promises';

const TOKEN = process.env.IG_ACCESS_TOKEN;
const IG_USER_ID = process.env.IG_BUSINESS_ID;
const QUEUE_FILE = 'instagram-content/queue.json';
const API_VERSION = 'v21.0';

if (!TOKEN || !IG_USER_ID) {
  console.error('Missing IG_ACCESS_TOKEN or IG_BUSINESS_ID env vars.');
  process.exit(1);
}

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const slugArg = args.find((a, i, arr) => arr[i - 1] === '--slug');

async function callMeta(path, params, method = 'POST') {
  const url = `https://graph.facebook.com/${API_VERSION}/${path}`;
  const body = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = await fetch(url, {
    method,
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: method === 'POST' ? body.toString() : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Meta API ${res.status}: ${text.slice(0, 400)}`);
  }
  return res.json();
}

async function postOne(item) {
  console.log(`\n[POST] ${item.id}`);
  console.log(`  image: ${item.image_url}`);
  console.log(`  caption: ${item.caption.slice(0, 80)}...`);

  if (isDryRun) {
    console.log('  (dry-run, skipping)');
    return { ok: true, dry: true };
  }

  // Step 1: Create media container
  const container = await callMeta(`${IG_USER_ID}/media`, {
    image_url: item.image_url,
    caption: item.caption,
  });
  console.log(`  ✓ container created: ${container.id}`);

  // Step 2: Publish the container
  // Meta requires a moment between create and publish
  await new Promise((r) => setTimeout(r, 3000));
  const published = await callMeta(`${IG_USER_ID}/media_publish`, {
    creation_id: container.id,
  });
  console.log(`  ✓ PUBLISHED → IG post ID: ${published.id}`);

  return { ok: true, ig_post_id: published.id };
}

async function main() {
  const raw = await readFile(QUEUE_FILE, 'utf8');
  const queue = JSON.parse(raw);

  const targets = slugArg
    ? queue.filter((q) => q.id === slugArg)
    : queue.filter((q) => !q.posted);

  if (targets.length === 0) {
    console.log('Nothing to post. (All posted, or slug not found.)');
    return;
  }

  console.log(`Will post ${targets.length} item(s)${isDryRun ? ' [DRY RUN]' : ''}.`);

  for (const item of targets) {
    try {
      const result = await postOne(item);
      if (!isDryRun && result.ok) {
        item.posted = true;
        item.posted_at = new Date().toISOString();
        item.ig_post_id = result.ig_post_id;
      }
    } catch (err) {
      console.error(`  ✗ FAILED: ${err.message}`);
    }
    // Be polite — wait between posts so Meta doesn't rate-limit
    await new Promise((r) => setTimeout(r, 10000));
  }

  if (!isDryRun) {
    await writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log('\nQueue file updated.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
