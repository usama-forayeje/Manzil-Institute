import { Link } from '@tanstack/react-router'
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react'
import { useLanguageStore } from '@/lib/store'
import { Code2Icon } from 'lucide-react'

const contactInfo = [
    {
        icon: Mail,
        title: {
            en: 'Email',
            bn: 'ইমেইল'
        },
        details: {
            en: 'info@manzilinstitute.edu.bd',
            bn: 'info@manzilinstitute.edu.bd'
        }
    },
    {
        icon: Phone,
        title: {
            en: 'Phone',
            bn: 'ফোন'
        },
        details: {
            en: '01407-046003, 01407-046008',
            bn: '০১৪০৭-০৪৬০০৩, ০১৪০৭-০৪৬০০৮'
        }
    },
    {
        icon: MapPin,
        title: {
            en: 'Address',
            bn: 'ঠিকানা'
        },
        details: {
            en: 'Harunur Rashid Tower (10th Floor Building), House #91, Road #2, Uttar Rayarbag Bus Stand, Jatrabari, Dhaka 1362',
            bn: 'হারুনুর রশীদ টাওয়ার (১০ তলা ভবন), বাড়ি #৯১, রোড #২, উত্তর রায়েরবাগ বাস স্ট্যান্ড, যাত্রাবাড়ী, ঢাকা ১৩৬২'
        }
    }
]

const socialLinks = [
    {
        icon: Phone,
        href: 'https://wa.me/8801822478883',
        label: 'WhatsApp'
    },
    {
        icon: Mail,
        href: 'mailto:info@manzilinstitute.edu.bd',
        label: 'Email'
    },
    {
        icon: Facebook,
        href: 'https://www.facebook.com/ManzilInstituteBD',
        label: 'Facebook'
    },
    {
        icon: Youtube,
        href: 'https://www.youtube.com/c/ManzilTV',
        label: 'YouTube'
    }
]

export default function FooterSection() {
    const { language } = useLanguageStore()

    const businessDivisions = [
        {
            title: {
                en: 'Manzil Group',
                bn: 'মানজিল গ্রুপ'
            },
            href: 'https://manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil E-commerce',
                bn: 'মানজিল ই-কমার্স'
            },
            href: 'https://ecommerce.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil Shop',
                bn: 'মানজিল শপ'
            },
            href: 'https://shop.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil Housing',
                bn: 'মানজিল হাউজিং'
            },
            href: 'https://housing.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil Professions',
                bn: 'মানজিল প্রফেশন্স'
            },
            href: 'https://professions.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil Institute',
                bn: 'মানজিল ইনস্টিটিউট'
            },
            href: 'https://institute.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil City',
                bn: 'মানজিল সিটি'
            },
            href: 'https://city.manzilgroupbd.com',
        },
        {
            title: {
                en: 'Manzil Hospital',
                bn: 'মানজিল হাসপাতাল'
            },
            href: 'https://hospital.manzilgroupbd.com',
        },
    ]

    const companyLinks = [
        {
            title: {
                en: 'About Us',
                bn: 'আমাদের সম্পর্কে'
            },
            href: '#about',
        },
        {
            title: {
                en: 'Curriculum',
                bn: 'কারিকুলাম'
            },
            href: '/curriculum',
        },
        {
            title: {
                en: 'Admission',
                bn: 'ভর্তি'
            },
            href: '/admission',
        },
        {
            title: {
                en: 'Contact',
                bn: 'যোগাযোগ'
            },
            href: '#contact',
        },
    ]

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-gray-700" dir="ltr">
            <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-12">
                    {/* Left Column - Logo, Description, Contact, Social */}
                    <div className="text-center md:text-left">
                        <div className="mb-6">
                            <Link
                                to="/"
                                aria-label="go home"
                                className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                                <img
                                    src="/manzil institutte logo.jpg"
                                    alt="Manzil International Institute Logo"
                                    className="h-8 w-auto object-contain"
                                />
                                <span className="text-lg font-semibold text-foreground">
                                    {language === 'bn' ? 'মানজিল ইনস্টিটিউট' : 'Manzil Institute'}
                                </span>
                            </Link>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed kalpurush-font">
                                {language === 'bn'
                                    ? 'মাদ্রাসা, জেনারেল ও কারিগরি শিক্ষার অনন্য সংমিশ্রণে গড়ে উঠছে এক আদর্শ প্রজন্ম।'
                                    : 'An ideal generation is being built through the unique combination of Madrasa, General and Technical education.'
                                }
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 kalpurush-font bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
                            </h3>
                            <div className="space-y-3">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className={`flex items-center gap-3 ${info.icon === MapPin ? 'justify-start' : 'justify-center md:justify-start'}`}>
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <info.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed kalpurush-font">
                                                {language === 'bn' ? info.details.bn : info.details.en}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4 kalpurush-font bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                                {language === 'bn' ? 'আমাদের সাথে যুক্ত থাকুন' : 'Connect With Us'}
                            </h3>
                            <div className="flex justify-center md:justify-start gap-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="w-10 h-10 bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-600 hover:from-blue-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                                        <social.icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Business Divisions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 kalpurush-font bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            {language === 'bn' ? 'ব্যবসায়িক বিভাগসমূহ' : 'Business Divisions'}
                        </h3>
                        <ul className="space-y-2">
                            {businessDivisions.map((division, index) => (
                                <li key={index}>
                                    <a
                                        href={division.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm kalpurush-font block py-1">
                                        {language === 'bn' ? division.title.bn : division.title.en}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Column - Company Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 kalpurush-font bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                            {language === 'bn' ? 'কোম্পানি' : 'Company'}
                        </h3>
                        <ul className="space-y-2">
                            {companyLinks.map((link, index) => (
                                <li key={index}>
                                    {link.href.startsWith('#') ? (
                                        <a
                                            href={link.href}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm kalpurush-font block py-1">
                                            {language === 'bn' ? link.title.bn : link.title.en}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm kalpurush-font block py-1">
                                            {language === 'bn' ? link.title.bn : link.title.en}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm kalpurush-font">
                            © {new Date().getFullYear()} {language === 'bn' ? 'মানজিল ইনস্টিটিউট। সর্বস্বত্ব সংরক্ষিত।' : 'Manzil Institute. All rights reserved.'}
                        </p>
                        <div className="flex items-center gap-6">
                            <a href="#investment" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">
                                {language === 'bn' ? 'ইনভেস্টমেন্ট নীতি' : 'Investment Policy'}
                            </a>
                            <a href="#terms" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">
                                {language === 'bn' ? 'শর্তাবলী' : 'Terms'}
                            </a>
                            <a href="#privacy" className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200">
                                {language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
                            </a>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            {language === 'bn' ? 'ডেভেলপ করেছেন' : 'Developed by'}{' '}
                            <Code2Icon className="inline-block w-4 h-4 mb-0.5 mr-1 text-gray-600 dark:text-gray-300" />
                            <a
                                href="https://www.linkedin.com/in/usama-forayaje"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                {language === 'bn' ? 'উসামা ফরায়েজী' : 'Usama Forayaje'}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
