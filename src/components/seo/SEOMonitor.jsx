import React from 'react'
import { useEffect, useState, startTransition, useMemo } from 'react'
import { validateCanonicalUrl, auditMetaTags } from '../../lib/seo-utils'

/**
 * SEO Monitor component for development and debugging
 * Shows SEO issues, validates canonical URLs, and audits meta tags
 */
export function SEOMonitor({ currentUrl, metaTags, showInProduction = false }) {
  const [seoReport, setSeoReport] = useState(null)
  const [canonicalValid, setCanonicalValid] = useState(null)

  useEffect(() => {
    // Only show in development or if explicitly enabled
    if (process.env.NODE_ENV === 'production' && !showInProduction) {
      return
    }

    const tags = metaTags || []

    // Audit meta tags
    const audit = auditMetaTags(tags)
    startTransition(() => {
      setSeoReport(audit)
    })

    // Validate canonical URL
    const canonicalTag = tags.find(tag => tag.rel === 'canonical')
    if (canonicalTag) {
      const validation = validateCanonicalUrl(canonicalTag.href, currentUrl)
      startTransition(() => {
        setCanonicalValid(validation)
      })
    }
  }, [currentUrl, metaTags, showInProduction])

  // Don't render anything in production unless explicitly enabled
  if (process.env.NODE_ENV === 'production' && !showInProduction) {
    return null
  }

  if (!seoReport) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 font-mono text-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">SEO Monitor</h3>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            seoReport.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            seoReport.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {seoReport.score}/100
          </span>
        </div>
      </div>

      {/* Issues */}
      {seoReport.issues.length > 0 && (
        <div className="mb-3">
          <h4 className="text-red-600 dark:text-red-400 font-medium mb-1">Issues:</h4>
          <ul className="space-y-1">
            {seoReport.issues.map((issue, index) => (
              <li key={index} className="text-red-600 dark:text-red-400 text-xs">• {issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {seoReport.warnings.length > 0 && (
        <div className="mb-3">
          <h4 className="text-yellow-600 dark:text-yellow-400 font-medium mb-1">Warnings:</h4>
          <ul className="space-y-1">
            {seoReport.warnings.map((warning, index) => (
              <li key={index} className="text-yellow-600 dark:text-yellow-400 text-xs">• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Canonical URL Validation */}
      {canonicalValid && (
        <div className="mb-3">
          <h4 className="text-blue-600 dark:text-blue-400 font-medium mb-1">Canonical URL:</h4>
          <div className={`text-xs ${canonicalValid.valid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {canonicalValid.valid ? '✓ Valid' : `✗ ${canonicalValid.error}`}
          </div>
        </div>
      )}

      {/* Meta Tags Summary */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        <div>Meta tags: {metaTags.length}</div>
        <div>URL: {currentUrl}</div>
      </div>
    </div>
  )
}

/**
 * Hook for SEO monitoring
 */
export function useSEOMonitor(currentUrl, metaTags = []) {
  const [seoData, setSeoData] = useState({
    audit: null,
    canonicalValidation: null,
    isValid: true
  })

  useEffect(() => {
    const audit = auditMetaTags(metaTags)
    const canonicalTag = metaTags.find(tag => tag.rel === 'canonical')
    const canonicalValidation = canonicalTag
      ? validateCanonicalUrl(canonicalTag.href, currentUrl)
      : null

    setSeoData({
      audit,
      canonicalValidation,
      isValid: audit.issues.length === 0 && (!canonicalValidation || canonicalValidation.valid)
    })
  }, [currentUrl, metaTags])

  return seoData
}

/**
 * SEO Health Check component
 */
export function SEOHealthCheck({ routes = [] }) {
  const [healthReport, setHealthReport] = useState(null)

  useEffect(() => {
    // Check various SEO health metrics
    const report = {
      totalRoutes: routes.length,
      routesWithMeta: routes.filter(route => route.hasMeta).length,
      routesWithCanonical: routes.filter(route => route.hasCanonical).length,
      routesWithStructuredData: routes.filter(route => route.hasStructuredData).length,
      issues: []
    }

    // Calculate percentages
    report.metaCoverage = Math.round((report.routesWithMeta / report.totalRoutes) * 100)
    report.canonicalCoverage = Math.round((report.routesWithCanonical / report.totalRoutes) * 100)
    report.structuredDataCoverage = Math.round((report.routesWithStructuredData / report.totalRoutes) * 100)

    // Identify issues
    if (report.metaCoverage < 100) {
      report.issues.push(`${100 - report.metaCoverage}% of routes missing meta tags`)
    }
    if (report.canonicalCoverage < 100) {
      report.issues.push(`${100 - report.canonicalCoverage}% of routes missing canonical URLs`)
    }
    if (report.structuredDataCoverage < 50) {
      report.issues.push(`Only ${report.structuredDataCoverage}% of routes have structured data`)
    }

    setHealthReport(report)
  }, [routes])

  if (!healthReport) return null

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">SEO Health Report</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{healthReport.totalRoutes}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Routes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{healthReport.metaCoverage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Meta Tags</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{healthReport.canonicalCoverage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Canonical URLs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{healthReport.structuredDataCoverage}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Structured Data</div>
        </div>
      </div>

      {healthReport.issues.length > 0 && (
        <div>
          <h4 className="text-red-600 dark:text-red-400 font-medium mb-2">Issues to Address:</h4>
          <ul className="space-y-1">
            {healthReport.issues.map((issue, index) => (
              <li key={index} className="text-red-600 dark:text-red-400 text-sm">• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SEOMonitor