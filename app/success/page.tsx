'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get('id');
  return (
    <main className="success-wrap">
      <div className="success-stamp">★ PAYMENT RECEIVED ★</div>
      <h1 className="success-title">You're<br />in.</h1>
      <p className="success-msg">
        The tee is on its way. Welcome to the resistance.
        (Or at least the wardrobe of someone who claims to be.)
      </p>
      {id && <div className="success-id">Payment ID · {id}</div>}
      <div>
        <Link href="/" className="success-cta">Back to Shop →</Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="success-wrap"><div className="success-title">Loading…</div></main>}>
      <SuccessContent />
    </Suspense>
  );
}
