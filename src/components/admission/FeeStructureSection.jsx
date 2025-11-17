import React from 'react'
import { cn } from '@/lib/utils'

export function FeeStructureSection({ feeData, language }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className={cn(
        "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
        language === 'bn' ? "bengali-text" : ""
      )}>
        {language === 'bn' ? 'ফি কাঠামো - বিস্তারিত তথ্য' : 'Fee Structure - Detailed Information'}
      </h3>

      {/* One-time Fees */}
      <div className="bg-gradient-to-r from-[#00AEEF]/10 to-purple-50 dark:from-[#00AEEF]/5 dark:to-purple-900/20 rounded-2xl p-4 sm:p-6">
        <h4 className={cn(
          "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4",
          language === 'bn' ? "bengali-text" : ""
        )}>
          {language === 'bn' ? 'এককালীন ফি (ভর্তির সময়)' : 'One-time Fees (At Admission)'}
        </h4>
        <div className="grid gap-3 sm:gap-4">
          {feeData.oneTime.map((fee, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className={cn(
                "font-medium text-gray-900 dark:text-white text-sm sm:text-base",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {fee.name}
              </span>
              <span className="font-bold text-[#00AEEF] text-sm sm:text-base">
                {fee.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Fees */}
      <div className="space-y-4">
        {/* Tuition Fees */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 sm:p-6">
          <h4 className={cn(
            "text-base sm:text-lg md:text-xl font-semibold text-green-800 dark:text-green-200 mb-4",
            language === 'bn' ? "bengali-text" : ""
          )}>
            {language === 'bn' ? 'টিউশন ফি (মাসিক)' : 'Tuition Fees (Monthly)'}
          </h4>
          <div className="grid gap-3 sm:gap-4">
            {feeData.monthly.tuition.map((fee, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className={cn(
                  "font-medium text-gray-900 dark:text-white text-sm sm:text-base",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {fee.name}
                </span>
                <span className="font-bold text-green-600 text-sm sm:text-base">
                  {fee.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Residential Fees */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 sm:p-6">
          <h4 className={cn(
            "text-base sm:text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4",
            language === 'bn' ? "bengali-text" : ""
          )}>
            {language === 'bn' ? 'আবাসিক ফি (মাসিক)' : 'Residential Fees (Monthly)'}
          </h4>
          <div className="grid gap-3 sm:gap-4">
            {feeData.monthly.residential.map((fee, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className={cn(
                  "font-medium text-gray-900 dark:text-white text-sm sm:text-base",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {fee.name}
                </span>
                <span className="font-bold text-blue-600 text-sm sm:text-base">
                  {fee.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Food Fees */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 sm:p-6">
          <h4 className={cn(
            "text-base sm:text-lg md:text-xl font-semibold text-orange-800 dark:text-orange-200 mb-4",
            language === 'bn' ? "bengali-text" : ""
          )}>
            {language === 'bn' ? 'খাদ্য ফি (মাসিক)' : 'Food Fees (Monthly)'}
          </h4>
          <div className="grid gap-3 sm:gap-4">
            {feeData.monthly.food.map((fee, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <span className={cn(
                  "font-medium text-gray-900 dark:text-white text-sm sm:text-base",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {fee.name}
                </span>
                <span className="font-bold text-orange-600 text-sm sm:text-base">
                  {fee.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
