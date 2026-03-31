import { Metadata } from 'next';
import AdmissionClient from './mic/page';

export const metadata: Metadata = {
  title: 'Manzil Institute Admission Process - MIC Curriculum Bangladesh',
  description: 'Complete admission process for Manzil International Institute. Apply for MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh. Online application, requirements, and fee structure.',
  keywords: [
    'Manzil Institute admission',
    'MIC Curriculum admission Bangladesh',
    'Islamic education admission',
    'Madrasa admission Bangladesh',
    'Technical education admission',
    'Bangladesh Islamic school admission',
    'Online admission Bangladesh',
    'Manzil International Institute application',
  ],
  openGraph: {
    title: 'মানজিল ইনস্টিটিউট ভর্তি প্রক্রিয়া - বাংলাদেশে MIC কারিকুলাম',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটের সম্পূর্ণ ভর্তি প্রক্রিয়া। বাংলাদেশে MIC কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং প্রযুক্তিগত শিক্ষার জন্য আবেদন করুন। অনলাইন আবেদন, প্রয়োজনীয়তা এবং ফি কাঠামো।',
    url: 'https://institute.manzilgroupbd.com/admission',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'মানজিল ইনস্টিটিউট ভর্তি',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মানজিল ইনস্টিটিউট ভর্তি প্রক্রিয়া - বাংলাদেশে MIC কারিকুলাম',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটের সম্পূর্ণ ভর্তি প্রক্রিয়া। বাংলাদেশে MIC কারিকুলাম, মাদ্রাসা শিক্ষা, সাধারণ শিক্ষা এবং প্রযুক্তিগত শিক্ষার জন্য আবেদন করুন।',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

export default function AdmissionPage() {
  return <AdmissionClient />;
}