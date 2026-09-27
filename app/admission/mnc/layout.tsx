export const metadata = {
  title: 'MNC Admission Process - Manzil National Curriculum Bangladesh',
  description: 'MNC curriculum integrates Madrasa, General and Technical education for 7 years. Complete admission process, eligibility, fee structure and contact information for Manzil National Curriculum.',
  keywords: [
    'MNC admission',
    'Manzil National Curriculum admission',
    'Madrasa education Bangladesh',
    'General education admission',
    'Technical education Bangladesh',
    '7 year curriculum admission',
    'Manzil Institute MNC',
  ],
  openGraph: {
    title: 'MNC ভর্তি প্রক্রিয়া - বাংলাদেশে মানজিল ন্যাশনাল কারিকুলাম',
    description: 'MNC কারিকুলাম 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে। মানজিল ন্যাশনাল কারিকুলামের জন্য সম্পূর্ণ ভর্তি প্রক্রিয়া, যোগ্যতা, ফি কাঠামো এবং যোগাযোগ তথ্য।',
    url: 'https://institute.manzilgroupbd.com/admission/mnc',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'MNC ভর্তি প্রক্রিয়া',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MNC ভর্তি প্রক্রিয়া - বাংলাদেশে মানজিল ন্যাশনাল কারিকুলাম',
    description: 'MNC কারিকুলাম 7 বছরের জন্য মাদ্রাসা, সাধারণ এবং প্রযুক্তিগত শিক্ষাকে একীভূত করে। মানজিল ন্যাশনাল কারিকুলামের জন্য সম্পূর্ণ ভর্তি প্রক্রিয়া, যোগ্যতা, ফি কাঠামো এবং যোগাযোগ তথ্য।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}