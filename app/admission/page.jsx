import AdmissionClient from './mic/page';

export const metadata = {
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
    title: 'Manzil Institute Admission Process - MIC Curriculum Bangladesh',
    description: 'Complete admission process for Manzil International Institute. Apply for MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh.',
    url: 'https://institute.manzilgroupbd.com/admission',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.webp',
        width: 1200,
        height: 630,
        alt: 'Manzil Institute Admission',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Manzil Institute Admission Process - MIC Curriculum Bangladesh',
    description: 'Complete admission process for Manzil International Institute. Apply for MIC Curriculum, Madrasa Education, General Education & Technical Education in Bangladesh.',
    images: ['https://institute.manzilgroupbd.com/manzil-institute-logo-dark.webp'],
  },
};

export default function AdmissionPage() {
  return <AdmissionClient />;
}
