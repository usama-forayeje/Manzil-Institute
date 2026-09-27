import { Metadata } from 'next';

export const metadata = {
  title: 'MIC Curriculum - Manzil International Curriculum Bangladesh',
  description: 'Complete MIC curriculum details, 6 levels, 22 years education system integrating Hifz, Dars-e-Nizami, International Curriculum & Technical Training.',
  keywords: [
    'MIC curriculum',
    'Manzil International Curriculum',
    'Islamic education Bangladesh',
    'Madrasa curriculum',
    'Technical education curriculum',
    'Bangladesh Islamic curriculum',
    'MIC program curriculum',
    'Manzil Institute MIC',
  ],
  openGraph: {
    title: 'MIC কারিকুলাম - বাংলাদেশে মানজিল ইন্টারন্যাশনাল কারিকুলাম',
    description: 'MIC কারিকুলামের সম্পূর্ণ বিবরণ, ৬টি লেভেল, ২২ বছরের শিক্ষা ব্যবস্থা যা হিফজ, দরসে নিজামী, আন্তর্জাতিক কারিকুলাম এবং প্রযুক্তিগত প্রশিক্ষণকে একীভূত করে।',
    url: 'https://institute.manzilgroupbd.com/curriculum/mic',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'MIC কারিকুলাম',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIC কারিকুলাম - বাংলাদেশে মানজিল ইন্টারন্যাশনাল কারিকুলাম',
    description: 'MIC কারিকুলামের সম্পূর্ণ বিবরণ, ৬টি লেভেল, ২২ বছরের শিক্ষা ব্যবস্থা যা হিফজ, দরসে নিজামী, আন্তর্জাতিক কারিকুলাম এবং প্রযুক্তিগত প্রশিক্ষণকে একীভূত করে।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}