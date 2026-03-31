'use client';

import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, ArrowRight, Users, Clock, LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';
import { Level } from '@/types/components';

interface CurriculumTimelineProps {
  levels: Level[];
}

interface Milestone {
  icon: LucideIcon;
  title: {
    bn: string;
    en: string;
  };
  color: string;
}

export default function CurriculumTimeline({ levels }: CurriculumTimelineProps) {
  const { language } = useLanguageStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (!levels || levels.length === 0) return null;

  const milestones: Milestone[] = [
    {
      icon: Users,
      title: { bn: 'ভর্তি', en: 'Admission' },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: CheckCircle,
      title: { bn: 'হিফজ শুরু', en: 'Start Hifz' },
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Clock,
      title: { bn: 'দরস সম্পন্ন', en: 'Complete Dars' },
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: ArrowRight,
      title: { bn: 'সনদপ্রাপ্তি', en: 'Certification' },
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white kalpurush-font">
            {language === 'bn'
              ? 'শিক্ষা যাত্রা'
              : 'Education Journey'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 kalpurush-font">
            {language === 'bn'
              ? 'MNC এ ৭ বছরের শিক্ষা যাত্রা'
              : '7-year educational journey at MNC'}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-orange-200 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-orange-900/50 hidden md:block" />

          {/* Mobile Connecting Line */}
          <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-orange-200 dark:from-blue-900/50 dark:via-purple-900/50 dark:to-orange-900/50 md:hidden" />

          {/* Timeline Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {levels.map((level: Level, index: number) => {
              const milestoneIndex = index % 4;
              const milestone = milestones[milestoneIndex];
              const isActive = isVisible && index <= 2;

              return (
                <div
                  key={index}
                  className={`relative transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex md:flex-col items-start md:items-center gap-4">
                    {/* Timeline Node */}
                    <div className={`relative z-10 ${
                      isActive ? 'scale-110' : ''
                    }`}>
                      <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-lg transition-transform duration-300 ${
                        isActive ? 'scale-110 ring-4 ring-offset-4 ring-white/50 dark:ring-gray-900/50' : ''
                      }`}>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <milestone.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                      </div>

                      {/* Step Number */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00AEEF] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 md:text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
                        <span className="text-xs font-medium text-[#00AEEF] kalpurush-font">
                          {level.level}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white kalpurush-font text-sm md:text-base">
                        {level.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 kalpurush-font mt-1">
                        {level.age}
                      </p>

                      {/* Key Subject */}
                      {level.subjects?.madrasa?.[0] && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <CheckCircle className="w-3 h-3 text-blue-500" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 kalpurush-font">
                            {level.subjects.madrasa[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: { bn: 'মোট লেভেল', en: 'Total Levels' }, value: levels.length },
            { label: { bn: 'মাদরাসা বিষয়', en: 'Madrasa Subjects' }, value: '১০+' },
            { label: { bn: 'সাধারণ বিষয়', en: 'General Subjects' }, value: '৮+' },
            { label: { bn: 'কারিগরি বিষয়', en: 'Technical Subjects' }, value: '৬+' },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${(index + levels.length) * 100}ms` }}
            >
              <div className="text-2xl font-bold text-[#00AEEF]">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 kalpurush-font mt-1">
                {stat.label[language as keyof typeof stat.label]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}