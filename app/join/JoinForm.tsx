'use client';

import { useEffect, useState } from 'react';

const BASE_COUNT = 1247; // visual baseline so the number never reads as 0

export default function JoinForm() {
  const [count, setCount] = useState<number>(BASE_COUNT);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', city: '', reason: '' });

  useEffect(() => {
    // Pull persisted local count + check if this browser already joined
    try {
      const localCount = parseInt(localStorage.getItem('cjp-join-count') || '0', 10) || 0;
      if (localCount) setCount(BASE_COUNT + localCount);
      if (localStorage.getItem('cjp-joined') === '1') setSubmitted(true);
    } catch {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      const data = await res.json();
      const newCount = BASE_COUNT + (data.count || 1);
      setCount(newCount);
      try {
        localStorage.setItem('cjp-join-count', String(data.count || 1));
        localStorage.setItem('cjp-joined', '1');
      } catch {}
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="join-form-wrap">
      <div className="join-counter">
        <div className="join-counter-num">{count.toLocaleString('en-IN')}</div>
        <div className="join-counter-label">cockroaches strong · and counting</div>
      </div>

      {submitted ? (
        <div className="join-thanks">
          <div className="join-thanks-stamp">✓ MEMBER</div>
          <div className="join-thanks-text">
            You're in. Welcome to the party.<br />
            Check your email — a digital membership card is coming.
          </div>
        </div>
      ) : (
        <form className="join-form" onSubmit={handleSubmit}>
          <div className="join-form-row">
            <input
              type="text"
              placeholder="Full name"
              required
              maxLength={60}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              required
              maxLength={120}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="City"
            maxLength={60}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <textarea
            placeholder="Why are you joining? (optional)"
            maxLength={300}
            rows={3}
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          {error && <div className="join-form-error">{error}</div>}
          <button type="submit" className="join-submit" disabled={busy}>
            {busy ? 'Joining…' : 'Join the Party →'}
          </button>
          <div className="join-form-fineprint">
            We will never spam. We will rarely email. Mostly we will just be here.
          </div>
        </form>
      )}
    </div>
  );
}
