import type { MetadataRoute } from 'next';

const BASE = 'https://destec.co.il';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/catalog`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/card`, changeFrequency: 'monthly', priority: 0.3 },
  ];
}
