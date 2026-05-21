import type { Metadata } from 'next';
import ArtistForm from './ArtistForm';

export const metadata: Metadata = {
  title: 'Design for CJP · Artists Wanted',
  description: 'Calling all graphic designers, illustrators, and tee print artists. Apply to design for the Cockroach Janta Party.',
};

export default function ArtistsPage() {
  return (
    <main className="join-page">
      <div className="join-eyebrow">— Help Wanted · Now Hiring Roaches —</div>
      <h1 className="join-title">
        We need<br />
        <span className="red">designers.</span>
      </h1>
      <p className="join-tagline">
        Got a Procreate file and an opinion? An eye for type, posters, and protest art? We want
        you in the studio. Or in the basement. Either works.
      </p>

      <ArtistForm />

      <div className="join-perks">
        <div className="join-perk">
          <div className="join-perk-num">01</div>
          <div className="join-perk-text">Get paid per design.<br />Royalty + flat fee structure.</div>
        </div>
        <div className="join-perk">
          <div className="join-perk-num">02</div>
          <div className="join-perk-text">Your name on the tee.<br />Credit goes in the listing.</div>
        </div>
        <div className="join-perk">
          <div className="join-perk-num">03</div>
          <div className="join-perk-text">Total creative control.<br />No corporate notes.</div>
        </div>
      </div>
    </main>
  );
}
