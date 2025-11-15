/*
 * Application Form Component - Professional Version
 * Fixed hanging issues and improved performance
 */

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { HeroHeader } from '../components/header'
import FooterSection from '../components/footer'
import { useLanguageStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { AnimatedGroup } from '../components/ui/animated-group'

export const Route = createFileRoute('/addmissionForm')({
  component: AddmissionForm,
})

function AddmissionForm() {
  const navigate = useNavigate()
  const { language } = useLanguageStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [formData, setFormData] = useState({
    // Student Information
    studentName: '',
    studentNameBn: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Bangladeshi',
    religion: 'islam',
    bloodGroup: '',

    // Contact Information
    presentAddress: '',
    permanentAddress: '',
    phone: '',
    email: '',
    emergencyContact: '',

    // Parent Information
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',

    // Academic Information
    previousSchool: '',
    previousGrade: '',
    admissionLevel: '',
    admissionStream: '',

    // Documents
    birthCertificate: null,
    passportPhoto: null,
    previousReportCard: null,
    medicalCertificate: null,

    // Additional Information
    specialNeeds: '',
    siblingInfo: '',
    reference: '',
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target

    // Handle file inputs
    if (type === 'file') {
      const file = files?.[0]
      if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({
            ...prev,
            [name]: language === 'bn' ? 'ফাইল সাইজ ৫MB এর কম হতে হবে' : 'File size must be less than 5MB'
          }))
          return
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
        if (!validTypes.includes(file.type)) {
          setErrors(prev => ({
            ...prev,
            [name]: language === 'bn' ? 'শুধুমাত্র JPG, PNG, PDF ফাইল অনুমোদিত' : 'Only JPG, PNG, PDF files are allowed'
          }))
          return
        }

        setFormData(prev => ({
          ...prev,
          [name]: file
        }))

        // Clear file error
        if (errors[name]) {
          setErrors(prev => ({ ...prev, [name]: '' }))
        }
      }
      return
    }

    // Handle text inputs
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleInputBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    validateField(name, formData[name])
  }

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'studentName':
        if (!value.trim()) {
          newErrors.studentName = language === 'bn' ? 'ছাত্র/ছাত্রীর নাম আবশ্যক' : 'Student name is required'
        } else if (value.trim().length < 2) {
          newErrors.studentName = language === 'bn' ? 'নাম খুব ছোট' : 'Name is too short'
        } else {
          delete newErrors.studentName
        }
        break

      case 'dateOfBirth':
        if (!value) {
          newErrors.dateOfBirth = language === 'bn' ? 'জন্ম তারিখ আবশ্যক' : 'Date of birth is required'
        } else {
          const birthDate = new Date(value)
          const today = new Date()
          const age = today.getFullYear() - birthDate.getFullYear()

          if (age < 4) {
            newErrors.dateOfBirth = language === 'bn' ? 'বয়স কমপক্ষে ৪ বছর হতে হবে' : 'Age must be at least 4 years'
          } else if (age > 25) {
            newErrors.dateOfBirth = language === 'bn' ? 'বয়স ২৫ বছরের কম হতে হবে' : 'Age must be less than 25 years'
          } else {
            delete newErrors.dateOfBirth
          }
        }
        break

      case 'gender':
        if (!value) {
          newErrors.gender = language === 'bn' ? 'লিঙ্গ নির্বাচন করুন' : 'Please select gender'
        } else {
          delete newErrors.gender
        }
        break

      case 'presentAddress':
        if (!value.trim()) {
          newErrors.presentAddress = language === 'bn' ? 'বর্তমান ঠিকানা আবশ্যক' : 'Present address is required'
        } else if (value.trim().length < 10) {
          newErrors.presentAddress = language === 'bn' ? 'বিস্তারিত ঠিকানা লিখুন' : 'Please enter detailed address'
        } else {
          delete newErrors.presentAddress
        }
        break

      case 'phone':
        if (!value.trim()) {
          newErrors.phone = language === 'bn' ? 'ফোন নম্বর আবশ্যক' : 'Phone number is required'
        } else if (!/^(?:\+88|01)?\d{9,11}$/.test(value.replace(/\s/g, ''))) {
          newErrors.phone = language === 'bn' ? 'সঠিক ফোন নম্বর লিখুন' : 'Please enter valid phone number'
        } else {
          delete newErrors.phone
        }
        break

      case 'fatherName':
        if (!value.trim()) {
          newErrors.fatherName = language === 'bn' ? 'পিতার নাম আবশ্যক' : 'Father name is required'
        } else {
          delete newErrors.fatherName
        }
        break

      case 'motherName':
        if (!value.trim()) {
          newErrors.motherName = language === 'bn' ? 'মাতার নাম আবশ্যক' : 'Mother name is required'
        } else {
          delete newErrors.motherName
        }
        break

      case 'admissionLevel':
        if (!value) {
          newErrors.admissionLevel = language === 'bn' ? 'ভর্তি লেভেল নির্বাচন করুন' : 'Please select admission level'
        } else {
          delete newErrors.admissionLevel
        }
        break

      default:
        break
    }

    setErrors(newErrors)
  }

  const validateStep = (step) => {
    const newErrors = {}

    switch (step) {
      case 1: // Student Information
        validateField('studentName', formData.studentName)
        validateField('dateOfBirth', formData.dateOfBirth)
        validateField('gender', formData.gender)
        break

      case 2: // Contact Information
        validateField('presentAddress', formData.presentAddress)
        validateField('phone', formData.phone)
        break

      case 3: // Parent Information
        validateField('fatherName', formData.fatherName)
        validateField('motherName', formData.motherName)
        break

      case 4: // Academic Information
        validateField('admissionLevel', formData.admissionLevel)
        break
    }

    return Object.keys(errors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      if (validateStep(currentStep)) {
        // Here you would typically send the data to your backend
        console.log('Form submitted:', formData)
        alert(language === 'bn' ? 'আবেদন সফলভাবে জমা দেওয়া হয়েছে!' : 'Application submitted successfully!')
        navigate('/')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert(language === 'bn' ? 'আবেদন জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' : 'There was an error submitting your application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { id: 1, title: language === 'bn' ? 'ছাত্র তথ্য' : 'Student Info' },
    { id: 2, title: language === 'bn' ? 'যোগাযোগ' : 'Contact' },
    { id: 3, title: language === 'bn' ? 'অভিভাবক' : 'Parents' },
    { id: 4, title: language === 'bn' ? 'একাডেমিক' : 'Academic' },
    { id: 5, title: language === 'bn' ? 'ডকুমেন্ট' : 'Documents' }
  ]

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.studentName && formData.dateOfBirth && formData.gender
      case 2:
        return formData.presentAddress && formData.phone
      case 3:
        return formData.fatherName && formData.motherName
      case 4:
        return formData.admissionLevel
      default:
        return true
    }
  }

  return (
    <div>
      <HeroHeader />

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-4xl px-3 sm:px-4 lg:px-6 pt-20 sm:pt-24 pb-8 sm:pb-12">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
          }}
          className="space-y-8"
        >

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="mb-3 sm:mb-4 text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
            </Button>
            <h1 className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4",
              language === 'bn' && "kalpurush-font"
            )}>
              {language === 'bn' ? 'ভর্তি আবেদন ফরম' : 'Admission Application Form'}
            </h1>
            <p className={cn(
              "text-base sm:text-lg text-gray-600 dark:text-gray-400 px-2",
              language === 'bn' && "kalpurush-font"
            )}>
              {language === 'bn' ? 'আপনার তথ্য পূরণ করে আবেদন করুন' : 'Fill in your information to apply'}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-6 sm:mb-8 px-2">
            <div className="flex items-center overflow-x-auto scrollbar-hide gap-2 sm:gap-4 pb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-shrink-0">
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-300",
                    currentStep >= step.id
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                      : isStepValid(step.id)
                        ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-400 dark:text-green-300'
                        : 'bg-gray-100 border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400'
                  )}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={cn(
                    "ml-2 sm:ml-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors",
                    currentStep >= step.id
                      ? 'text-blue-600 dark:text-blue-400 font-semibold'
                      : isStepValid(step.id)
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400',
                    language === 'bn' && "kalpurush-font"
                  )}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-6 sm:w-12 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-300",
                      currentStep > step.id
                        ? 'bg-blue-600'
                        : isStepValid(step.id)
                          ? 'bg-green-500'
                          : 'bg-gray-300 dark:bg-gray-600'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300">

            {/* Step 1: Student Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h2 className={cn(
                    "text-xl sm:text-2xl font-bold text-gray-900 dark:text-white",
                    language === 'bn' && "kalpurush-font"
                  )}>
                    {language === 'bn' ? 'ছাত্র/ছাত্রীর তথ্য' : 'Student Information'}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'নাম (ইংরেজি)' : 'Name (English)'} *
                    </label>
                    <Input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={cn(
                        "transition-colors duration-200",
                        errors.studentName ? 'border-red-500 focus:border-red-500 ring-red-500' : '',
                        touched.studentName && !errors.studentName && 'border-green-500 focus:border-green-500'
                      )}
                      placeholder={language === 'bn' ? 'যেমন: Mohammad Abdullah' : 'e.g., Mohammad Abdullah'}
                    />
                    {errors.studentName && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {errors.studentName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'নাম (বাংলা)' : 'Name (Bengali)'}
                    </label>
                    <Input
                      type="text"
                      name="studentNameBn"
                      value={formData.studentNameBn}
                      onChange={handleInputChange}
                      className="transition-colors duration-200"
                      placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ আবদুল্লাহ' : 'e.g., মোহাম্মদ আবদুল্লাহ'}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'জন্ম তারিখ' : 'Date of Birth'} *
                    </label>
                    <Input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={cn(
                        "transition-colors duration-200",
                        errors.dateOfBirth ? 'border-red-500 focus:border-red-500 ring-red-500' : '',
                        touched.dateOfBirth && !errors.dateOfBirth && 'border-green-500 focus:border-green-500'
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'লিঙ্গ' : 'Gender'} *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      className={cn(
                        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200",
                        errors.gender ? 'border-red-500 focus:border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600',
                        touched.gender && !errors.gender && 'border-green-500 focus:border-green-500'
                      )}
                    >
                      <option value="">{language === 'bn' ? 'নির্বাচন করুন' : 'Select'}</option>
                      <option value="male">{language === 'bn' ? 'পুরুষ' : 'Male'}</option>
                      <option value="female">{language === 'bn' ? 'মহিলা' : 'Female'}</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {errors.gender}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'জাতীয়তা' : 'Nationality'}
                    </label>
                    <select
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="Bangladeshi">Bangladeshi</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'ধর্ম' : 'Religion'}
                    </label>
                    <select
                      name="religion"
                      value={formData.religion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="islam">{language === 'bn' ? 'ইসলাম' : 'Islam'}</option>
                      <option value="hindu">{language === 'bn' ? 'হিন্দু' : 'Hindu'}</option>
                      <option value="christian">{language === 'bn' ? 'খ্রিস্টান' : 'Christian'}</option>
                      <option value="other">{language === 'bn' ? 'অন্যান্য' : 'Other'}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information - Similar structure for other steps */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  <h2 className={cn(
                    "text-xl sm:text-2xl font-bold text-gray-900 dark:text-white",
                    language === 'bn' && "kalpurush-font"
                  )}>
                    {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className={cn(
                      "block text-sm font-medium text-gray-700 dark:text-gray-300",
                      language === 'bn' && "kalpurush-font"
                    )}>
                      {language === 'bn' ? 'বর্তমান ঠিকানা' : 'Present Address'} *
                    </label>
                    <Textarea
                      name="presentAddress"
                      value={formData.presentAddress}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      rows={3}
                      className={cn(
                        "transition-colors duration-200",
                        errors.presentAddress ? 'border-red-500 focus:border-red-500 ring-red-500' : '',
                        touched.presentAddress && !errors.presentAddress && 'border-green-500 focus:border-green-500'
                      )}
                      placeholder={language === 'bn' ? 'বিস্তারিত ঠিকানা লিখুন' : 'Enter detailed address'}
                    />
                    {errors.presentAddress && (
                      <p className="text-sm text-red-600 flex items-center gap-1 animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {errors.presentAddress}
                      </p>
                    )}
                  </div>

                  {/* Similar structure for other steps 2 fields */}
                </div>
              </div>
            )}

            {/* Steps 3-5 would follow similar pattern */}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                variant="outline"
                className="px-6 py-3 order-2 sm:order-1 transition-all duration-200 hover:scale-105"
              >
                {language === 'bn' ? 'পূর্ববর্তী' : 'Previous'}
              </Button>

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  {language === 'bn' ? 'পরবর্তী' : 'Next'}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 order-1 sm:order-2 transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...'}
                    </>
                  ) : (
                    language === 'bn' ? 'আবেদন জমা দিন' : 'Submit Application'
                  )}
                </Button>
              )}
            </div>
          </form>
        </AnimatedGroup>
      </main>

      <FooterSection />
    </div>
  )
}