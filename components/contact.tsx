'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { AnimatedGroup } from './ui/animated-group';
import { useLanguageStore } from '@/lib/store';
import { cn } from '@/lib/utils';

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

export default function Contact() {
  const { language } = useLanguageStore();

  const contactInfo = [
    {
      icon: MapPin,
      title: language === 'bn' ? 'আমাদের ঠিকানা' : 'Our Address',
      details:
        language === 'bn'
          ? 'হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২'
          : 'Harunur Rashid Tower (10th Floor Building), House #91, Road #2, North Rayerbag Bus Stand, Jatrabari, Dhaka 1362',
    },
    {
      icon: Phone,
      title: language === 'bn' ? 'ফোন নম্বর' : 'Phone Number',
      details:
        language === 'bn'
          ? '০১৪০৭-০৪৬০০৩, ০১৪০৭-০৪৬০০৮, ০১৪০৭-০৪৬০০১, মানযিল গ্রুপ: ০১৪০৭-০৪৬০০০'
          : '01407-046003, 01407-046008, 01407-046001, Manzil Group: 01407-046000',
    },
    {
      icon: Mail,
      title: language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address',
      details: 'manzilinstitute24@gmail.com',
    },
  ];

  return (
    <section
      id="contact"
      dir="ltr"
      className="py-12 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-6xl px-4 mx-auto">
        <AnimatedGroup
          variants={{
            container: {
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
            },
            ...transitionVariants,
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Map */}
            <div className="p-4 overflow-hidden bg-white border-2 border-gray-300 rounded-lg shadow-xl dark:border-gray-600 dark:bg-gray-800">
              <div className="relative h-40 md:h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.3078306005827!2d90.45665079999999!3d23.700698799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b7258e642213%3A0x93f208507e674b1c!2zTWFuemlsIEluc3RpdHV0ZSB8IOCmruCmvuCmqOCmr-Cmv-CmsiDgpofgpqjgprjgp43gpp_gpr_gpp_gpr_gpongpp8gKOCmleCnjeCmr-CmvuCmruCnjeCmquCmvuCmuCDgppPgp5_gpr7gpqgp!5e0!3m2!1sen!2sbd!4v1763021707262!5m2!1sen!2sbd"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Manzil Institute Location"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 transition-colors duration-200 rounded-md bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <info.icon className="w-6 h-6 text-[#00AEEF] dark:text-[#00AEEF]/80 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3
                      className={cn(
                        'font-semibold text-gray-900 dark:text-white text-sm mb-2 kalpurush-font',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {info.title}
                    </h3>
                    <p
                      className={cn(
                        'text-gray-600 dark:text-gray-300 text-xs kalpurush-font leading-relaxed',
                        language === 'bn' ? 'bengali-text' : ''
                      )}
                    >
                      {info.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedGroup>
      </div>
    </section>
  );
}