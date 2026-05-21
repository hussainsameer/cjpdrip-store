export default function DonateButton() {
  return (
    <a
      href="https://razorpay.me/@cjpdrip"
      target="_blank"
      rel="noopener noreferrer"
      className="donate-fab"
      title="Help us print one more tee — fund a roach, fund a job."
      aria-label="Donate to fund a tee"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" className="donate-fab-icon" fill="currentColor" aria-hidden>
        <ellipse cx="9" cy="6" rx="3" ry="2" />
        <ellipse cx="9" cy="14" rx="5" ry="6" />
        <path d="M 7 4 Q 4 1 2 2" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M 11 4 Q 14 1 16 2" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
      </svg>
      <span>
        Fund a Tee
        <span className="donate-fab-label-sub">make a roach employed</span>
      </span>
    </a>
  );
}
