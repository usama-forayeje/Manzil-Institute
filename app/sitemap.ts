import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://institute.manzilgroupbd.com';

  // Define static routes
  const routes = [
    '',
    '/campus',
    '/curriculum',
    '/admission',
    '/curriculum/mic',
    '/curriculum/mnc',
    '/apply',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  return [...routes];
}
