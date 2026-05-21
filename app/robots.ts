import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/checkout', '/cart'] },
    ],
    sitemap: 'https://cjpdrip.store/sitemap.xml',
    host: 'https://cjpdrip.store',
  };
}
