import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Upload, User, Phone, Calendar, CheckCircle2 } from 'lucide-react'
import { useForm } from '@tanstack/react-form'

export const Route = createFileRoute('/apply')({
  component: ApplicationPage,
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
          : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      } ${className}`}
  >
    {children}
  </button>
)

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:bg-gray-800 dark:border-gray-600 dark:text-white ${className}`}
    {...props}
  />
)

const Label = ({ children, htmlFor, className = "" }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${className}`}>
    {children}
  </label>
)

// Mock language store
const useLanguageStore = () => ({ language: 'bn' })

function ApplicationPage() {
  const { language } = useLanguageStore()
  // const [selectedImage, setSelectedImage] = useState(null)
  // const [submitted, setSubmitted] = useState(false)

  // const form = useForm({
  //   defaultValues: {
  //     studentName: '',
  //     age: 0,
  //     phone: '',
  //     studentImage: null,
  //   },
  //   onSubmit: async ({ value }) => {
  //     console.log('Form submitted:', value)
  //     setSubmitted(true)

  //     // Simulate API call
  //     setTimeout(() => {
  //       window.location.href = '/'
  //     }, 2500)
  //   },
  // })

  // const handleImageChange = (e) => {
  //   const file = e.target.files?.[0]
  //   if (file) {
  //     setSelectedImage(URL.createObjectURL(file))
  //     form.setFieldValue('studentImage', file)
  //   }
  // }

  // if (submitted) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
  //       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fadeIn">
  //         <div className="mb-6">
  //           <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
  //         </div>
  //         <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
  //           {language === 'bn' ? '✨ আবেদন সফল!' : '✨ Application Successful!'}
  //         </h2>
  //         <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
  //           {language === 'bn' 
  //             ? 'আপনার আবেদন সফলভাবে জমা দেওয়া হয়েছে। শীঘ্রই আমরা আপনার সাথে যোগাযোগ করব।'
  //             : 'Your application has been submitted successfully. We will contact you soon.'}
  //         </p>
  //       </div>
  //     </div>
  //   )
  // }

   const navigate = useNavigate()
 
   const handleGoBack = () => {
     navigate({ to: '/' })
   }

  return (
    // <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
    //   <div className="container mx-auto px-4 py-8 max-w-4xl">
    //     {/* Header */}
    //     <Button
    //       onClick={() => window.history.back()}
    //       variant="ghost"
    //       className="mb-6 flex items-center gap-2"
    //     >
    //       <ArrowLeft className="w-4 h-4" />
    //       {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
    //     </Button>

    //     <div className="text-center mb-8">
    //       <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
    //         {language === 'bn' ? 'ভর্তি আবেদন ফরম' : 'Admission Application Form'}
    //       </h1>
    //       <p className="text-gray-600 dark:text-gray-300 text-lg">
    //         {language === 'bn' ? 'সহজ ভর্তি প্রক্রিয়া সম্পন্ন করুন' : 'Complete simple admission process'}
    //       </p>
    //     </div>

    //     {/* Form Card */}
    //     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
    //       <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
    //         <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
    //           <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
    //             <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    //           </div>
    //           {language === 'bn' ? 'ছাত্র/ছাত্রীর তথ্য' : 'Student Information'}
    //         </h2>
    //         <p className="text-sm text-gray-500 dark:text-gray-400">
    //           {language === 'bn' ? 'সকল তথ্য সঠিকভাবে পূরণ করুন' : 'Please fill all information correctly'}
    //         </p>
    //       </div>

    //       <div>
    //         {/* Student Name */}
    //         <form.Field
    //           name="studentName"
    //           validators={{
    //             onChange: ({ value }) => {
    //               if (!value || value.length < 2) return 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'
    //               if (value.length > 100) return 'নাম ১০০ অক্ষরের মধ্যে হতে হবে'
    //               return undefined
    //             }
    //           }}
    //           children={(field) => (
    //             <div className="mb-5">
    //               <Label htmlFor="studentName">
    //                 <User className="w-4 h-4 inline mr-1" />
    //                 {language === 'bn' ? 'ছাত্র/ছাত্রীর নাম' : 'Student Name'} *
    //               </Label>
    //               <Input
    //                 id="studentName"
    //                 type="text"
    //                 value={field.state.value}
    //                 onChange={(e) => field.handleChange(e.target.value)}
    //                 onBlur={field.handleBlur}
    //                 placeholder={language === 'bn' ? 'পুরো নাম লিখুন' : 'Enter full name'}
    //               />
    //               {field.state.meta.errors?.length > 0 && (
    //                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    //                   ⚠️ {field.state.meta.errors[0]}
    //                 </p>
    //               )}
    //             </div>
    //           )}
    //         />

    //         {/* Age and Phone Grid */}
    //         <div className="grid md:grid-cols-2 gap-5 mb-5">
    //           {/* Age */}
    //           <form.Field
    //             name="age"
    //             validators={{
    //               onChange: ({ value }) => {
    //                 const num = Number(value)
    //                 if (!num || num < 4) return 'বয়স কমপক্ষে ৪ বছর হতে হবে'
    //                 if (num > 25) return 'বয়স সর্বোচ্চ ২৫ বছর হতে পারে'
    //                 return undefined
    //               }
    //             }}
    //             children={(field) => (
    //               <div>
    //                 <Label htmlFor="age">
    //                   <Calendar className="w-4 h-4 inline mr-1" />
    //                   {language === 'bn' ? 'বয়স' : 'Age'} *
    //                 </Label>
    //                 <Input
    //                   id="age"
    //                   type="number"
    //                   value={field.state.value || ''}
    //                   onChange={(e) => field.handleChange(Number(e.target.value))}
    //                   onBlur={field.handleBlur}
    //                   placeholder={language === 'bn' ? 'বয়স লিখুন' : 'Enter age'}
    //                   min="4"
    //                   max="25"
    //                 />
    //                 {field.state.meta.errors?.length > 0 && (
    //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    //                     ⚠️ {field.state.meta.errors[0]}
    //                   </p>
    //                 )}
    //               </div>
    //             )}
    //           />

    //           {/* Phone */}
    //           <form.Field
    //             name="phone"
    //             validators={{
    //               onChange: ({ value }) => {
    //                 if (!/^01\d{9}$/.test(value)) return 'বৈধ বাংলাদেশী ফোন নম্বর দিন (01XXXXXXXXX)'
    //                 return undefined
    //               }
    //             }}
    //             children={(field) => (
    //               <div>
    //                 <Label htmlFor="phone">
    //                   <Phone className="w-4 h-4 inline mr-1" />
    //                   {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'} *
    //                 </Label>
    //                 <Input
    //                   id="phone"
    //                   type="tel"
    //                   value={field.state.value}
    //                   onChange={(e) => field.handleChange(e.target.value)}
    //                   onBlur={field.handleBlur}
    //                   placeholder="01XXXXXXXXX"
    //                   maxLength="11"
    //                 />
    //                 {field.state.meta.errors?.length > 0 && (
    //                   <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    //                     ⚠️ {field.state.meta.errors[0]}
    //                   </p>
    //                 )}
    //               </div>
    //             )}
    //           />
    //         </div>

    //         {/* Student Image */}
    //         <form.Field
    //           name="studentImage"
    //           validators={{
    //             onChange: ({ value }) => {
    //               if (!value || !(value instanceof File)) return 'ছাত্র/ছাত্রীর ছবি আবশ্যক'
    //               if (value.size > 5 * 1024 * 1024) return 'ছবির আকার ৫MB এর কম হতে হবে'
    //               if (!['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)) {
    //                 return 'শুধুমাত্র JPG, JPEG, PNG ফরম্যাট সমর্থিত'
    //               }
    //               return undefined
    //             }
    //           }}
    //           children={(field) => (
    //             <div className="mb-6">
    //               <Label htmlFor="studentImage">
    //                 <Upload className="w-4 h-4 inline mr-1" />
    //                 {language === 'bn' ? 'ছাত্র/ছাত্রীর ছবি' : 'Student Image'} *
    //               </Label>
    //               <div className="mt-2">
    //                 <label
    //                   htmlFor="studentImage"
    //                   className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-all group"
    //                 >
    //                   {selectedImage ? (
    //                     <div className="relative w-full h-full p-2">
    //                       <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded" />
    //                       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
    //                         <p className="text-white opacity-0 group-hover:opacity-100 transition-all font-medium">
    //                           {language === 'bn' ? 'পরিবর্তন করুন' : 'Change Image'}
    //                         </p>
    //                       </div>
    //                     </div>
    //                   ) : (
    //                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
    //                       <Upload className="w-12 h-12 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
    //                       <p className="text-sm text-gray-500 font-medium">
    //                         {language === 'bn' ? 'ছবি আপলোড করুন' : 'Upload Image'}
    //                       </p>
    //                       <p className="text-xs text-gray-400 mt-2">
    //                         JPG, JPEG, PNG (Max 5MB)
    //                       </p>
    //                     </div>
    //                   )}
    //                   <input
    //                     id="studentImage"
    //                     type="file"
    //                     className="hidden"
    //                     accept="image/jpeg,image/jpg,image/png"
    //                     onChange={handleImageChange}
    //                     onBlur={field.handleBlur}
    //                   />
    //                 </label>
    //               </div>
    //               {field.state.meta.errors?.length > 0 && (
    //                 <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
    //                   ⚠️ {field.state.meta.errors[0]}
    //                 </p>
    //               )}
    //             </div>
    //           )}
    //         />

    //         {/* Submit Button */}
    //         <form.Subscribe
    //           selector={(state) => [state.canSubmit, state.isSubmitting]}
    //           children={([canSubmit, isSubmitting]) => (
    //             <Button
    //               type="button"
    //               onClick={(e) => {
    //                 e.preventDefault()
    //                 form.handleSubmit()
    //               }}
    //               className="w-full py-3 text-lg font-semibold"
    //               disabled={!canSubmit || isSubmitting}
    //             >
    //               {isSubmitting
    //                 ? (language === 'bn' ? '⏳ জমা দেওয়া হচ্ছে...' : '⏳ Submitting...')
    //                 : (language === 'bn' ? '✅ আবেদন জমা দিন' : '✅ Submit Application')}
    //             </Button>
    //           )}
    //         />

    //         <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
    //           {language === 'bn'
    //             ? 'আবেদন জমা দেওয়ার পর আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন'
    //             : 'Our representative will contact you after submission'}
    //         </p>
    //       </div>
    //     </div>

    //     {/* Help Section */}
    //     <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 text-center shadow-lg">
    //       <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
    //         💬 {language === 'bn' ? 'সাহায্যের প্রয়োজন?' : 'Need Help?'}
    //       </h3>
    //       <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
    //         {language === 'bn'
    //           ? 'কোন সমস্যা হলে আমাদের হেল্পলাইনে কল করুন'
    //           : 'Call our helpline if you face any issues'}
    //       </p>
    //       <div className="flex flex-col sm:flex-row justify-center gap-3 text-sm font-medium">
    //         <span className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
    //           📞 +880 XXXX-XXXXXX
    //         </span>
    //         <span className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow">
    //           📧 info@manzil.com
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='text-center flex flex-col items-center justify-center h-screen mx-auto px-4'>
      <p className='text-lg mb-6'>{language === 'bn' ? 'আবেদন পৃষ্ঠা নির্মাণাধীন!' : 'Application Page is under construction!'}!</p>
      <Button onClick={handleGoBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        {language === 'bn' ? 'ফিরে যান' : 'Go Back'}
      </Button>
    </div>

  )
}