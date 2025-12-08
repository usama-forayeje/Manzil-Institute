'use client';
import {
  Construction,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import NotFound from '../not-found';
import ErrorBoundary from '../../components/ErrorBoundary';

export const metadata = {
  title: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আবেদন করুন - অনলাইন ভর্তি ফর্ম',
  description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আপনার অনলাইন আবেদন জমা দিন। বাংলাদেশে MIC কারিকুলাম, মাদ্রাসা শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রোগ্রামের জন্য ভর্তি ফর্ম সম্পূর্ণ করুন।',
  keywords: [
    'মানজিল ইনস্টিটিউট আবেদন',
    'অনলাইন ভর্তি ফর্ম',
    'MIC কারিকুলাম আবেদন',
    'বাংলাদেশ ইসলামিক স্কুল আবেদন',
    'ভর্তি ফর্ম বাংলাদেশ',
    'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউট আবেদন',
    'অনলাইন আবেদন বাংলাদেশ',
    'ইসলামিক শিক্ষা আবেদন'
  ],
  openGraph: {
    title: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আবেদন করুন - অনলাইন ভর্তি ফর্ম | Apply to Manzil International Institute - Online Admission Form',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আপনার অনলাইন আবেদন জমা দিন। বাংলাদেশে MIC কারিকুলাম, মাদ্রাসা শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রোগ্রামের জন্য ভর্তি ফর্ম সম্পূর্ণ করুন। | Submit your online application to Manzil International Institute. Complete the admission form for MIC Curriculum, Madrasa Education, and Technical Education programs in Bangladesh.',
    url: 'https://institute.manzilgroupbd.com/apply',
    siteName: 'Manzil Institute',
    images: [
      {
        url: 'https://institute.manzilgroupbd.com/manzil-institute.png',
        width: 1200,
        height: 630,
        alt: 'মানজিল ইনস্টিটিউট আবেদন',
      },
    ],
    locale: 'bn_BD',
    alternateLocales: ['en_US'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আবেদন করুন - অনলাইন ভর্তি ফর্ম | Apply to Manzil International Institute - Online Admission Form',
    description: 'মানজিল ইন্টারন্যাশনাল ইনস্টিটিউটে আপনার অনলাইন আবেদন জমা দিন। বাংলাদেশে MIC কারিকুলাম, মাদ্রাসা শিক্ষা এবং প্রযুক্তিগত শিক্ষা প্রোগ্রামের জন্য ভর্তি ফর্ম সম্পূর্ণ করুন। | Submit your online application to Manzil International Institute. Complete the admission form for MIC Curriculum, Madrasa Education, and Technical Education programs in Bangladesh.',
    images: ['https://institute.manzilgroupbd.com/manzil-institute.png'],
    creator: '@manzilinstitute',
  },
};

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function ApplicationPage() {
  // const { language } = useLanguageStore()
  // const [currentStep, setCurrentStep] = useState(1)
  // const [formData, setFormData] = useState({
  //   // Personal Information
  //   firstName: '',
  //   lastName: '',
  //   dateOfBirth: '',
  //   gender: '',
  //   nationality: '',
  //   religion: '',

  //   // Contact Information
  //   email: '',
  //   phone: '',
  //   address: '',
  //   city: '',
  //   postalCode: '',

  //   // Academic Information
  //   previousSchool: '',
  //   grade: '',
  //   gpa: '',
  //   level: '', // Level 1, 2, 3, or Huffaz

  //   // Parent/Guardian Information
  //   parentName: '',
  //   parentPhone: '',
  //   parentEmail: '',
  //   parentOccupation: '',

  //   // Documents
  //   birthCertificate: null,
  //   photo: null,
  //   reportCard: null,
  //   medicalCertificate: null,

  //   // Additional Information
  //   specialNeeds: '',
  //   emergencyContact: '',
  //   emergencyPhone: '',
  //   termsAccepted: false
  // })

  // const [errors, setErrors] = useState({})
  // const [isSubmitting, setIsSubmitting] = useState(false)

  // const breadcrumbSchema = {
  //   "@context": "https://schema.org",
  //   "@type": "BreadcrumbList",
  //   "itemListElement": [
  //     {
  //       "@type": "ListItem",
  //       "position": 1,
  //       "name": "Home",
  //       "item": "https://institute.manzilgroupbd.com"
  //     },
  //     {
  //       "@type": "ListItem",
  //       "position": 2,
  //       "name": "Apply",
  //       "item": "https://institute.manzilgroupbd.com/apply"
  //     }
  //   ]
  // }

  // const steps = [
  //   { id: 1, title: language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info', icon: User },
  //   { id: 2, title: language === 'bn' ? 'যোগাযোগ তথ্য' : 'Contact Info', icon: Mail },
  //   { id: 3, title: language === 'bn' ? 'একাডেমিক তথ্য' : 'Academic Info', icon: BookOpen },
  //   { id: 4, title: language === 'bn' ? 'অভিভাবক তথ্য' : 'Parent Info', icon: Phone },
  //   { id: 5, title: language === 'bn' ? 'ডকুমেন্ট আপলোড' : 'Documents', icon: Upload }
  // ]

  // // Scroll to top when component mounts
  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [])

  // const handleInputChange = (field, value) => {
  //   setFormData(prev => ({ ...prev, [field]: value }))
  //   if (errors[field]) {
  //     setErrors(prev => ({ ...prev, [field]: '' }))
  //   }
  // }

  // const handleFileChange = (field, file) => {
  //   setFormData(prev => ({ ...prev, [field]: file }))
  //   if (errors[field]) {
  //     setErrors(prev => ({ ...prev, [field]: '' }))
  //   }
  // }

  // const validateStep = (step) => {
  //   const newErrors = {}

  //   switch (step) {
  //     case 1:
  //       if (!formData.firstName.trim()) newErrors.firstName = language === 'bn' ? 'প্রথম নাম প্রয়োজন' : 'First name is required'
  //       if (!formData.lastName.trim()) newErrors.lastName = language === 'bn' ? 'শেষ নাম প্রয়োজন' : 'Last name is required'
  //       if (!formData.dateOfBirth) newErrors.dateOfBirth = language === 'bn' ? 'জন্ম তারিখ প্রয়োজন' : 'Date of birth is required'
  //       if (!formData.gender) newErrors.gender = language === 'bn' ? 'লিঙ্গ নির্বাচন করুন' : 'Please select gender'
  //       break
  //     case 2:
  //       if (!formData.email.trim()) newErrors.email = language === 'bn' ? 'ইমেইল প্রয়োজন' : 'Email is required'
  //       if (!formData.phone.trim()) newErrors.phone = language === 'bn' ? 'ফোন নম্বর প্রয়োজন' : 'Phone number is required'
  //       if (!formData.address.trim()) newErrors.address = language === 'bn' ? 'ঠিকানা প্রয়োজন' : 'Address is required'
  //       break
  //     case 3:
  //       if (!formData.previousSchool.trim()) newErrors.previousSchool = language === 'bn' ? 'পূর্ববর্তী স্কুলের নাম প্রয়োজন' : 'Previous school name is required'
  //       if (!formData.level) newErrors.level = language === 'bn' ? 'লেভেল নির্বাচন করুন' : 'Please select level'
  //       break
  //     case 4:
  //       if (!formData.parentName.trim()) newErrors.parentName = language === 'bn' ? 'অভিভাবকের নাম প্রয়োজন' : 'Parent name is required'
  //       if (!formData.parentPhone.trim()) newErrors.parentPhone = language === 'bn' ? 'অভিভাবকের ফোন প্রয়োজন' : 'Parent phone is required'
  //       break
  //     case 5:
  //       if (!formData.birthCertificate) newErrors.birthCertificate = language === 'bn' ? 'জন্ম সনদ আপলোড করুন' : 'Please upload birth certificate'
  //       if (!formData.photo) newErrors.photo = language === 'bn' ? 'ছবি আপলোড করুন' : 'Please upload photo'
  //       if (!formData.termsAccepted) newErrors.termsAccepted = language === 'bn' ? 'শর্তাবলী গ্রহণ করুন' : 'Please accept terms and conditions'
  //       break
  //   }

  //   setErrors(newErrors)
  //   return Object.keys(newErrors).length === 0
  // }

  // const handleNext = () => {
  //   if (validateStep(currentStep)) {
  //     setCurrentStep(prev => Math.min(prev + 1, steps.length))
  //   }
  // }

  // const handlePrevious = () => {
  //   setCurrentStep(prev => Math.max(prev - 1, 1))
  // }

  // const handleSubmit = async () => {
  //   if (!validateStep(currentStep)) return

  //   setIsSubmitting(true)
  //   try {
  //     // Here you would typically send the form data to your backend
  //     alert(language === 'bn' ? 'আবেদন সফলভাবে জমা দেওয়া হয়েছে!' : 'Application submitted successfully!')
  //     // Reset form or redirect
  //   } catch (error) {
  //     alert(language === 'bn' ? 'আবেদন জমা দেওয়ার সময় ত্রুটি ঘটেছে' : 'Error submitting application')
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

  // const handleGoBack = () => {
  //   window.location.href = '/admission'
  // }

  // const renderStepContent = () => {
  //   switch (currentStep) {
  //     case 1:
  //       return (
  //         <div className="space-y-6">
  //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
  //             {language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
  //           </h3>
  //           <div className="grid md:grid-cols-2 gap-6">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'প্রথম নাম' : 'First Name'} *
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.firstName}
  //                 onChange={(e) => handleInputChange('firstName', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.firstName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'প্রথম নাম লিখুন' : 'Enter first name'}
  //               />
  //               {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'শেষ নাম' : 'Last Name'} *
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.lastName}
  //                 onChange={(e) => handleInputChange('lastName', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.lastName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'শেষ নাম লিখুন' : 'Enter last name'}
  //               />
  //               {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'} *
  //               </label>
  //               <input
  //                 type="date"
  //                 value={formData.dateOfBirth}
  //                 onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.dateOfBirth ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //               />
  //               {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'লিঙ্গ' : 'Gender'} *
  //               </label>
  //               <select
  //                 value={formData.gender}
  //                 onChange={(e) => handleInputChange('gender', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.gender ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //               >
  //                 <option value="">{language === 'bn' ? 'লিঙ্গ নির্বাচন করুন' : 'Select gender'}</option>
  //                 <option value="male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
  //                 <option value="female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
  //               </select>
  //               {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     case 2:
  //       return (
  //         <div className="space-y-6">
  //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
  //             {language === 'bn' ? 'যোগাযোগ তথ্য' : 'Contact Information'}
  //           </h3>
  //           <div className="grid md:grid-cols-2 gap-6">
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'ইমেইল' : 'Email'} *
  //               </label>
  //               <input
  //                 type="email"
  //                 value={formData.email}
  //                 onChange={(e) => handleInputChange('email', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'ইমেইল লিখুন' : 'Enter email'}
  //               />
  //               {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'} *
  //               </label>
  //               <input
  //                 type="tel"
  //                 value={formData.phone}
  //                 onChange={(e) => handleInputChange('phone', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'ফোন নম্বর লিখুন' : 'Enter phone number'}
  //               />
  //               {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'শহর' : 'City'}
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.city}
  //                 onChange={(e) => handleInputChange('city', e.target.value)}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //                 placeholder={language === 'bn' ? 'শহর লিখুন' : 'Enter city'}
  //               />
  //             </div>
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'ঠিকানা' : 'Address'} *
  //               </label>
  //               <textarea
  //                 value={formData.address}
  //                 onChange={(e) => handleInputChange('address', e.target.value)}
  //                 rows={3}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.address ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'পূর্ণ ঠিকানা লিখুন' : 'Enter full address'}
  //               />
  //               {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     case 3:
  //       return (
  //         <div className="space-y-6">
  //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
  //             {language === 'bn' ? 'একাডেমিক তথ্য' : 'Academic Information'}
  //           </h3>
  //           <div className="grid md:grid-cols-2 gap-6">
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'পূর্ববর্তী স্কুল/কলেজ' : 'Previous School/College'} *
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.previousSchool}
  //                 onChange={(e) => handleInputChange('previousSchool', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.previousSchool ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'স্কুলের নাম লিখুন' : 'Enter school name'}
  //               />
  //               {errors.previousSchool && <p className="text-red-500 text-sm mt-1">{errors.previousSchool}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'বর্তমান গ্রেড/ক্লাস' : 'Current Grade/Class'}
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.grade}
  //                 onChange={(e) => handleInputChange('grade', e.target.value)}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //                 placeholder={language === 'bn' ? 'গ্রেড লিখুন' : 'Enter grade'}
  //               />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'জিপিএ/ফলাফল' : 'GPA/Result'}
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.gpa}
  //                 onChange={(e) => handleInputChange('gpa', e.target.value)}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //                 placeholder={language === 'bn' ? 'জিপিএ লিখুন' : 'Enter GPA'}
  //               />
  //             </div>
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'আবেদন করছেন যে লেভেলে' : 'Applying for Level'} *
  //               </label>
  //               <select
  //                 value={formData.level}
  //                 onChange={(e) => handleInputChange('level', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.level ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //               >
  //                 <option value="">{language === 'bn' ? 'লেভেল নির্বাচন করুন' : 'Select level'}</option>
  //                 <option value="level1">{language === 'bn' ? 'লেভেল ১' : 'Level 1'}</option>
  //                 <option value="level2">{language === 'bn' ? 'লেভেল ২' : 'Level 2'}</option>
  //                 <option value="level3">{language === 'bn' ? 'লেভেল ৩' : 'Level 3'}</option>
  //                 <option value="huffaz">{language === 'bn' ? 'হুফ্ফাজ সিস্টেম' : 'Huffaz System'}</option>
  //               </select>
  //               {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     case 4:
  //       return (
  //         <div className="space-y-6">
  //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
  //             {language === 'bn' ? 'অভিভাবক/অভিভাবিকার তথ্য' : 'Parent/Guardian Information'}
  //           </h3>
  //           <div className="grid md:grid-cols-2 gap-6">
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'অভিভাবকের নাম' : 'Parent/Guardian Name'} *
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.parentName}
  //                 onChange={(e) => handleInputChange('parentName', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.parentName ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'অভিভাবকের নাম লিখুন' : 'Enter parent name'}
  //               />
  //               {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'অভিভাবকের ফোন' : 'Parent Phone'} *
  //               </label>
  //               <input
  //                 type="tel"
  //                 value={formData.parentPhone}
  //                 onChange={(e) => handleInputChange('parentPhone', e.target.value)}
  //                 className={cn(
  //                   "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent",
  //                   errors.parentPhone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
  //                 )}
  //                 placeholder={language === 'bn' ? 'ফোন নম্বর লিখুন' : 'Enter phone number'}
  //               />
  //               {errors.parentPhone && <p className="text-red-500 text-sm mt-1">{errors.parentPhone}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'অভিভাবকের ইমেইল' : 'Parent Email'}
  //               </label>
  //               <input
  //                 type="email"
  //                 value={formData.parentEmail}
  //                 onChange={(e) => handleInputChange('parentEmail', e.target.value)}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //                 placeholder={language === 'bn' ? 'ইমেইল লিখুন' : 'Enter email'}
  //               />
  //             </div>
  //             <div className="md:col-span-2">
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'অভিভাবকের পেশা' : 'Parent Occupation'}
  //               </label>
  //               <input
  //                 type="text"
  //                 value={formData.parentOccupation}
  //                 onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //                 placeholder={language === 'bn' ? 'পেশা লিখুন' : 'Enter occupation'}
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     case 5:
  //       return (
  //         <div className="space-y-6">
  //           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
  //             {language === 'bn' ? 'ডকুমেন্ট আপলোড' : 'Document Upload'}
  //           </h3>
  //           <div className="space-y-6">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'জন্ম সনদ' : 'Birth Certificate'} *
  //               </label>
  //               <input
  //                 type="file"
  //                 accept=".pdf,.jpg,.jpeg,.png"
  //                 onChange={(e) => handleFileChange('birthCertificate', e.target.files[0])}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //               />
  //               {errors.birthCertificate && <p className="text-red-500 text-sm mt-1">{errors.birthCertificate}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'পাসপোর্ট সাইজ ছবি' : 'Passport Size Photo'} *
  //               </label>
  //               <input
  //                 type="file"
  //                 accept=".jpg,.jpeg,.png"
  //                 onChange={(e) => handleFileChange('photo', e.target.files[0])}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //               />
  //               {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'পূর্ববর্তী রেজাল্ট কার্ড' : 'Previous Report Card'}
  //               </label>
  //               <input
  //                 type="file"
  //                 accept=".pdf,.jpg,.jpeg,.png"
  //                 onChange={(e) => handleFileChange('reportCard', e.target.files[0])}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //               />
  //             </div>
  //             <div>
  //               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
  //                 {language === 'bn' ? 'চিকিৎসা সনদ (প্রয়োজনে)' : 'Medical Certificate (if needed)'}
  //               </label>
  //               <input
  //                 type="file"
  //                 accept=".pdf,.jpg,.jpeg,.png"
  //                 onChange={(e) => handleFileChange('medicalCertificate', e.target.files[0])}
  //                 className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#00AEEF] focus:border-transparent"
  //               />
  //             </div>
  //             <div className="flex items-start space-x-3">
  //               <input
  //                 type="checkbox"
  //                 id="terms"
  //                 checked={formData.termsAccepted}
  //                 onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
  //                 className="mt-1"
  //               />
  //               <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
  //                 {language === 'bn'
  //                   ? 'আমি সকল শর্তাবলী এবং নীতিমালা গ্রহণ করছি।'
  //                   : 'I accept all terms and conditions.'
  //                 } *
  //               </label>
  //             </div>
  //             {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}
  //           </div>
  //         </div>
  //       )
  //     default:
  //       return null
  //   }
  // }

  return (
    <ErrorBoundary>
      <div>
        <NotFound />
      </div>
    </ErrorBoundary>
  );
}
