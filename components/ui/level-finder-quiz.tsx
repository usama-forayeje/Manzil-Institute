'use client';

import React, { useState } from 'react';
import { Calculator, ChevronRight, CheckCircle, BookOpen, Users, Clock } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';

interface QuizOption {
  value: string;
  label: {
    bn: string;
    en: string;
  };
  level: number;
}

interface QuizQuestion {
  id: string;
  question: {
    bn: string;
    en: string;
  };
  options: QuizOption[];
}

interface Answer {
  value: string;
  level: number;
}

interface LevelRecommendation {
  level: string;
  title: {
    bn: string;
    en: string;
  };
  age: {
    bn: string;
    en: string;
  };
  description: {
    bn: string;
    en: string;
  };
  subjects: {
    bn: string;
    en: string;
  };
}

export default function LevelFinderQuiz() {
  const { language } = useLanguageStore();
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<number | null>(null);

  const questions: QuizQuestion[] = [
    {
      id: 'age',
      question: {
        bn: 'আপনার সন্তানের বয়স কত?',
        en: 'What is your child\'s age?'
      },
      options: [
        {
          value: '5-7',
          label: { bn: '৫-৭ বছর', en: '5-7 years' },
          level: 1
        },
        {
          value: '8-10',
          label: { bn: '৮-১০ বছর', en: '8-10 years' },
          level: 2
        },
        {
          value: '11-13',
          label: { bn: '১১-১৩ বছর', en: '11-13 years' },
          level: 3
        },
        {
          value: '14+',
          label: { bn: '১৪+ বছর', en: '14+ years' },
          level: 4
        }
      ]
    },
    {
      id: 'experience',
      question: {
        bn: 'আপনার সন্তানের পূর্বের শিক্ষার অভিজ্ঞতা কীরূপ?',
        en: 'What is your child\'s previous education experience?'
      },
      options: [
        {
          value: 'none',
          label: { bn: 'কোন অভিজ্ঞতা নেই', en: 'No prior experience' },
          level: 1
        },
        {
          value: 'pre-primary',
          label: { bn: 'প্রি-প্রাইমারি', en: 'Pre-primary' },
          level: 1
        },
        {
          value: 'primary',
          label: { bn: 'প্রাইমারি', en: 'Primary (1-5)' },
          level: 2
        },
        {
          value: 'secondary',
          label: { bn: 'সেকেন্ডারি', en: 'Secondary' },
          level: 3
        }
      ]
    },
    {
      id: 'goal',
      question: {
        bn: 'MNC তে ভর্তির মূল উদ্দেশ্য কী?',
        en: 'What is the main goal for enrolling in MNC?'
      },
      options: [
        {
          value: 'hifz',
          label: { bn: 'হিফজ/কোরআন মুখস্থ', en: 'Hifz/Quran Memorization' },
          level: 1
        },
        {
          value: 'religious',
          label: { bn: 'ইসলামিক শিক্ষা', en: 'Islamic Education' },
          level: 1
        },
        {
          value: 'balanced',
          label: { bn: 'সমন্বিত শিক্ষা', en: 'Balanced Education' },
          level: 2
        },
        {
          value: 'career',
          label: { bn: 'কারিগরি দক্ষতা', en: 'Technical Skills' },
          level: 3
        }
      ]
    }
  ];

  const levelRecommendations: Record<number, LevelRecommendation> = {
    1: {
      level: 'Level 1',
      title: { bn: 'প্রাথমিক পর্যায়', en: 'Foundation Level' },
      age: { bn: '৫-৮ বছর', en: '5-8 years' },
      description: {
        bn: 'আপনার সন্তান Level 1 এ ভর্তির জন্য উপযুক্ত। এই পর্যায়ে মৌলিক ইসলামিক শিক্ষা, কোরআন পাঠ এবং প্রাথমিক সাধারণ শিক্ষা দেওয়া হয়।',
        en: 'Your child is suitable for Level 1 admission. This level focuses on basic Islamic education, Quran reading, and foundational general education.'
      },
      subjects: { bn: 'কোরআন পাঠ, আকায়েদ, আরবি, বাংলা, গণিত', en: 'Quran Reading, Aqaid, Arabic, Bengali, Math' }
    },
    2: {
      level: 'Level 2',
      title: { bn: 'মধ্যম পর্যায়', en: 'Intermediate Level' },
      age: { bn: '৮-১২ বছর', en: '8-12 years' },
      description: {
        bn: 'আপনার সন্তান Level 2 এ ভর্তির জন্য উপযুক্ত। এই পর্যায়ে দরসে নিজামী, হাদিস এবং উন্নত সাধারণ শিক্ষা অন্তর্ভুক্ত।',
        en: 'Your child is suitable for Level 2 admission. This level includes Dars-e-Nizami, Hadith, and advanced general education.'
      },
      subjects: { bn: 'দরসে নিজামী, হাদিস, ফিকহ, বাংলা, ইংরেজি, বিজ্ঞান', en: 'Dars-e-Nizami, Hadith, Fiqh, Bengali, English, Science' }
    },
    3: {
      level: 'Level 3',
      title: { bn: 'উন্নত পর্যায়', en: 'Advanced Level' },
      age: { bn: '১২+ বছর', en: '12+ years' },
      description: {
        bn: 'আপনার সন্তান Level 3 বা তার পরে ভর্তির জন্য উপযুক্ত। এই পর্যায়ে উচ্চতর ইসলামিক শিক্ষা, কারিগরি প্রশিক্ষণ এবং প্রস্তুতিমূলক কোর্স অন্তর্ভুক্ত।',
        en: 'Your child is suitable for Level 3 or higher admission. This level includes advanced Islamic education, technical training, and preparatory courses.'
      },
      subjects: { bn: 'উচ্চ দরসে নিজামী, কারিগরি দক্ষতা, প্রস্তুতিমূলক', en: 'Advanced Dars-e-Nizami, Technical Skills, Preparatory' }
    }
  };

  const handleAnswer = (questionId: string, value: string, level: number) => {
    const newAnswers = { ...answers, [questionId]: { value, level } };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate result based on average level - include current answer
      const levels = Object.values(newAnswers).map((a: Answer) => a.level);
      const avgLevel = levels.reduce((a: number, b: number) => a + b, 0) / levels.length;
      const recommendedLevel = Math.max(1, Math.min(3, Math.round(avgLevel)));
      setResult(recommendedLevel);
    }
  };

  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <section className="mt-12 p-6 bg-gradient-to-br from-[#00AEEF]/10 to-purple-50 dark:from-[#00AEEF]/5 dark:to-purple-900/20 rounded-2xl border border-[#00AEEF]/20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 mb-4">
            <Calculator className="w-5 h-5 text-[#00AEEF]" />
            <span className="text-sm font-medium text-[#00AEEF] kalpurush-font">
              {language === 'bn' ? 'লেভেল ফাইন্ডার' : 'Level Finder'}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white kalpurush-font">
            {language === 'bn'
              ? 'আপনার সন্তানের জন্য সঠিক লেভেল খুঁজুন'
              : 'Find the Right Level for Your Child'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 kalpurush-font">
            {language === 'bn'
              ? 'কিছু প্রশ্নের উত্তর দিয়ে আপনার সন্তানের জন্য উপযুক্ত MNC লেভেল জানুন'
              : 'Answer a few questions to find the appropriate MNC level for your child'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
              {language === 'bn' ? 'অগ্রগতি' : 'Progress'}
            </span>
            <span className="text-sm font-medium text-[#00AEEF] kalpurush-font">
              {result ? '✓' : `${step + 1}/${questions.length}`}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00AEEF] to-purple-500 transition-all duration-500"
              style={{ width: `${result ? 100 : ((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Quiz Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          {!result ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white kalpurush-font mb-4">
                  {questions[step].question[language as keyof typeof questions[0]['question']]}
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {questions[step].options.map((option: QuizOption, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(questions[step].id, option.value, option.level)}
                      className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-[#00AEEF] hover:bg-[#00AEEF]/5 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 dark:text-white kalpurush-font">
                          {option.label[language as keyof typeof option.label]}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#00AEEF] transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#00AEEF] kalpurush-font"
                  >
                    ← {language === 'bn' ? 'পিছনে' : 'Back'}
                  </button>
                )}
                <div className="ml-auto">
                  <span className="text-xs text-gray-500 kalpurush-font">
                    {language === 'bn' ? 'প্রশ্ন' : 'Question'} {step + 1} {language === 'bn' ? 'এর' : 'of'} {questions.length}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Result */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white kalpurush-font mb-2">
                {levelRecommendations[result].level}
              </h3>
              <p className="text-lg text-[#00AEEF] font-medium kalpurush-font mb-4">
                {levelRecommendations[result].title[language as keyof typeof levelRecommendations[1]['title']]}
              </p>

              <p className="text-gray-600 dark:text-gray-400 kalpurush-font mb-6">
                {levelRecommendations[result].description[language as keyof typeof levelRecommendations[1]['description']]}
              </p>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 kalpurush-font">
                  {language === 'bn' ? 'বয়স:' : 'Age Range:'}
                </p>
                <p className="font-medium text-gray-900 dark:text-white kalpurush-font">
                  {levelRecommendations[result].age[language as keyof typeof levelRecommendations[1]['age']]}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 mb-2 kalpurush-font">
                  {language === 'bn' ? 'মূল বিষয়সমূহ:' : 'Key Subjects:'}
                </p>
                <p className="text-gray-700 dark:text-gray-300 kalpurush-font">
                  {levelRecommendations[result].subjects[language as keyof typeof levelRecommendations[1]['subjects']]}
                </p>
              </div>

              <button
                onClick={resetQuiz}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium kalpurush-font hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language === 'bn' ? 'পুনরায় শুরু করুন' : 'Start Over'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}