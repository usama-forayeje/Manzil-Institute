import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { LazyImage } from '@/components/ui/lazy-image'
import { cn } from '../lib/utils'
import { useLanguageStore } from '../lib/store'
import { useTheme } from '@/components/themes/theme-provider'

export const LogoCloud = () => {
    const { language } = useLanguageStore()
    const { theme } = useTheme()

    const logos = [
        { name: 'manzil-agro-logo', hasVariants: true, alt: 'Manzil Agro Logo', href: 'https://agropark.manzilgroupbd.com' },
        { name: 'manzil-city-logo', hasVariants: false, alt: 'Manzil City Logo', href: 'https://city.manzilgroupbd.com' },
        { name: 'manzil-foundation-logo', hasVariants: false, alt: 'Manzil Foundation Logo', href: 'https://foundation.manzilgroupbd.com' },
        { name: 'manzil-gorup-logo', hasVariants: true, alt: 'Manzil Group Logo', href: 'https://manzilgroupbd.com' },
        { name: 'manzil-housing-logo', hasVariants: true, alt: 'Manzil Housing Logo', href: 'https://housing.manzilgroupbd.com' },
        { name: 'manzil-institute-logo', hasVariants: true, alt: 'Manzil Institute Logo', href: 'https://institute.manzilgroupbd.com' },
        { name: 'manzil-properti-logo', hasVariants: true, alt: 'Manzil Properties Logo', href: 'https://properties.manzilgroupbd.com' },
        { name: 'manzil-shop-logo', hasVariants: true, alt: 'Manzil Shop Logo', href: 'https://shop.manzilgroupbd.com' },
        { name: 'manzil-sports-logo', hasVariants: false, alt: 'Manzil Sports Logo', href: 'https://sports.manzilgroupbd.com' },
        { name: 'manzil-trading-logo', hasVariants: true, alt: 'Manzil Trading Logo', href: 'https://trading.manzilgroupbd.com' },
        { name: 'mic-logo', hasVariants: true, alt: 'MIC Logo', href: 'https://institute.manzilgroupbd.com' },
        { name: 'msd-logo', hasVariants: true, alt: 'MSD Logo', href: 'https://institute.manzilgroupbd.com' },
        { name: 'progoti-logo', hasVariants: true, alt: 'Progoti Logo', href: 'https://progoti.manzilgroupbd.com' },
        { name: 'success-logo', hasVariants: true, alt: 'Success Logo', href: 'https://success.manzilgroupbd.com' },
    ]

    return (
        <section className=" py-24 ">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="w-full md:inline md:max-w-44 md:border-r md:pr-6 mb-4 md:mb-0">
                        <h5 className={cn("text-center md:text-right text-gray-900 dark:text-white", language === 'bn' ? "bengali-text" : "")}>
                            {language === 'bn' ? 'মানযিল গ্রুপের কার্যক্রম' : 'Manzil Group Operations'}
                        </h5>
                    </div>
                    <div className="relative py-8 w-full md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                            speedOnHover={20}
                            speed={40}
                            gap={60}>
                            {logos.map((logo, index) => (
                                <div key={index} className="flex">
                                    <a href={logo.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                        <LazyImage
                                            className="mx-auto h-12 w-fit"
                                            src={`/manzil-logo/${logo.name}${logo.hasVariants ? `-${theme}.webp` : '.webp'}`}
                                            alt={logo.alt}
                                            objectFit="none"
                                        />
                                    </a>
                                </div>
                            ))}
                        </InfiniteSlider>

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
        </section>
    )
}
