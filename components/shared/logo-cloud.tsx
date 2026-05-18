import React from 'react';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { LazyImage } from '@/components/ui/lazy-image';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguageStore } from '@/store/language';
import { useTheme } from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';

export const LogoCloud = () => {
  const { language } = useLanguageStore();
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const logos = [
    {
      name: 'manzil-agro-logo',
      hasVariants: true,
      alt: 'Manzil Agro Logo',
      href: 'https://agropark.manzilgroupbd.com',
    },
    {
      name: 'manzil-housing-logo',
      hasVariants: true,
      alt: 'Manzil Housing Logo',
      href: 'https://housing.manzilgroupbd.com',
    },
    {
      name: 'manzil-institute-logo',
      hasVariants: true,
      alt: 'Manzil Institute Logo',
      href: 'https://institute.manzilgroupbd.com',
    },
    {
      name: 'manzil-shop-logo',
      hasVariants: true,
      alt: 'Manzil Shop Logo',
      href: 'https://shop.manzilgroupbd.com',
    },
    {
      name: 'manzil-sports-logo',
      hasVariants: false,
      alt: 'Manzil Sports Logo',
      href: 'https://sports.manzilgroupbd.com',
    },
    {
      name: 'manzil-trading-logo',
      hasVariants: true,
      alt: 'Manzil Trading Logo',
      href: 'https://trading.manzilgroupbd.com',
    },
    {
      name: 'manzil-blood-bank-logo',
      hasVariants: true,
      alt: 'Manzil Blood Bank Logo',
      href: 'https://bloodbank.manzilgroupbd.com',
    },
    {
      name: 'manzil-care-foundation-logo',
      hasVariants: true,
      alt: 'Manzil Care Foundation Logo',
      href: 'https://carefoundation.manzilgroupbd.com',
    },
    {
      name: 'manzil-dried-fruits-logo',
      hasVariants: true,
      alt: 'Manzil Dried Fruits Logo',
      href: 'https://driedfruits.manzilgroupbd.com',
    },
    {
      name: 'manzil-green-city-dhaka-logo',
      hasVariants: true,
      alt: 'Manzil Green City Dhaka Logo',
      href: 'https://greencitydhaka.manzilgroupbd.com',
    },
    {
      name: 'manzil-green-city-feni-logo',
      hasVariants: true,
      alt: 'Manzil Green City Feni Logo',
      href: 'https://greencityfeni.manzilgroupbd.com',
    },
    {
      name: 'manzil-hospital-logo',
      hasVariants: true,
      alt: 'Manzil Hospital Logo',
      href: 'https://hospital.manzilgroupbd.com',
    },
    {
      name: 'manzil-international-logo',
      hasVariants: true,
      alt: 'Manzil International Logo',
      href: 'https://international.manzilgroupbd.com',
    },
    {
      name: 'manzil-tv-logo',
      hasVariants: true,
      alt: 'Manzil TV Logo',
      href: 'https://tv.manzilgroupbd.com',
    },
    {
      name: 'mic-logo',
      hasVariants: true,
      alt: 'MIC Logo',
      href: 'https://institute.manzilgroupbd.com',
    },
    {
      name: 'msd-logo',
      hasVariants: true,
      alt: 'MSD Logo',
      href: 'https://institute.manzilgroupbd.com',
    },
    {
      name: 'success-logo',
      hasVariants: true,
      alt: 'Success Logo',
      href: 'https://successunitybuilders.com',
    },
  ];

  return (
    <div className=" py-24 border-t border-gray-200 dark:border-slate-700">
      <div className="group relative m-auto max-w-6xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="w-full md:inline md:max-w-44 md:border-r md:pr-6 mb-4 md:mb-0">
            <h5
              className={cn(
                'text-center md:text-right text-gray-900 dark:text-white',
                language === 'bn' ? 'bengali-text' : ''
              )}
            >
              {language === 'bn'
                ? 'মানযিল গ্রুপের কার্যক্রম'
                : 'Manzil Group Operations'}
            </h5>
          </div>
          <div className="relative py-8 w-full md:w-[calc(100%-11rem)]">
            {mounted ? (
              <InfiniteSlider speedOnHover={20} speed={40} gap={60}>
                {logos.map((logo, index) => (
                  <div key={index} className="flex">
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      <LazyImage
                        className="mx-auto h-12 w-auto"
                        src={`/manzil-logo/${logo.name}${logo.hasVariants ? `-${theme}.webp` : '.webp'}`}
                        alt={logo.alt}
                        width={120}
                        height={120}
                        quality={75}
                      />
                    </a>
                  </div>
                ))}
              </InfiniteSlider>
            ) : (
              <div className="flex justify-center items-center h-12">
                <Skeleton className="h-8 w-32" />
              </div>
            )}

            <div className="bg-gradient-to-r from-gray-50 via-gray-50 to-transparent dark:from-gray-900/50 dark:via-gray-900/60  dark:to-transparent absolute inset-y-0 left-0 w-12 md:w-20"></div>
            <div className="bg-gradient-to-l from-gray-50 via-gray-50 to-transparent dark:from-gray-900/50 dark:via-gray-900/60  dark:to-transparent absolute inset-y-0 right-0 w-12 md:w-20"></div>
            <ProgressiveBlur
              className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};