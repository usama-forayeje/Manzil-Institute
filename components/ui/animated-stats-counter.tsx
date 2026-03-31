'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Users, BookOpen, Award, Clock, LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: {
    bn: string;
    en: string;
  };
  color: 'cyan' | 'green' | 'purple' | 'orange';
}

export default function AnimatedStatsCounter() {
  const { language } = useLanguageStore();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Counter animation hook
  const useCountUp = (end: number, duration: number = 2000, startOnVisible: boolean = true): number => {
    const [count, setCount] = useState<number>(0);
    const [hasStarted, setHasStarted] = useState<boolean>(false);

    useEffect(() => {
      if (!startOnVisible || !isVisible) return;
      if (hasStarted) return;

      setHasStarted(true);
      let startTime: number | null = null;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime!) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, isVisible, hasStarted, startOnVisible]);

    return count;
  };

  // Intersection Observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats: StatItem[] = [
    {
      icon: Users,
      value: 500,
      suffix: '+',
      label: {
        bn: 'শিক্ষার্থী',
        en: 'Students'
      },
      color: 'cyan'
    },
    {
      icon: BookOpen,
      value: 22,
      suffix: '+',
      label: {
        bn: 'বছরের অভিজ্ঞতা',
        en: 'Years Experience'
      },
      color: 'green'
    },
    {
      icon: Award,
      value: 98,
      suffix: '%',
      label: {
        bn: 'পাস রেট',
        en: 'Pass Rate'
      },
      color: 'purple'
    },
    {
      icon: Clock,
      value: 7,
      suffix: '',
      label: {
        bn: 'বছরের কোর্স',
        en: 'Years Program'
      },
      color: 'orange'
    }
  ];

  const colorClasses: Record<string, Record<string, string>> = {
    cyan: {
      bg: 'bg-[#00AEEF]/10 dark:bg-[#00AEEF]/5',
      border: 'border-[#00AEEF]/20',
      icon: 'text-[#00AEEF]',
      value: 'text-[#00AEEF]',
      ring: 'group-hover:ring-[#00AEEF]/20'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      value: 'text-green-600 dark:text-green-400',
      ring: 'group-hover:ring-green-200/50'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-600 dark:text-purple-400',
      value: 'text-purple-600 dark:text-purple-400',
      ring: 'group-hover:ring-purple-200/50'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      value: 'text-orange-600 dark:text-orange-400',
      ring: 'group-hover:ring-orange-200/50'
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white kalpurush-font">
            {language === 'bn'
              ? 'MNC এর সংখ্যা'
              : 'MNC in Numbers'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 kalpurush-font">
            {language === 'bn'
              ? 'আমাদের কারিকুলামের সাফল্যের পরিসংখ্যান'
              : 'Our curriculum success statistics'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat: StatItem, index: number) => {
            const count = useCountUp(stat.value);
            const colors = colorClasses[stat.color];

            return (
              <div
                key={index}
                className={`group relative ${colors.bg} border ${colors.border} rounded-2xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-xl ${colors.ring}`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Value */}
                <div className={`text-3xl md:text-4xl font-bold ${colors.value} mb-2 tabular-nums`}>
                  {count}{stat.suffix}
                </div>

                {/* Label */}
                <div className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                  {stat.label[language as keyof typeof stat.label]}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current opacity-20" />
                <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-current opacity-20" />
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 kalpurush-font">
            {language === 'bn'
              ? '📊 ২০২৪ সালের হিসাব অনুযায়ী'
              : '📊 As of 2024 statistics'}
          </p>
        </div>
      </div>
    </section>
  );
}