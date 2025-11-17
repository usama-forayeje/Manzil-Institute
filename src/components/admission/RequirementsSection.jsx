import React from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function RequirementsSection({ requirementsData, language }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className={cn(
        "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
        language === 'bn' ? "bengali-text" : ""
      )}>
        {language === 'bn' ? 'লেভেল অনুযায়ী যোগ্যতা ও প্রয়োজনীয় ডকুমেন্ট' : 'Level-wise Eligibility & Required Documents'}
      </h3>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Level 1 */}
        <div className="bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#00AEEF] rounded-full"></div>
            <h4 className={cn(
              "font-semibold text-[#00AEEF]/90 dark:text-[#00AEEF]/70 text-sm sm:text-base",
              language === 'bn' ? "bengali-text" : ""
            )}>
              {language === 'bn' ? 'লেভেল ১' : 'Level 1'}
            </h4>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'বয়স:' : 'Age:'}
              </h5>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {requirementsData.level1.age}
              </p>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level1.academic.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level1.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Level 2 */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            <h4 className={cn(
              "font-semibold text-green-700 dark:text-green-300 text-sm sm:text-base",
              language === 'bn' ? "bengali-text" : ""
            )}>
              {language === 'bn' ? 'লেভেল ২' : 'Level 2'}
            </h4>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'বয়স:' : 'Age:'}
              </h5>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {requirementsData.level2.age}
              </p>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level2.academic.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level2.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Level 3 */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full"></div>
            <h4 className={cn(
              "font-semibold text-purple-700 dark:text-purple-300 text-sm sm:text-base",
              language === 'bn' ? "bengali-text" : ""
            )}>
              {language === 'bn' ? 'লেভেল ৩' : 'Level 3'}
            </h4>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'বয়স:' : 'Age:'}
              </h5>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {requirementsData.level3.age}
              </p>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level3.academic.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.level3.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Huffaz System */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-orange-500 rounded-full"></div>
            <h4 className={cn(
              "font-semibold text-orange-700 dark:text-orange-300 text-sm sm:text-base",
              language === 'bn' ? "bengali-text" : ""
            )}>
              {language === 'bn' ? 'হুফ্ফাজ সিস্টেম' : 'Huffaz System'}
            </h4>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'বয়স:' : 'Age:'}
              </h5>
              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {requirementsData.huffaz.age}
              </p>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'একাডেমিক যোগ্যতা:' : 'Academic Qualification:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.huffaz.academic.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className={cn(
                "font-medium text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {language === 'bn' ? 'প্রয়োজনীয় ডকুমেন্ট:' : 'Required Documents:'}
              </h5>
              <ul className="space-y-1">
                {requirementsData.huffaz.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {doc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
