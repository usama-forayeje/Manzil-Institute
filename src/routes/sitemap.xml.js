import { createFileRoute } from '@tanstack/react-router'

// Static sitemap data for client-side rendering
const routeMetadata = {
  '/': {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
    alternateLanguages: [
      { lang: 'en', href: 'https://institute.manzilgroupbd.com/' },
      { lang: 'bn', href: 'https://institute.manzilgroupbd.com/' },
      { lang: 'x-default', href: 'https://institute.manzilgroupbd.com/' }
    ]
  },
  '/curriculum': {
    path: '/curriculum',
    changefreq: 'monthly',
    priority: 0.8
  },
  '/admission': {
    path: '/admission',
    changefreq: 'weekly',
    priority: 0.9
  },
  '/campus': {
    path: '/campus',
    changefreq: 'monthly',
    priority: 0.7
  },
  '/addmissionForm': {
    path: '/addmissionForm',
    changefreq: 'monthly',
    priority: 0.6
  },
  '/apply': {
    path: '/apply',
    changefreq: 'monthly',
    priority: 0.6
  }
}

function generateSitemapXML(routes, baseUrl) {
  const urlset = routes.map(route => {
    const loc = `${baseUrl}${route.path}`
    const lastmod = route.lastmod || new Date().toISOString().split('T')[0]
    const changefreq = route.changefreq || 'monthly'
    const priority = route.priority || 0.5

    let urlEntry = `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>`

    if (route.alternateLanguages) {
      route.alternateLanguages.forEach(alt => {
        urlEntry += `
    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`
      })
    }

    urlEntry += `
  </url>`

    return urlEntry
  }).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlset}
</urlset>`
}

export const Route = createFileRoute('/sitemap/xml')({
  loader: async () => {
    const baseUrl = 'https://institute.manzilgroupbd.com'
    const routes = Object.values(routeMetadata)
    const sitemapXML = generateSitemapXML(routes, baseUrl)
    return sitemapXML
  }
})