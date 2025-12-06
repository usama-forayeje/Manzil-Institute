'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useLanguageStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { AnimatedGroup } from '../../components/ui/animated-group';
import ErrorBoundary from '../../components/ErrorBoundary';
import FooterSection from '../../components/footer';
import HeroHeader from '@/components/header';

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

export default function AdmissionFormPage() {
  const { language } = useLanguageStore();

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://institute.manzilgroupbd.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Admission Form',
        item: 'https://institute.manzilgroupbd.com/addmission-form',
      },
    ],
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoToApplyPage = () => {
    window.location.href = '/apply';
  };

  const handleGoBack = () => {
    window.location.href = '/admission';
  };

  const handleDownloadForm = () => {
    alert(
      language === 'bn'
        ? 'ফরম ডাউনলোড শুরু হচ্ছে...'
        : 'Form download starting...'
    );
    // In a real app, this would download a PDF form
  };

  return (
    <ErrorBoundary>
      <div>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <HeroHeader />

        <main
          className="min-h-screen bg-gray-50 dark:bg-gray-900 mx-auto max-w-4xl px-4 sm:px-6 pt-24 pb-12"
          dir="ltr"
        >
          <AnimatedGroup
            variants={{
              container: {
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
              },
              ...transitionVariants,
            }}
            className="space-y-8"
          >
            {/* Main Heading Section */}
            <section className="text-center mb-8 sm:mb-12">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 kalpurush-font">
                {language === 'bn'
                  ? 'ভর্তি আবেদন ফরম'
                  : 'Admission Application Form'}
              </h1>
              <h2 className="text-lg md:text-xl text-[#00AEEF] dark:text-[#00AEEF]/80 mb-6 kalpurush-font">
                {language === 'bn'
                  ? 'মানযিল ইন্টারন্যাশনাল ইনস্টিটিউট'
                  : 'Manzil International Institute'}
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto kalpurush-font">
                {language === 'bn'
                  ? 'আপনার সন্তানের ভর্তি প্রক্রিয়া সম্পন্ন করতে অনলাইন আবেদন ফরম পূরণ করুন অথবা ডাউনলোড করে ম্যানুয়ালি জমা দিন।'
                  : "Complete your child's admission process by filling out the online application form or download and submit manually."}
              </p>
            </section>

            {/* Options Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                {language === 'bn' ? 'আবেদনের উপায়' : 'Application Methods'}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Online Application */}
                <div className="bg-gradient-to-br from-[#00AEEF]/10 to-blue-50 dark:from-[#00AEEF]/5 dark:to-blue-900/20 rounded-2xl p-6 border border-[#00AEEF]/20">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#00AEEF]/20 dark:bg-[#00AEEF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ExternalLink className="w-8 h-8 text-[#00AEEF] dark:text-[#00AEEF]/80" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'bn'
                        ? 'অনলাইন আবেদন'
                        : 'Online Application'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {language === 'bn'
                        ? 'সহজ এবং দ্রুত অনলাইন আবেদন ফরম পূরণ করে আবেদন জমা দিন।'
                        : 'Fill out the easy and fast online application form to submit your application.'}
                    </p>
                    <Button
                      onClick={handleGoToApplyPage}
                      className="w-full bg-[#00AEEF] hover:bg-[#00AEEF]/90"
                    >
                      {language === 'bn' ? 'অনলাইন আবেদন করুন' : 'Apply Online'}
                    </Button>
                  </div>
                </div>

                {/* Download Form */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <ArrowLeft className="w-8 h-8 text-green-600 dark:text-green-400 rotate-90" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      {language === 'bn' ? 'ফরম ডাউনলোড' : 'Download Form'}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {language === 'bn'
                        ? 'আবেদন ফরম ডাউনলোড করে প্রিন্ট করে পূরণ করুন এবং জমা দিন।'
                        : 'Download the application form, print it, fill it out and submit it.'}
                    </p>
                    <Button
                      onClick={handleDownloadForm}
                      variant="outline"
                      className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-400 dark:text-green-400"
                    >
                      {language === 'bn' ? 'ফরম ডাউনলোড করুন' : 'Download Form'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'bn'
                  ? 'প্রয়োজনীয় নির্দেশনা'
                  : 'Important Instructions'}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'bn'
                      ? 'সকল প্রয়োজনীয় তথ্য সঠিকভাবে পূরণ করুন। ভুল তথ্যের কারণে আবেদন বাতিল হতে পারে।'
                      : 'Fill in all required information correctly. Applications may be cancelled due to incorrect information.'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'bn'
                      ? 'সকল প্রয়োজনীয় ডকুমেন্ট স্ক্যান করে আপলোড করুন (PDF, JPG, PNG ফরম্যাটে)।'
                      : 'Scan and upload all required documents (in PDF, JPG, PNG format).'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'bn'
                      ? 'আবেদন ফি এবং অন্যান্য চার্জ সম্পর্কে বিস্তারিত তথ্য ভর্তি বিভাগ থেকে জানুন।'
                      : 'Learn detailed information about application fees and other charges from the admission department.'}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {language === 'bn'
                      ? 'আবেদন জমা দেওয়ার পর আপনাকে একটি কনফার্মেশন ইমেইল পাঠানো হবে।'
                      : 'After submitting the application, you will receive a confirmation email.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'bn'
                  ? 'ভর্তি তথ্যে ফিরে যান'
                  : 'Back to Admission Info'}
              </Button>
              <Button
                onClick={handleGoToApplyPage}
                className="bg-[#00AEEF] hover:bg-[#00AEEF]/90"
              >
                {language === 'bn'
                  ? 'অনলাইন আবেদন শুরু করুন'
                  : 'Start Online Application'}
              </Button>
            </div>
          </AnimatedGroup>
        </main>
        <FooterSection />
      </div>
    </ErrorBoundary>
  );
}
