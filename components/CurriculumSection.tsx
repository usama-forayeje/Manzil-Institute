'use client';

import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Layers, Sparkles } from 'lucide-react';
import { AnimatedGroup } from '@/components/ui/animated-group';

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

export default function CurriculumSection() {
  const { language } = useLanguageStore();

  const curricula = [
    {
      id: 'mnc',
      name: language === 'bn' ? 'MNC কারিকুলাম' : 'MNC Curriculum',
      description:
        language === 'bn'
          ? 'মানযিল ন্যাশনাল কারিকুলাম - জাতীয় শিক্ষা ব্যবস্থার সাথে সমন্বয়'
          : 'Manzil National Curriculum - Integrated with National Education System',
      features:
        language === 'bn'
          ? [
              'জাতীয় কারিকুলাম অনুসরণ',
              'স্থানীয় শিক্ষা ব্যবস্থার সাথে সামঞ্জস্য',
              'বিসিএস প্রস্তুতি অন্তর্ভুক্ত',
            ]
          : [
              'Follows National Curriculum',
              'Compatible with Local Education System',
              'Includes BCS Preparation',
            ],
      color: 'green',
    },
    {
      id: 'mic',
      name: language === 'bn' ? 'MIC কারিকুলাম' : 'MIC Curriculum',
      description:
        language === 'bn'
          ? 'মানযিল ইন্টারন্যাশনাল কারিকুলাম - আন্তর্জাতিক মানের শিক্ষা'
          : 'Manzil International Curriculum - International Standard Education',
      features:
        language === 'bn'
          ? [
              'আন্তর্জাতিক কারিকুলাম',
              'মাদরাসা, জেনারেল ও কারিগরি শিক্ষার সমন্বয়',
              '২২ বছরের পূর্ণাঙ্গ শিক্ষা ব্যবস্থা',
            ]
          : [
              'International Curriculum',
              'Integration of Madrasa, General & Technical Education',
              'Complete 22-year Education System',
            ],
      color: 'blue',
    },
  ];

  return (
    <section
      id="curriculum"
      className="relative py-24 lg:py-32 bg-slate-50/50 dark:bg-slate-950 overflow-hidden"
      dir="ltr"
    >
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10 pointer-events-none" />

      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.2 },
            },
          },
          ...transitionVariants,
        }}
        className="relative w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
      >
        {/* ===== HEADER ===== */}
        <div className="max-w-3xl mx-auto text-center mb-20 lg:mb-24">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-2" />
            <span
              className={cn(
                'text-xs font-bold tracking-wide uppercase text-slate-600 dark:text-slate-300',
                language === 'bn' && 'bengali-text font-normal'
              )}
            >
              {language === 'bn' ? 'শিক্ষা কারিকুলাম' : 'Education Curriculum'}
            </span>
          </div>
          <h2
            className={cn(
              'text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight',
              language === 'bn' && 'bengali-text'
            )}
          >
            {language === 'bn' ? 'মানযিল কারিকুলাম' : 'Manzil Curriculum'}
          </h2>
          <p
            className={cn(
              'text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed',
              language === 'bn' && 'bengali-text'
            )}
          >
            {language === 'bn'
              ? 'মানযিল ইনস্টিটিউট একটি ব্যতিক্রমধর্মী শিক্ষা প্রতিষ্ঠান, যেখানে মাদরাসা, জেনারেল ও কারিগরি শিক্ষার বিজ্ঞানসম্মত সমন্বয় ঘটানো হয়েছে। আমাদের দুটি বিশেষায়িত কারিকুলাম—MNC (জাতীয় মান) এবং MIC (আন্তর্জাতিক মান) থেকে আপনার সন্তানের ভবিষ্যত গড়ার জন্য সঠিক পছন্দ করুন।'
              : "Manzil Institute is an exceptional educational institution where Madrasa, General, and Technical education are scientifically integrated. Choose from our two specialized curricula—MNC (National Standard) and MIC (International Standard) to shape your child's future."}
          </p>
        </div>

        {/* ===== CURRICULUM CARDS ===== */}
        <div className="grid gap-8 md:grid-cols-2">
          {curricula.map((curriculum, idx) => (
            <div
              key={curriculum.id}
              className="group/item p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover/item:scale-110 transition-transform duration-300">
                <Layers className="w-5 h-5" />
              </div>
              <h3
                className={cn(
                  'font-bold text-slate-900 dark:text-white mb-2 text-lg',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {curriculum.name}
              </h3>
              <p
                className={cn(
                  'text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4',
                  language === 'bn' && 'bengali-text'
                )}
              >
                {curriculum.description}
              </p>
              <ul className="space-y-2">
                {curriculum.features.map((feature, featureIdx) => (
                  <li key={featureIdx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span
                      className={cn(
                        'text-sm text-slate-700 dark:text-slate-300',
                        language === 'bn' && 'bengali-text'
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </AnimatedGroup>
    </section>
  );
}
