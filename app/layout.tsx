import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CockroachCursor from '@/components/CockroachCursor';

export const metadata: Metadata = {
  metadataBase: new URL('https://cjpdrip.store'),
  title: {
    default: 'CJP Drip — Cockroach Janta Party Merch · Voice of the Lazy',
    template: '%s · CJP Drip',
  },
  description:
    'Original satirical graphic tees. Secular, Socialist, Democratic, Lazy. Ships across India. Designs from ₹499.',
  keywords: [
    'cockroach janta party',
    'CJP merch',
    'satirical tees India',
    'political satire t-shirts',
    'graphic tees India',
    'protest tees',
    'indian streetwear',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'CJP Drip — Cockroach Janta Party Merch',
    description:
      'Original satirical graphic tees. Secular, Socialist, Democratic, Lazy. Designs from ₹499.',
    url: 'https://cjpdrip.store',
    siteName: 'CJP Drip',
    images: [{ url: '/CJP.png', width: 1200, height: 1200, alt: 'Cockroach Janta Party' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CJP Drip — Cockroach Janta Party Merch',
    description: 'Satirical tees. Voice of the Lazy. From ₹499.',
    images: ['/CJP.png'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/CJP.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          {children}
          <Footer />
          <CockroachCursor />
        </CartProvider>
        {/* Razorpay checkout script loaded globally so it's ready on checkout page */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  );
}
