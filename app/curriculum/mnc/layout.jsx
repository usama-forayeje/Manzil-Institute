export const metadata = {
  title: 'MNC Curriculum - Manzil National Curriculum Bangladesh',
  description: 'MNC curriculum integrates Madrasa, General and Technical education for 7 years. Complete education system with detailed curriculum breakdown.',
  keywords: [
    'MNC curriculum',
    'Manzil National Curriculum',
    'Madrasa education Bangladesh',
    'General education curriculum',
    'Technical education Bangladesh',
    '7 year curriculum',
    'Manzil Institute MNC',
  ],
  openGraph: {
    title: 'MNC কারিকুলাম - বাংলাদেশে মানজিল ন্যাশনাল কারিকুলাম',
    description: 'MNC কারিকুলাম 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে। বিস্তারিত কারিকুলাম বিভাজন সহ সম্পূর্ণ শিক্ষা ব্যবস্থা।',
    url: 'https://institute.manzilgroupbd.com/curriculum/mnc',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'MNC কারিকুলাম',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MNC কারিকুলাম - বাংলাদেশে মানজিল ন্যাশনাল কারিকুলাম',
    description: 'MNC কারিকুলাম 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে। বিস্তারিত কারিকুলাম বিভাজন সহ সম্পূর্ণ শিক্ষা ব্যবস্থা।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

export default function Layout({ children }) {
  return children;
}