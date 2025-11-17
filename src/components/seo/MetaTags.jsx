import React from 'react'
import { Helmet } from 'react-helmet-async'
import { generateMetaTags, generateOpenGraphTags, generateTwitterTags } from '../../lib/seo-utils'

/**
 * Reusable MetaTags component for SEO
 * Generates all necessary meta tags, Open Graph, and Twitter Cards
 */
export function MetaTags({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  twitterCreator,
  noindex = false
}) {
  // Generate all meta tags
  const metaTags = generateMetaTags({
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags
  })

  // Add noindex if specified
  if (noindex) {
    metaTags.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  // Separate different types of tags
  const basicMeta = metaTags.filter(tag => tag.name && !tag.property && !tag.rel && tag.name !== 'charset')
  const openGraphMeta = metaTags.filter(tag => tag.property && tag.property.startsWith('og:'))
  const twitterMeta = metaTags.filter(tag => tag.name && tag.name.startsWith('twitter:'))
  const linkTags = metaTags.filter(tag => tag.rel)

  return (
    <Helmet>
      {/* Title */}
      <title>{metaTags.find(tag => tag.name === 'title')?.content}</title>

      {/* Basic Meta Tags */}
      {basicMeta.map((tag, index) => (
        <meta key={`basic-${index}`} name={tag.name} content={tag.content} />
      ))}

      {/* Open Graph Meta Tags */}
      {openGraphMeta.map((tag, index) => (
        <meta key={`og-${index}`} property={tag.property} content={tag.content} />
      ))}

      {/* Twitter Card Meta Tags */}
      {twitterMeta.map((tag, index) => (
        <meta key={`twitter-${index}`} name={tag.name} content={tag.content} />
      ))}

      {/* Link Tags */}
      {linkTags.map((tag, index) => (
        <link key={`link-${index}`} rel={tag.rel} href={tag.href} hrefLang={tag.hreflang} />
      ))}
    </Helmet>
  )
}

/**
 * OpenGraph component for dynamic Open Graph generation
 */
export function OpenGraph({
  title,
  description,
  url,
  image,
  type = 'website',
  siteName,
  locale
}) {
  const ogTags = generateOpenGraphTags({
    title,
    description,
    url,
    image,
    type,
    siteName,
    locale
  })

  return (
    <Helmet>
      {ogTags.map((tag, index) => (
        <meta key={`og-${index}`} property={tag.property} content={tag.content} />
      ))}
    </Helmet>
  )
}

/**
 * TwitterCard component for Twitter Card generation
 */
export function TwitterCard({
  title,
  description,
  image,
  card = 'summary_large_image',
  site,
  creator
}) {
  const twitterTags = generateTwitterTags({
    title,
    description,
    image,
    card,
    site,
    creator
  })

  return (
    <Helmet>
      {twitterTags.map((tag, index) => (
        <meta key={`twitter-${index}`} name={tag.name} content={tag.content} />
      ))}
    </Helmet>
  )
}

/**
 * Canonical URL component
 */
export function CanonicalUrl({ url }) {
  return (
    <Helmet>
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

/**
 * Structured Data (JSON-LD) component
 */
export function StructuredData({ type, data }) {
  // Import the function here to avoid circular dependencies
  const { generateStructuredData } = require('../../lib/seo-utils')
  const structuredData = generateStructuredData(type, data)

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  )
}

/**
 * Breadcrumbs structured data component
 */
export function Breadcrumbs({ items }) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbData)}
      </script>
    </Helmet>
  )
}

export default MetaTags