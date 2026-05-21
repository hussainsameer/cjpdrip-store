import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory + log counter. On Vercel serverless these instances are
// ephemeral, so on real deploys we just log and return an incrementing count
// based on a timestamp + small persisted offset. For real production, swap
// this for Vercel KV / a database.

let inMemoryCount = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, city, reason } = body || {};

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Very basic email shape check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Enter a valid email.' }, { status: 400 });
    }

    inMemoryCount++;

    // Log to server (Vercel "Logs" tab will capture these)
    console.log('[CJP JOIN]', JSON.stringify({
      ts: new Date().toISOString(),
      name,
      email,
      city: city || '',
      reason: reason || '',
    }));

    return NextResponse.json({ ok: true, count: inMemoryCount });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
