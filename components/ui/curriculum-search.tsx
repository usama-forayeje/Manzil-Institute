'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, BookText, Users, Cpu, ChevronRight, LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';

interface YearData {
  year: string;
  title?: string;
  track?: string;
  subjects?: {
    madrasa?: string[];
    general?: string[];
    technical?: string[];
  };
}

interface SearchResult {
  type: 'year' | 'subject';
  title: string;
  year: string;
  category?: string;
  match: string;
  track?: string;
}

interface CurriculumSearchProps {
  years: YearData[];
}

export default function CurriculumSearch({ years }: CurriculumSearchProps) {
  const { language } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Search through all subjects and years
  const searchResults: SearchResult[] = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    years.forEach((year) => {
      // Check year title
      if (year.title?.toLowerCase().includes(query)) {
        results.push({
          type: 'year',
          title: year.title,
          year: year.year,
          match: year.title,
          track: year.track
        });
      }

      // Check subjects in each category
      const categories: (keyof YearData['subjects'])[] = ['madrasa', 'general', 'technical'];
      categories.forEach((category) => {
        year.subjects?.[category]?.forEach((subject) => {
          if (subject.toLowerCase().includes(query)) {
            results.push({
              type: 'subject',
              title: subject,
              year: year.year,
              category,
              match: subject
            });
          }
        });
      });
    });

    return results.slice(0, 10); // Limit results
  }, [searchQuery, years]);

  const getCategoryIcon = (category: string): LucideIcon => {
    switch (category) {
      case 'madrasa': return BookText;
      case 'general': return Users;
      case 'technical': return Cpu;
      default: return BookText;
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'madrasa': return 'text-[#00AEEF] bg-[#00AEEF]/10';
      case 'general': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'technical': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="relative">
      {/* Search Input */}
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : ''}`}>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={language === 'bn' ? 'বিষয় বা বছর খুঁজুন...' : 'Search subjects or years...'}
          className="w-full pl-12 pr-10 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 kalpurush-font focus:outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isFocused && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {language === 'bn' ? 'ফলাফল' : 'Results'} ({searchResults.length})
              </div>
              {searchResults.map((result: SearchResult, index: number) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors text-left"
                  onClick={() => {
                    const element = document.getElementById(`year-${result.year}`);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      element.classList.add('ring-2', 'ring-[#00AEEF]');
                      setTimeout(() => element.classList.remove('ring-2', 'ring-[#00AEEF]'), 2000);
                    }
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                >
                  {result.type === 'year' ? (
                    <div className="w-10 h-10 bg-[#00AEEF]/10 rounded-xl flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-[#00AEEF]" />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 ${getCategoryColor(result.category!)} rounded-xl flex items-center justify-center`}>
                      {React.createElement(getCategoryIcon(result.category!), {
                        className: 'w-5 h-5'
                      })}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white kalpurush-font truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 kalpurush-font">
                      {result.year}
                      {result.type === 'subject' && (
                        <span className="ml-2">
                          • {language === 'bn'
                            ? (result.category === 'madrasa' ? 'মাদরাসা' : result.category === 'general' ? 'সাধারণ' : 'কারিগরি')
                            : result.category!.charAt(0).toUpperCase() + result.category!.slice(1)}
                        </span>
                      )}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 kalpurush-font">
                {language === 'bn'
                  ? 'কোনো ফলাফল পাওয়া যায়নি'
                  : 'No results found'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Popular Searches */}
      {!isFocused && !searchQuery && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-xs text-gray-500 dark:text-gray-400 kalpurush-font self-center">
            {language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
          </span>
          {['হিফজ', 'কোরআন', 'AI', 'ডিজাইন', 'কোডিং'].map((term: string) => (
            <button
              key={term}
              onClick={() => setSearchQuery(term)}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-[#00AEEF]/10 hover:text-[#00AEEF] transition-colors kalpurush-font"
            >
              {term}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}