export const metadata = { title: 'Contact Us · CJP Drip' };

export default function ContactPage() {
  return (
    <main className="legal-page">
      <h1 className="legal-title">Contact Us</h1>
      <p className="legal-updated">We usually reply within 1–2 business days.</p>

      <h2>Customer Support</h2>
      <p>
        For any questions about orders, products, shipping, returns, or anything else, please
        reach out to us:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href="mailto:support@cjpdrip.store">support@cjpdrip.store</a>
        </li>
        <li>
          <strong>Phone:</strong> +91 70664 57710
        </li>
      </ul>

      <h2>Business Address</h2>
      <p>
        CJP Drip<br />
        Smith Prabha Appt., Behind District Court,<br />
        Vidya Colony Road,<br />
        Amravati, Maharashtra – 444603<br />
        India
      </p>

      <h2>Business Hours</h2>
      <p>
        Monday to Saturday: 10:00 AM – 7:00 PM IST<br />
        Sunday and public holidays: Closed
      </p>

      <h2>Wholesale &amp; Collaborations</h2>
      <p>
        For bulk orders, collaborations, or press enquiries, email{' '}
        <a href="mailto:support@cjpdrip.store">support@cjpdrip.store</a> with your details and we
        will get back to you.
      </p>
    </main>
  );
}
