import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ContactSection({ contactData, language }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className={cn(
        "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
        language === 'bn' ? "bengali-text" : ""
      )}>
        {language === 'bn' ? 'ভর্তি সম্পর্কিত যোগাযোগ' : 'Admission Contact Information'}
      </h3>

      <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Details */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AEEF] dark:text-[#00AEEF]/80" />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'ফোন নম্বর' : 'Phone Numbers'}
              </h4>
              <div className="space-y-1">
                {contactData.phone.map((number, idx) => (
                  <p key={idx} className={cn(
                    "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                    language === 'bn' ? "bengali-text" : ""
                  )}>
                    {number}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'ইমেইল' : 'Email'}
              </h4>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {contactData.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'ঠিকানা' : 'Address'}
              </h4>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {contactData.address}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className={cn(
                "font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'অফিস সময়' : 'Office Hours'}
              </h4>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {contactData.officeHours}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <div className="bg-gradient-to-br from-[#00AEEF] to-purple-600 rounded-2xl p-4 sm:p-6 text-white">
          <h4 className={cn(
            "text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4",
            language === 'bn' ? "bengali-text" : ""
          )}>
            {language === 'bn' ? 'দ্রুত ভর্তি প্রক্রিয়া শুরু করুন' : 'Start Admission Process Quickly'}
          </h4>
          <p className={cn(
            "mb-4 sm:mb-6 opacity-90 text-xs sm:text-sm",
            language === 'bn' ? "bengali-text" : ""
          )}>
            {language === 'bn'
              ? 'এখনই অনলাইনে আবেদন করুন এবং আপনার সন্তানের ভবিষ্যত গড়ার যাত্রা শুরু করুন'
              : 'Apply online now and start your child\'s future-building journey'
            }
          </p>

          <div className="space-y-3 sm:space-y-4">
            <a href="/apply" className="block">
              <button className="w-full bg-white text-[#00AEEF] hover:bg-gray-100 text-sm sm:text-base py-2 sm:py-3 rounded-lg font-medium transition-all">
                <span className={language === 'bn' ? "bengali-text" : ""}>
                  {language === 'bn' ? 'অনলাইনে আবেদন করুন' : 'Apply Online'}
                </span>
              </button>
            </a>

            <a href="/curriculum" className="block">
              <button className="w-full border-white text-white hover:bg-white hover:text-blue-600 text-sm sm:text-base py-2 sm:py-3 rounded-lg font-medium transition-all border-2">
                <span className={language === 'bn' ? "bengali-text" : ""}>
                  {language === 'bn' ? 'কারিকুলাম দেখুন' : 'View Curriculum'}
                </span>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
