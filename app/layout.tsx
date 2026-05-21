import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'CJP · Merch — Voice of the Lazy & Unemployed',
  description: 'Satirical tee shirts for the Cockroach Janta Party. Secular, Socialist, Democratic, Lazy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Nav />
          {children}
          <Footer />
        </CartProvider>
        {/* Razorpay checkout script loaded globally so it's ready on checkout page */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  );
}
