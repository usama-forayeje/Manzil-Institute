'use client';

import React, { useState } from 'react';
import { X, ArrowRight, Check, BookText, Users, Clock, Award } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';
import { ComparisonModalProps, Level } from '@/types/components';

export default function ComparisonModal({ levels, onClose }: ComparisonModalProps) {
  const { language } = useLanguageStore();
  const [compareLevel, setCompareLevel] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validate levels data
  if (!levels || levels.length === 0) {
    setError(language === 'bn' ? 'কোনো তথ্য পাওয়া যায়নি' : 'No data available');
    return null;
  }

  // Check for missing data
  const hasValidData = levels.every(level => 
    level && level.level && level.subjects
  );
  
  if (!hasValidData) {
    setError(language === 'bn' ? 'ডেটা ত্রুটি আছে' : 'Data error detected');
    return null;
  }

  // Get all unique subjects from all levels
  const allSubjects = {
    madrasa: [...new Set(levels.flatMap(l => l.subjects?.madrasa || []))],
    general: [...new Set(levels.flatMap(l => l.subjects?.general || []))],
    technical: [...new Set(levels.flatMap(l => l.subjects?.technical || []))],
  };

  const hasSubject = (level: Level, subject: string, category: 'madrasa' | 'general' | 'technical'): boolean => {
    return level.subjects?.[category]?.includes(subject) || false;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in flex flex-col"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-20"
          aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00AEEF] to-purple-600 p-6">
          <h2 className="text-2xl font-bold text-white kalpurush-font flex items-center gap-3">
            <ArrowRight className="w-6 h-6" />
            {language === 'bn'
              ? 'লেভেল তুলনা করুন'
              : 'Compare Levels'}
          </h2>
          <p className="text-white/80 mt-1 kalpurush-font">
            {language === 'bn'
              ? 'সব লেভেলের বিষয়গুলো একসাথে দেখুন'
              : 'View all subjects across all levels at a glance'}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Level Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 kalpurush-font self-center">
              {language === 'bn' ? 'তুলনা করুন:' : 'Compare:'}
            </span>
            {levels.map((level, index) => (
              <button
                key={index}
                onClick={() => setCompareLevel(compareLevel === index ? null : index)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all kalpurush-font ${
                  compareLevel === index
                    ? 'bg-[#00AEEF] text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {level.level}
              </button>
            ))}
          </div>

          {/* Comparison Tables */}
          <div className="space-y-8">
            {/* Madrasa Subjects */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookText className="w-5 h-5 text-[#00AEEF]" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white kalpurush-font">
                  {language === 'bn' ? 'মাদরাসা বিষয়' : 'Madrasa Subjects'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                        {language === 'bn' ? 'বিষয়' : 'Subject'}
                      </th>
                      {levels.map((level, index) => (
                        <th
                          key={index}
                          className={`px-4 py-3 text-center text-sm font-semibold border border-gray-200 dark:border-gray-700 ${
                            compareLevel === index ? 'bg-[#00AEEF]/10' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-gray-900 dark:text-white">{level.level}</span>
                            <span className="text-xs text-gray-500">{level.age}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSubjects.madrasa.map((subject: string, idx: number) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                          {subject}
                        </td>
                        {levels.map((level, index) => (
                          <td
                            key={index}
                            className={`px-4 py-3 text-center border border-gray-200 dark:border-gray-700 ${
                              compareLevel === index ? 'bg-[#00AEEF]/5' : ''
                            }`}
                          >
                            {hasSubject(level, subject, 'madrasa') ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* General Subjects */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white kalpurush-font">
                  {language === 'bn' ? 'সাধারণ বিষয়' : 'General Subjects'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                        {language === 'bn' ? 'বিষয়' : 'Subject'}
                      </th>
                      {levels.map((level, index) => (
                        <th
                          key={index}
                          className={`px-4 py-3 text-center text-sm font-semibold border border-gray-200 dark:border-gray-700 ${
                            compareLevel === index ? 'bg-green-100 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-gray-900 dark:text-white">{level.level}</span>
                            <span className="text-xs text-gray-500">{level.age}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSubjects.general.map((subject: string, idx: number) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                          {subject}
                        </td>
                        {levels.map((level, index) => (
                          <td
                            key={index}
                            className={`px-4 py-3 text-center border border-gray-200 dark:border-gray-700 ${
                              compareLevel === index ? 'bg-green-100/50 dark:bg-green-900/10' : ''
                            }`}
                          >
                            {hasSubject(level, subject, 'general') ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Technical Subjects */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white kalpurush-font">
                  {language === 'bn' ? 'কারিগরি বিষয়' : 'Technical Subjects'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                        {language === 'bn' ? 'বিষয়' : 'Subject'}
                      </th>
                      {levels.map((level, index) => (
                        <th
                          key={index}
                          className={`px-4 py-3 text-center text-sm font-semibold border border-gray-200 dark:border-gray-700 ${
                            compareLevel === index ? 'bg-purple-100 dark:bg-purple-900/20' : ''
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-gray-900 dark:text-white">{level.level}</span>
                            <span className="text-xs text-gray-500">{level.age}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allSubjects.technical.map((subject: string, idx: number) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 kalpurush-font border border-gray-200 dark:border-gray-700">
                          {subject}
                        </td>
                        {levels.map((level, index) => (
                          <td
                            key={index}
                            className={`px-4 py-3 text-center border border-gray-200 dark:border-gray-700 ${
                              compareLevel === index ? 'bg-purple-100/50 dark:bg-purple-900/10' : ''
                            }`}
                          >
                            {hasSubject(level, subject, 'technical') ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white rounded-xl font-semibold kalpurush-font transition-colors"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}