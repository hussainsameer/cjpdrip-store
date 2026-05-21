export const metadata = { title: 'Shipping Policy · CJP Drip' };

export default function ShippingPage() {
  return (
    <main className="legal-page">
      <h1 className="legal-title">Shipping Policy</h1>
      <p className="legal-updated">Last updated: 21 May 2026</p>

      <h2>1. Where We Ship</h2>
      <p>
        We currently ship across India. International shipping is not available at this time.
      </p>

      <h2>2. Processing Time</h2>
      <p>
        Orders are processed within 1–2 business days after payment confirmation. Orders placed
        on Sundays or public holidays will be processed on the next business day.
      </p>

      <h2>3. Delivery Timeline</h2>
      <p>
        Estimated delivery time is <strong>5–7 business days</strong> from the date of dispatch,
        depending on your location. Remote areas may take slightly longer.
      </p>

      <h2>4. Shipping Charges</h2>
      <p>
        Shipping charges, if any, are calculated and displayed at checkout before payment.
      </p>

      <h2>5. Order Tracking</h2>
      <p>
        Once your order is shipped, we will email you a tracking number and the courier partner's
        link so you can follow your package.
      </p>

      <h2>6. Delays</h2>
      <p>
        While we make every effort to deliver within the estimated timeline, delivery may be
        delayed due to courier issues, weather, public holidays, or other circumstances beyond
        our control. We are not liable for such delays but will assist you in tracking the order.
      </p>

      <h2>7. Incorrect Address</h2>
      <p>
        Please double-check your shipping address before placing the order. We are not
        responsible for orders shipped to incorrect addresses provided by the customer.
        Re-shipment may incur additional charges.
      </p>

      <h2>8. Failed Delivery</h2>
      <p>
        If a delivery attempt fails and the package is returned to us, we will contact you to
        arrange re-delivery. Additional shipping charges may apply.
      </p>

      <h2>9. Contact</h2>
      <p>
        For shipping queries, email us at{' '}
        <a href="mailto:hussainzsameer@gmail.com">hussainzsameer@gmail.com</a>.
      </p>
    </main>
  );
}
