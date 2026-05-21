'use client';

import { useEffect, useState } from 'react';

const SHARE_URL = 'https://cjpdrip.store/predict';
const SHARE_TEXT =
  'CJP is at 18M Instagram followers right now. Where does it land by Sunday? Place your bet (no money, pure noise):';

type Choice = { id: string; label: string; tagline: string; baseline: number };

const CHOICES: Choice[] = [
  { id: '20M', label: '20 M', tagline: 'Casual swelling', baseline: 247 },
  { id: '25M', label: '25 M', tagline: 'Now we are moving', baseline: 612 },
  { id: '30M', label: '30 M', tagline: 'The roach renaissance', baseline: 1538 },
  { id: '50M', label: '50 M', tagline: 'Mass radicalisation', baseline: 894 },
  { id: '75M', label: '75 M', tagline: 'Government concerned', baseline: 421 },
  { id: '100M+', label: '100 M+', tagline: 'Cabinet shuffle imminent', baseline: 1923 },
];

export default function PredictClient() {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(CHOICES.map((c) => [c.id, c.baseline])),
  );
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const prior = localStorage.getItem('cjp-predict-pick');
      if (prior) setPickedId(prior);
    } catch {}
  }, []);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const leader = CHOICES.reduce((a, b) => (counts[a.id] > counts[b.id] ? a : b));

  const handleVote = async (id: string) => {
    if (pickedId || busy) return;
    setBusy(true);
    setError(null);
    setCounts((c) => ({ ...c, [id]: c[id] + 1 }));
    setPickedId(id);
    try {
      localStorage.setItem('cjp-predict-pick', id);
    } catch {}
    try {
      await fetch('/api/predict', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ choice: id }),
      });
    } catch (e: any) {
      setError(e?.message || 'Vote saved locally. Network issue.');
    } finally {
      setBusy(false);
    }
  };

  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(SHARE_URL)}`;
  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + ' ' + SHARE_URL)}`;

  return (
    <main className="predict-page">
      <div className="predict-eyebrow">— The Sunday Test · Live till 23:59 IST · 24 May 2026 —</div>
      <h1 className="predict-title">
        We're at <span className="red">18 million.</span><br />
        How many by <em>Sunday?</em>
      </h1>
      <p className="predict-tagline">
        The Cockroach Janta Party's Instagram is breeding faster than the actual species.
        Pick where it lands. No money. No prizes. Pure speculation. Bragging rights forever.
      </p>

      <div className="predict-meta">
        <div><span>Current</span><strong>18 M</strong></div>
        <div><span>Deadline</span><strong>Sun · 23:59 IST</strong></div>
        <div><span>Total bets</span><strong>{total.toLocaleString('en-IN')}</strong></div>
        <div><span>Leading bet</span><strong>{leader.label}</strong></div>
      </div>

      <div className="predict-grid">
        {CHOICES.map((c) => {
          const votes = counts[c.id];
          const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
          const isPicked = pickedId === c.id;
          const isLocked = !!pickedId;
          return (
            <button
              key={c.id}
              className={`predict-card ${isPicked ? 'is-picked' : ''} ${isLocked && !isPicked ? 'is-dimmed' : ''}`}
              onClick={() => handleVote(c.id)}
              disabled={isLocked || busy}
            >
              <div className="predict-card-num">{c.label}</div>
              <div className="predict-card-tag">{c.tagline}</div>
              <div className="predict-card-bar">
                <div className="predict-card-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="predict-card-stats">
                <span>{votes.toLocaleString('en-IN')} votes</span>
                <span>{pct}%</span>
              </div>
              <div className="predict-card-cta">{isPicked ? '✓ YOUR BET' : isLocked ? 'LOCKED' : 'PLACE BET →'}</div>
            </button>
          );
        })}
      </div>

      {error && <div className="join-form-error" style={{ marginTop: 20 }}>{error}</div>}

      <div className="predict-share">
        <div className="predict-share-eyebrow">— Spread the bet —</div>
        <h2 className="predict-share-title">Drag your friends in.</h2>
        <p className="predict-share-sub">More bets = more noise = more swarm = higher Sunday number. Game theory.</p>
        <div className="predict-share-buttons">
          <a href={linkedInShare} target="_blank" rel="noopener noreferrer" className="predict-share-btn predict-share-btn--linkedin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.86 3.37-1.86 3.6 0 4.27 2.37 4.27 5.45v6.3zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
            </svg>
            Share on LinkedIn
          </a>
          <a href={twitterShare} target="_blank" rel="noopener noreferrer" className="predict-share-btn predict-share-btn--x">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share on X
          </a>
          <a href={whatsappShare} target="_blank" rel="noopener noreferrer" className="predict-share-btn predict-share-btn--wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.151-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375a9.869 9.869 0 01-1.516-5.26c.002-5.45 4.437-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.892 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411" />
            </svg>
            Share on WhatsApp
          </a>
        </div>
      </div>

      <div className="predict-fineprint">
        No money is collected. No prizes are awarded. The Cockroach Janta Party is satire and so is this bet.
        Hosted lazily.
      </div>
    </main>
  );
}
