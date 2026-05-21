'use client';

import { useState } from 'react';

export default function ArtistForm() {
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    portfolio: '',
    experience: '',
    tools: '',
    why: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const reason = [
        `Phone: ${form.phone}`,
        `Portfolio: ${form.portfolio}`,
        `Experience: ${form.experience}`,
        `Tools: ${form.tools}`,
        `Why: ${form.why}`,
      ].join(' | ');

      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          city: form.city,
          reason,
          source: 'artist-application',
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="join-form-wrap">
        <div className="join-thanks">
          <div className="join-thanks-stamp">✓ RECEIVED</div>
          <div className="join-thanks-text">
            Application in. We will reach out within 5–7 days.<br />
            (Faster if your portfolio makes us laugh.)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-form-wrap">
      <form className="join-form" onSubmit={handleSubmit}>
        <div className="join-form-row">
          <input
            type="text"
            placeholder="Full name *"
            required
            maxLength={60}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            required
            maxLength={120}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="join-form-row">
          <input
            type="tel"
            placeholder="WhatsApp number *"
            required
            maxLength={20}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="City"
            maxLength={60}
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </div>
        <input
          type="url"
          placeholder="Portfolio link (Behance / Instagram / Dribbble / your site) *"
          required
          maxLength={250}
          value={form.portfolio}
          onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
        />
        <div className="join-form-row">
          <select
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            style={{
              padding: '14px 16px',
              border: '2px solid var(--ink)',
              background: 'var(--paper)',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              width: '100%',
            }}
          >
            <option value="">Years of experience…</option>
            <option value="<1 year">Less than 1 year</option>
            <option value="1-3 years">1–3 years</option>
            <option value="3-5 years">3–5 years</option>
            <option value="5+ years">5+ years</option>
          </select>
          <input
            type="text"
            placeholder="Tools (Procreate, PS, Illustrator…)"
            maxLength={120}
            value={form.tools}
            onChange={(e) => setForm({ ...form, tools: e.target.value })}
          />
        </div>
        <textarea
          placeholder="Why design for cockroaches? (be funny)"
          maxLength={500}
          rows={4}
          value={form.why}
          onChange={(e) => setForm({ ...form, why: e.target.value })}
        />
        {error && <div className="join-form-error">{error}</div>}
        <button type="submit" className="join-submit" disabled={busy}>
          {busy ? 'Sending…' : 'Apply to the Studio →'}
        </button>
        <div className="join-form-fineprint">
          By submitting, you understand we will read this and probably laugh.
        </div>
      </form>
    </div>
  );
}
