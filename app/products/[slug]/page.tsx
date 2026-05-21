import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProduct, PRODUCTS } from '@/lib/products';
import ProductView from './ProductView';

const BASE_URL = 'https://cjpdrip.store';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return {};
  const title = `${product.name} · CJP Drip`;
  const description = `${product.description} ₹${product.price}. Free shipping across India.`;
  const url = `${BASE_URL}/products/${product.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'CJP Drip',
      images: [{ url: `${BASE_URL}/CJP.png`, width: 1200, height: 1200, alt: product.name }],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/CJP.png`],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();

  const productLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `${BASE_URL}/CJP.png`,
    brand: { '@type': 'Brand', name: 'CJP Drip' },
    sku: product.slug,
    offers: {
      '@type': 'Offer',
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <ProductView product={product} />
    </>
  );
}
