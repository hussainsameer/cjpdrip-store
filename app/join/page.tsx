import type { Metadata } from 'next';
import JoinForm from './JoinForm';

export const metadata: Metadata = {
  title: 'Join the Party · CJP Drip',
  description: 'Join the Cockroach Janta Party. Voice of the lazy, the unemployed, the still-here.',
};

export default function JoinPage() {
  return (
    <main className="join-page">
      <div className="join-eyebrow">— Membership · Open · Forever —</div>
      <h1 className="join-title">
        Join the<br />
        <span className="red">Cockroach Janta Party.</span>
      </h1>
      <p className="join-tagline">
        Membership is free. Resignation is impossible. Once a roach, always a roach.
      </p>

      <JoinForm />

      <div className="join-perks">
        <div className="join-perk">
          <div className="join-perk-num">01</div>
          <div className="join-perk-text">A digital membership card.<br />Print it. Frame it. Lose it.</div>
        </div>
        <div className="join-perk">
          <div className="join-perk-num">02</div>
          <div className="join-perk-text">Early access to every drop.<br />Before the algorithms find us.</div>
        </div>
        <div className="join-perk">
          <div className="join-perk-num">03</div>
          <div className="join-perk-text">Voting rights for next drops.<br />Real democracy. Finally.</div>
        </div>
      </div>
    </main>
  );
}
