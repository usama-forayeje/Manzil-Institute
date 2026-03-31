'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Calendar, X, ChevronUp, LucideIcon } from 'lucide-react';
import { useLanguageStore } from '@/lib/store';

interface Action {
  icon: LucideIcon;
  label: {
    bn: string;
    en: string;
  };
  href: string;
  color: string;
  bgColor: string;
  iconColor: string;
}

export default function QuickActionFAB() {
  const { language } = useLanguageStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const actions: Action[] = [
    {
      icon: Phone,
      label: { bn: 'কল করুন', en: 'Call Now' },
      href: 'tel:+8801XXX-XXXXXX',
      color: 'bg-green-500 hover:bg-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: MessageCircle,
      label: { bn: 'হোয়াটসঅ্যাপ', en: 'WhatsApp' },
      href: 'https://wa.me/8801XXX-XXXXXX',
      color: 'bg-[#25D366] hover:bg-[#20BD5A]',
      bgColor: 'bg-[#25D366]/10',
      iconColor: 'text-[#25D366]'
    },
    {
      icon: Mail,
      label: { bn: 'ইমেইল', en: 'Email' },
      href: 'mailto:info@manzilgroupbd.com',
      color: 'bg-blue-500 hover:bg-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Calendar,
      label: { bn: 'অ্যাপয়েন্টমেন্ট', en: 'Appointment' },
      href: '/apply',
      color: 'bg-purple-500 hover:bg-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Action Buttons */}
      <div
        className={`flex flex-col gap-3 mb-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {actions.map((action: Action, index: number) => (
          <a
            key={index}
            href={action.href}
            target={action.href.startsWith('http') ? '_blank' : '_self'}
            rel={action.href.startsWith('http') ? 'noopener noreferrer' : ''}
            className={`group flex items-center gap-3 ${action.bgColor} rounded-full pl-4 pr-2 py-2 transition-all duration-300 hover:scale-105`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 kalpurush-font whitespace-nowrap">
              {action.label[language as keyof typeof action.label]}
            </span>
            <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center shadow-lg`}>
              <action.icon className="w-5 h-5 text-white" />
            </div>
          </a>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-gradient-to-r from-[#00AEEF] to-purple-600 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? 'rotate-45' : ''
        }`}
        aria-label={isOpen ? (language === 'bn' ? 'বন্ধ করুন' : 'Close') : (language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us')}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <ChevronUp className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Tooltip */}
      {!isOpen && (
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
}