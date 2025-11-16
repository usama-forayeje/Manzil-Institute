import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ImportantDatesSection({ datesData, language }) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <h3 className={cn(
        "text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6",
        language === 'bn' ? "bengali-text" : ""
      )}>
        {language === 'bn' ? 'গুরুত্বপূর্ণ তারিখসমূহ' : 'Important Dates'}
      </h3>

      <div className="grid gap-4 sm:gap-6">
        {datesData.map((date, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#00AEEF] dark:text-[#00AEEF]/80" />
              </div>
              <div>
                <h4 className={cn(
                  "font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {date.event}
                </h4>
                <p className={cn(
                  "text-xs sm:text-sm text-gray-600 dark:text-gray-400",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {date.date}
                </p>
              </div>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              date.status === 'open'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            )}>
              {date.status === 'open'
                ? (language === 'bn' ? 'চলমান' : 'Ongoing')
                : (language === 'bn' ? 'আসন্ন' : 'Upcoming')
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
