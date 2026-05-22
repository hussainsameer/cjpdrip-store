import type { MetadataRoute } from 'next';
import { PRODUCTS } from '@/lib/products';

const BASE = 'https://cjpdrip.store';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    '',
    '/stickers',
    '/posters',
    '/join',
    '/artists',
    '/predict',
    '/news',
    '/cart',
    '/checkout',
    '/contact',
    '/shipping',
    '/refunds',
    '/terms',
    '/privacy',
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.5,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
