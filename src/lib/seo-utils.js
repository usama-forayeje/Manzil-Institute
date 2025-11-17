/**
 * SEO Utilities for Manzil International Institute
 * Provides functions for dynamic meta tags, schema markup, and SEO monitoring
 */

// Base configuration
const SEO_CONFIG = {
  siteName: 'Manzil Institute',
  siteUrl: 'https://institute.manzilgroupbd.com',
  defaultImage: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
  twitterHandle: '@manzilinstitute',
  locale: 'en_US',
  alternateLocales: ['bn_BD']
}

/**
 * Generate comprehensive meta tags for a page
 */
export function generateMetaTags({
  title,
  description,
  keywords = [],
  image = SEO_CONFIG.defaultImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = []
}) {
  const fullTitle = title.includes(SEO_CONFIG.siteName) ? title : `${title} | ${SEO_CONFIG.siteName}`
  const canonicalUrl = url || SEO_CONFIG.siteUrl

  const meta = [
    // Basic meta tags
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'title', content: fullTitle },
    { name: 'description', content: description },
    { name: 'keywords', content: [...keywords, 'Manzil Institute', 'Islamic Education'].join(', ') },
    { name: 'author', content: author || SEO_CONFIG.siteName },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },

    // Open Graph
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: SEO_CONFIG.siteName },
    { property: 'og:type', content: type },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${SEO_CONFIG.siteName} - ${title}` },
    { property: 'og:locale', content: SEO_CONFIG.locale },

    // Twitter Cards
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:site', content: SEO_CONFIG.twitterHandle }
  ]

  // Add article-specific meta tags
  if (type === 'article') {
    if (publishedTime) meta.push({ property: 'article:published_time', content: publishedTime })
    if (modifiedTime) meta.push({ property: 'article:modified_time', content: modifiedTime })
    if (author) meta.push({ property: 'article:author', content: author })
    if (section) meta.push({ property: 'article:section', content: section })
    if (tags.length > 0) {
      tags.forEach(tag => {
        meta.push({ property: 'article:tag', content: tag })
      })
    }
  }

  // Add alternate language links
  SEO_CONFIG.alternateLocales.forEach(locale => {
    meta.push({
      rel: 'alternate',
      hreflang: locale.replace('_', '-').toLowerCase(),
      href: canonicalUrl
    })
  })

  // Add x-default
  meta.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: canonicalUrl
  })

  return meta
}

/**
 * Generate Open Graph meta tags dynamically
 */
export function generateOpenGraphTags({
  title,
  description,
  url,
  image = SEO_CONFIG.defaultImage,
  type = 'website',
  siteName = SEO_CONFIG.siteName,
  locale = SEO_CONFIG.locale
}) {
  return [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: title },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName },
    { property: 'og:locale', content: locale }
  ]
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags({
  title,
  description,
  image = SEO_CONFIG.defaultImage,
  card = 'summary_large_image',
  site = SEO_CONFIG.twitterHandle,
  creator
}) {
  const tags = [
    { name: 'twitter:card', content: card },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:site', content: site }
  ]

  if (creator) {
    tags.push({ name: 'twitter:creator', content: creator })
  }

  return tags
}

/**
 * Generate structured data (JSON-LD) for different content types
 */
export function generateStructuredData(type, data) {
  const baseData = {
    '@context': 'https://schema.org'
  }

  switch (type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'EducationalOrganization',
        name: data.name || SEO_CONFIG.siteName,
        alternateName: data.alternateName,
        description: data.description,
        url: data.url || SEO_CONFIG.siteUrl,
        logo: data.logo || SEO_CONFIG.defaultImage,
        sameAs: data.sameAs || [],
        address: data.address,
        contactPoint: data.contactPoint,
        email: data.email,
        foundingDate: data.foundingDate,
        educationalCredentialAwarded: data.educationalCredentialAwarded,
        hasEducationalUse: data.hasEducationalUse,
        knowsAbout: data.knowsAbout,
        areaServed: data.areaServed,
        priceRange: data.priceRange
      }

    case 'course':
      return {
        ...baseData,
        '@type': 'Course',
        name: data.name,
        description: data.description,
        provider: {
          '@type': 'EducationalOrganization',
          name: data.providerName || SEO_CONFIG.siteName
        },
        educationalLevel: data.educationalLevel,
        teaches: data.teaches,
        educationalUse: data.educationalUse,
        timeRequired: data.timeRequired
      }

    case 'article':
      return {
        ...baseData,
        '@type': 'Article',
        headline: data.headline,
        description: data.description,
        image: data.image || SEO_CONFIG.defaultImage,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        author: {
          '@type': 'Person',
          name: data.author
        },
        publisher: {
          '@type': 'Organization',
          name: SEO_CONFIG.siteName,
          logo: {
            '@type': 'ImageObject',
            url: SEO_CONFIG.defaultImage
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': data.url
        }
      }

    case 'breadcrumb':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }

    default:
      return baseData
  }
}

/**
 * Validate canonical URL
 */
export function validateCanonicalUrl(url, currentUrl) {
  if (!url) return { valid: false, error: 'Canonical URL is required' }

  try {
    const canonical = new URL(url)
    const current = new URL(currentUrl)

    // Check if canonical URL is absolute
    if (!canonical.protocol.startsWith('http')) {
      return { valid: false, error: 'Canonical URL must be absolute' }
    }

    // Check if canonical URL matches current URL (ignoring query params and fragments)
    const canonicalPath = canonical.origin + canonical.pathname
    const currentPath = current.origin + current.pathname

    if (canonicalPath !== currentPath) {
      return { valid: false, error: 'Canonical URL does not match current URL path' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Invalid canonical URL format' }
  }
}

/**
 * Audit meta tags for SEO compliance
 */
export function auditMetaTags(metaTags) {
  const issues = []
  const warnings = []

  // Required meta tags
  const hasTitle = metaTags.some(tag => tag.name === 'title' || tag.property === 'og:title')
  const hasDescription = metaTags.some(tag => tag.name === 'description' || tag.property === 'og:description')
  const hasCanonical = metaTags.some(tag => tag.rel === 'canonical')

  if (!hasTitle) issues.push('Missing title tag')
  if (!hasDescription) issues.push('Missing description tag')
  if (!hasCanonical) issues.push('Missing canonical URL')

  // Title length check
  const titleTag = metaTags.find(tag => tag.name === 'title' || tag.property === 'og:title')
  if (titleTag && titleTag.content) {
    if (titleTag.content.length < 30) warnings.push('Title too short (less than 30 characters)')
    if (titleTag.content.length > 60) warnings.push('Title too long (more than 60 characters)')
  }

  // Description length check
  const descTag = metaTags.find(tag => tag.name === 'description' || tag.property === 'og:description')
  if (descTag && descTag.content) {
    if (descTag.content.length < 120) warnings.push('Description too short (less than 120 characters)')
    if (descTag.content.length > 160) warnings.push('Description too long (more than 160 characters)')
  }

  // Open Graph checks
  const hasOgTitle = metaTags.some(tag => tag.property === 'og:title')
  const hasOgDescription = metaTags.some(tag => tag.property === 'og:description')
  const hasOgImage = metaTags.some(tag => tag.property === 'og:image')
  const hasOgUrl = metaTags.some(tag => tag.property === 'og:url')

  if (!hasOgTitle) warnings.push('Missing Open Graph title')
  if (!hasOgDescription) warnings.push('Missing Open Graph description')
  if (!hasOgImage) warnings.push('Missing Open Graph image')
  if (!hasOgUrl) warnings.push('Missing Open Graph URL')

  return { issues, warnings, score: Math.max(0, 100 - (issues.length * 20) - (warnings.length * 5)) }
}

/**
 * Discover all URLs from routes (for sitemap generation)
 */
export function discoverUrls(routes = []) {
  const urls = []

  // Static routes configuration
  const staticRoutes = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/curriculum', priority: 0.8, changefreq: 'monthly' },
    { path: '/admission', priority: 0.9, changefreq: 'weekly' },
    { path: '/campus', priority: 0.7, changefreq: 'monthly' },
    { path: '/addmissionForm', priority: 0.6, changefreq: 'monthly' },
    { path: '/apply', priority: 0.6, changefreq: 'monthly' }
  ]

  staticRoutes.forEach(route => {
    urls.push({
      url: `${SEO_CONFIG.siteUrl}${route.path}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: route.changefreq,
      priority: route.priority
    })
  })

  return urls
}

/**
 * Submit sitemap to search engines
 */
export async function submitSitemapToSearchEngines(sitemapUrl = `${SEO_CONFIG.siteUrl}/sitemap.xml`) {
  const searchEngines = [
    {
      name: 'Google',
      url: `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    },
    {
      name: 'Bing',
      url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    }
  ]

  const results = []

  for (const engine of searchEngines) {
    try {
      const response = await fetch(engine.url)
      if (response.ok) {
        results.push({ engine: engine.name, success: true, message: 'Sitemap submitted successfully' })
      } else {
        results.push({ engine: engine.name, success: false, message: `HTTP ${response.status}: ${response.statusText}` })
      }
    } catch (error) {
      results.push({ engine: engine.name, success: false, message: error.message })
    }
  }

  return results
}

export { SEO_CONFIG }