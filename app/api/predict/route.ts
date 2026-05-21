import { NextRequest, NextResponse } from 'next/server';

const ALLOWED = new Set(['20M', '25M', '30M', '50M', '75M', '100M+']);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const choice = String(body?.choice || '');
    if (!ALLOWED.has(choice)) {
      return NextResponse.json({ error: 'Invalid choice' }, { status: 400 });
    }

    // Forward to the same Google Sheet so all CJP signals land in one place.
    const sheetUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
    if (sheetUrl) {
      try {
        await fetch(sheetUrl, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            name: '',
            email: '',
            city: '',
            reason: `Bet: ${choice} by Sunday`,
            source: 'prediction-vote',
          }),
        });
      } catch (e) {
        console.error('[CJP PREDICT] Sheet forward failed:', e);
      }
    }

    console.log('[CJP PREDICT]', JSON.stringify({ ts: new Date().toISOString(), choice }));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
