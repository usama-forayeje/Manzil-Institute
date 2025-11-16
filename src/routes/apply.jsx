import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft} from 'lucide-react'
import { useLanguageStore } from '../lib/store'

export const Route = createFileRoute('/apply')({
  component: ApplicationPage,
  head: () => ({
    meta: [
      {
        title: 'Apply to Manzil Institute - Start Your Admission Process Bangladesh',
      },
      {
        name: 'description',
        content: 'Start your admission application for ManzilInstitute. Apply online for MIC Curriculum, Madrasa, General, and Technical Education programs in Bangladesh.',
      },
      {
        name: 'keywords',
        content: 'apply Manzil Institute, admission application Bangladesh, MIC Curriculum apply, Islamic education application, school admission online Bangladesh',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Apply to Manzil International Institute - Start Your Admission',
      },
      {
        property: 'og:description',
        content: 'Begin your admission journey at Manzil International Institute. Apply for comprehensive Islamic education programs in Bangladesh.',
      },
      {
        property: 'og:url',
        content: 'https://institute.manzilgroupbd.com/apply',
      },
      {
        property: 'og:image',
        content: 'https://institute.manzilgroupbd.com/manzil-institute-logo-dark.png',
      },
      {
        property: 'og:image:width',
        content: '1200',
      },
      {
        property: 'og:image:height',
        content: '630',
      },
      {
        property: 'og:image:alt',
        content: 'Apply to Manzil International Institute - Online Admission Application',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      // Twitter Cards
      {
        name: 'twitter:title',
        content: 'Apply to Manzil International Institute - Start Your Admission',
      },
      {
        name: 'twitter:description',
        content: 'Begin your admission journey at Manzil International Institute. Apply for comprehensive Islamic education programs in Bangladesh.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://institute.manzilgroupbd.com/apply',
      },
      // hreflang tags for English and Bangla versions
      {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://institute.manzilgroupbd.com/apply',
      },
      {
        rel: 'alternate',
        hreflang: 'bn',
        href: 'https://institute.manzilgroupbd.com/apply',
      },
      {
        rel: 'alternate',
        hreflang: 'x-default',
        href: 'https://institute.manzilgroupbd.com/apply',
      },
    ],
  }),
})

// UI Components
const Button = ({ children, onClick, variant = "default", className = "", type = "button", disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-lg font-medium transition-all ${variant === "ghost"
        ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
        : variant === "outline"
          ? "border-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
          : "bg-[#00AEEF] text-white hover:bg-[#00AEEF]/90 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      } ${className}`}
  >
    {children}
  </button>
)


function ApplicationPage() {
  const { language } = useLanguageStore()

   const navigate = useNavigate()

   const breadcrumbSchema = {
     "@context": "https://schema.org",
     "@type": "BreadcrumbList",
     "itemListElement": [
       {
         "@type": "ListItem",
         "position": 1,
         "name": "Home",
         "item": "https://institute.manzilgroupbd.com"
       },
       {
         "@type": "ListItem",
         "position": 2,
         "name": "Apply",
         "item": "https://institute.manzilgroupbd.com/apply"
       }
     ]
   }

   const handleGoBack = () => {
     navigate({ to: '/' })
   }

  return (
    <div className='text-center flex flex-col items-center justify-center h-screen mx-auto px-4'>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <p className='text-lg mb-6'>{language === 'bn' ? 'আবেদন পৃষ্ঠা নির্মাণাধীন!' : 'Application Page is under construction!'}!</p>
      <Button onClick={handleGoBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
      </Button>
    </div>

  )
}
