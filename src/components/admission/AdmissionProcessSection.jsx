import { CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

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
}

export function AdmissionProcessSection({ processData, language, getColorClasses }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-8 bg-[#00AEEF] rounded-full"></div>
        <h2 className={cn(
          "text-xl sm:text-2xl font-bold text-gray-900 dark:text-white",
          language === 'bn' ? "bengali-text" : ""
        )}>
          {language === 'bn' ? 'ভর্তি প্রক্রিয়া - ধাপ সমূহ' : 'Admission Process - Steps'}
        </h2>
      </div>

      {processData.map((step, index) => {
        const colorClasses = getColorClasses(step.color)
        return (
          <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
            {/* Step Number */}
            <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colorClasses.bg100} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClasses.bg500} rounded-xl flex items-center justify-center text-white font-bold text-base sm:text-lg`}>
                {step.step}
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3">
                <h4 className={cn(
                  "text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-0",
                  language === 'bn' ? "bengali-text" : ""
                )}>
                  {step.title}
                </h4>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className={cn("text-xs sm:text-sm", language === 'bn' ? "bengali-text" : "")}>
                    {step.duration}
                  </span>
                </div>
              </div>

              <p className={cn(
                "text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4",
                language === 'bn' ? "bengali-text" : ""
              )}>
                {step.description}
              </p>

              <div className="grid gap-1 sm:gap-2">
                {step.requirements.map((requirement, reqIndex) => (
                  <div key={reqIndex} className="flex items-center gap-2">
                    <CheckCircle className={`w-3 h-3 sm:w-4 sm:h-4 ${colorClasses.text500}`} />
                    <span className={cn(
                      "text-xs sm:text-sm text-gray-700 dark:text-gray-300",
                      language === 'bn' ? "bengali-text" : ""
                    )}>
                      {requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
