import type { Metadata } from 'next';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'News by the Cockroaches · Press, milestones, drops',
  description: 'The live archive of Cockroach Janta Party — press coverage, follower milestones, merch drops. All in one swarm.',
};

export default function NewsPage() {
  return <NewsClient />;
}
