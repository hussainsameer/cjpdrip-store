import { NextRequest, NextResponse } from 'next/server';

let inMemoryCount = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, reason, source } = body || {};

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
    }

    inMemoryCount++;

    // Forward to Google Sheet webhook if configured
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            city: city || '',
            reason: reason || '',
            source: source || 'website',
          }),
        });
      } catch (e) {
        console.error('[CJP JOIN] Sheet forward failed:', e);
      }
    }

    console.log('[CJP JOIN]', JSON.stringify({
      ts: new Date().toISOString(),
      name,
      email,
      city: city || '',
      reason: reason || '',
      source: source || 'website',
    }));

    return NextResponse.json({ ok: true, count: inMemoryCount });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
