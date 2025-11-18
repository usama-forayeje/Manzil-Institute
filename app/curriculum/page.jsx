

import CurriculumPageClient from './CurriculumPageClient.jsx'

export const metadata = {
  title: 'MIC Curriculum Details Bangladesh - Manzil International Institute Education System',
  description: 'Explore the comprehensive MIC Curriculum at Manzil International Institute. 6 levels, 22 years of integrated Madrasa, General, and Technical education in Bangladesh.',
  keywords: 'MIC Curriculum, Manzil Institute curriculum, Madrasa Education Bangladesh, General Education, Technical Education, Islamic Education curriculum',
  openGraph: {
    title: 'MIC Curriculum Details - Manzil International Institute',
    description: 'Comprehensive 22-year education system with Madrasa, General, and Technical streams. MIC Curriculum Bangladesh.',
    url: 'https://institute.manzilgroupbd.com/curriculum',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
        width: 1200,
        height: 630,
        alt: 'MIC Curriculum Details - Manzil International Institute Education System',
      },
    ],
    type: 'website',
  },
  twitter: {
    title: 'MIC Curriculum Details - Manzil International Institute',
    description: 'Comprehensive 22-year education system with Madrasa, General, and Technical streams. MIC Curriculum Bangladesh.',
  },
  alternates: {
    canonical: 'https://institute.manzilgroupbd.com/curriculum',
  },
  other: {
    'hreflang-en': 'https://institute.manzilgroupbd.com/curriculum',
    'hreflang-bn': 'https://institute.manzilgroupbd.com/curriculum',
    'hreflang-x-default': 'https://institute.manzilgroupbd.com/curriculum',
  },
}

export default function CurriculumPage() {
  return <CurriculumPageClient />
}