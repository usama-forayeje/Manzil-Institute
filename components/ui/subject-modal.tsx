'use client';

import React from 'react';
import { X, BookOpen, Target, Award, ChevronRight } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';
import { SubjectModalProps } from '@/types/components';

export default function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const { language } = useLanguageStore();

  if (!subject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal Content */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in"
        onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
          aria-label={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00AEEF] to-purple-600 p-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white kalpurush-font">
                {subject.name}
              </h2>
              {subject.arabicName && (
                <p className="text-white/80 text-lg">
                  {subject.arabicName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
              <BookOpen className="w-5 h-5 text-[#00AEEF]" />
              {language === 'bn' ? 'বিবরণ' : 'Description'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 kalpurush-font leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Learning Objectives */}
          {subject.objectives && subject.objectives.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                <Target className="w-5 h-5 text-green-500" />
                {language === 'bn' ? 'শেখার উদ্দেশ্য' : 'Learning Objectives'}
              </h3>
              <ul className="space-y-2">
                {subject.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400 kalpurush-font">
                      {objective}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outcomes */}
          {subject.outcomes && subject.outcomes.length > 0 && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                <Award className="w-5 h-5 text-purple-500" />
                {language === 'bn' ? 'ফলাফল' : 'Outcomes'}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {subject.outcomes.map((outcome: string, index: number) => (
                  <div
                    key={index}
                    className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3"
                  >
                    <span className="text-sm text-purple-700 dark:text-purple-300 kalpurush-font">
                      {outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Level Info */}
          {subject.levelInfo && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 kalpurush-font">
                <strong>{language === 'bn' ? 'লেভেল:' : 'Level:'}</strong> {subject.levelInfo}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
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