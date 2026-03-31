'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone, Mail } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';

interface FAQItem {
  question: {
    bn: string;
    en: string;
  };
  answer: {
    bn: string;
    en: string;
  };
}

export default function FAQAccordion() {
  const { language } = useLanguageStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: {
        bn: 'MNC তে ভর্তির জন্য কত বয়স লাগবে?',
        en: 'What is the minimum age for MNC admission?'
      },
      answer: {
        bn: 'MNC তে ভর্তির জন্য ন্যূনতম বয়স ৫ বছর। তবে লেভেল ১ এ ভর্তির জন্য সাধারণত ৫-৭ বছর বয়স প্রয়োজন।',
        en: 'The minimum age for MNC admission is 5 years. However, for Level 1, children typically need to be between 5-7 years old.'
      }
    },
    {
      question: {
        bn: 'MNC তে কতদিন পড়াশোনা করতে হবে?',
        en: 'How long does it take to complete MNC?'
      },
      answer: {
        bn: 'MNC সম্পূর্ণ করতে মোট ৭ বছর সময় লাগে, যা ৬টি লেভেলে বিভক্ত। প্রতিটি লেভেল ১-২ বছরে সম্পন্ন হয়।',
        en: 'It takes a total of 7 years to complete MNC, divided into 6 levels. Each level takes 1-2 years to complete.'
      }
    },
    {
      question: {
        bn: 'হিফজ কোর্স কতদিনে শেষ হয়?',
        en: 'How long does the Hifz course take?'
      },
      answer: {
        bn: 'হিফজ কোর্স সম্পূর্ণ করতে সাধারণত ২-৪ বছর সময় লাগে, যা শিক্ষার্থীর মেধা ও পরিশ্রমের উপর নির্ভর করে।',
        en: 'The Hifz course typically takes 2-4 years to complete, depending on the student\'s aptitude and dedication.'
      }
    },
    {
      question: {
        bn: 'MNC এ কারিগরি শিক্ষা কী অন্তর্ভুক্ত আছে?',
        en: 'What technical education is included in MNC?'
      },
      answer: {
        bn: 'MNC তে কম্পিউটার, রোবোটিক্স, প্রোগ্রামিং, এবং আধুনিক প্রযুক্তিগত দক্ষতা অন্তর্ভুক্ত রয়েছে যা শিক্ষার্থীদের ভবিষ্যতে কর্মসংস্থানের জন্য প্রস্তুত করে।',
        en: 'MNC includes computer, robotics, programming, and modern technical skills that prepare students for future employment opportunities.'
      }
    },
    {
      question: {
        bn: 'ভর্তির জন্য কী কী ডকুমেন্ট লাগবে?',
        en: 'What documents are required for admission?'
      },
      answer: {
        bn: 'ভর্তির জন্য জন্ম নিবন্ধন, পাসপোর্ট সাইজ ছবি, আইডি কার্ড এবং আগের শিক্ষার সার্টিফিকেট প্রয়োজন।',
        en: 'Birth registration, passport-size photos, ID card, and previous education certificates are required for admission.'
      }
    },
    {
      question: {
        bn: 'টিউশন ফি কত?',
        en: 'What is the tuition fee?'
      },
      answer: {
        bn: 'টিউশন ফি সেশন অনুযায়ী ভিন্ন। বিস্তারিত জানতে ভর্তি বিভাগে যোগাযোগ করুন।',
        en: 'Tuition fees vary by session. Contact the admission department for detailed information.'
      }
    },
    {
      question: {
        bn: 'বোর্ড পরীক্ষা কীভাবে হয়?',
        en: 'How are board examinations conducted?'
      },
      answer: {
        bn: 'MNC শিক্ষার্থীরা বেফাক বোর্ড এবং NCTB এর অধীনে পরীক্ষা দেয়। প্রতিটি লেভেলে বার্ষিক পরীক্ষা অনুষ্ঠিত হয়।',
        en: 'MNC students take examinations under Befak Board and NCTB. Annual examinations are held at each level.'
      }
    },
    {
      question: {
        bn: 'একাডেমিক ক্যালেন্ডার কী?',
        en: 'What is the academic calendar?'
      },
      answer: {
        bn: 'একাডেমিক বছর জানুয়ারি থেকে ডিসেম্বর পর্যন্ত। প্রতি বছর ২টি সেমিস্টার থাকে।',
        en: 'The academic year runs from January to December. There are 2 semesters each year.'
      }
    }
  ];

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 mb-4">
          <HelpCircle className="w-5 h-5 text-[#00AEEF]" />
          <span className="text-sm font-medium text-[#00AEEF] kalpurush-font">
            {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'Frequently Asked Questions'}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white kalpurush-font">
          {language === 'bn' ? 'জিজ্ঞাসা ও উত্তর' : 'Questions & Answers'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2 kalpurush-font">
          {language === 'bn'
            ? 'MNC সম্পর্কে সাধারণ জিজ্ঞাসাগুলোর উত্তর'
            : 'Common questions about MNC curriculum'}
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq: FAQItem, index: number) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span className="font-semibold text-gray-900 dark:text-white kalpurush-font pr-4">
                {faq.question[language as keyof typeof faq.question]}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-[#00AEEF] flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4">
                <p className="text-gray-600 dark:text-gray-400 kalpurush-font leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                  {faq.answer[language as keyof typeof faq.answer]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 kalpurush-font mb-4">
          {language === 'bn'
            ? 'আরো প্রশ্ন থাকলে যোগাযোগ করুন:'
            : 'Contact us for more questions:'}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="tel:+8801XXX-XXXXXX"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium kalpurush-font">
              {language === 'bn' ? 'কল করুন' : 'Call Now'}
            </span>
          </a>
          <a
            href="mailto:info@manzilgroupbd.com"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span className="text-sm font-medium kalpurush-font">
              {language === 'bn' ? 'ইমেইল করুন' : 'Email Us'}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}