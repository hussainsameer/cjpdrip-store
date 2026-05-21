import type { Metadata } from 'next';
import PredictClient from './PredictClient';

export const metadata: Metadata = {
  title: 'The Sunday Test · Bet on the Swarm',
  description: 'CJP is at 18M Instagram followers right now. Where will it land by Sunday? Place your bet. No money. Pure speculation.',
  openGraph: {
    title: 'CJP at 18M. Where does it land by Sunday?',
    description: 'Vote on how big the Cockroach Janta Party swarm gets before midnight Sunday. Pure speculation, zero stakes, maximum noise.',
    url: 'https://cjpdrip.store/predict',
    siteName: 'CJP Drip',
    images: [{ url: '/cjp.jpeg', width: 1200, height: 1200, alt: 'CJP — Vote on the Sunday number' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CJP at 18M. Where does it land by Sunday?',
    description: 'Cast your bet. Pure speculation.',
    images: ['/cjp.jpeg'],
  },
};

export default function PredictPage() {
  return <PredictClient />;
}
