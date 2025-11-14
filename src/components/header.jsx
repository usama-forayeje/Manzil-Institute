import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { useLanguageStore } from '@/lib/store'
import { ModeToggle } from './themes/theme-toggle'
import { cn } from '@/lib/utils'

const menuItems = [
    {
        key: 'home',
        href: '#hero',
        label: {
            en: 'Home',
            bn: 'হোম'
        }
    },
    {
        key: 'about',
        href: '#about',
        label: {
            en: 'About',
            bn: 'আমাদের সম্পর্কে'
        }
    },
    {
        key: 'curriculum',
        href: '#mic-curriculum',
        label: {
            en: 'Curriculum',
            bn: 'কারিকুলাম'
        }
    },
    {
        key: 'admission',
        href: '/admission',
        label: {
            en: 'Admission',
            bn: 'ভর্তি'
        }
    },
    {
        key: 'contact',
        href: '#contact',
        label: {
            en: 'Contact',
            bn: 'যোগাযোগ'
        }
    },
]

export const HeroHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { language, setLanguage } = useLanguageStore()
    const location = useLocation()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
    const toggleLanguage = () => setLanguage(language === 'en' ? 'bn' : 'en')

    return (
        <header className="fixed z-50 w-full">
            <nav className="px-4">
                <div className={cn(
                    "mx-auto transition-all duration-300 mt-2",
                    isScrolled
                        ? 'max-w-5xl bg-background/50 rounded-2xl border backdrop-blur-lg'
                        : 'max-w-6xl'
                )}>
                    {/* Navbar Container */}
                    <div className="flex items-center justify-between py-3 px-6">

                        {/* Logo - Left */}
                        <div className="flex justify-start flex-shrink-0">
                            <Link to="/" className="flex items-center space-x-2">
                                <img
                                    src="/manzil institutte logo.jpg"
                                    alt="Manzil International Institute Logo"
                                    className="h-10 w-auto object-contain"
                                />
                                <span className={cn(
                                    "font-bold text-blue-600 dark:text-blue-400 text-sm",
                                    language === 'bn' && "bengali-text"
                                )}>
                                    {language === 'bn' ? 'মানজিল ইনস্টিটিউট' : 'Manzil Institute'}
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation - Center (Only on 1024px+) */}
                        <div className="hidden lg:flex justify-center flex-grow">
                            <div className="flex items-center space-x-8">
                                {menuItems.map((item) => {
                                    const href = item.href.startsWith('#') && location.pathname !== '/' ? `/${item.href}` : item.href
                                    return (
                                        <Link
                                            key={item.key}
                                            to={href}
                                            className={cn(
                                                "text-gray-700 dark:text-gray-300 hover:text-blue-600 text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                                                language === 'bn' && "bengali-text"
                                            )}
                                        >
                                            {item.label[language]}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Desktop Action Buttons - Right (Only on 1024px+) */}
                        <div className="hidden lg:flex justify-end items-center space-x-3 flex-shrink-0">
                            <ModeToggle />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={toggleLanguage}
                                className="px-3 py-2 h-9"
                            >
                                <span className={cn(
                                    "text-xs font-semibold whitespace-nowrap",
                                    language === 'bn' && "bengali-text"
                                )}>
                                    {language === 'en' ? "বাংলা" : "English"}
                                </span>
                            </Button>
                            <Button
                                asChild
                                variant={isScrolled ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "text-xs font-semibold whitespace-nowrap h-9",
                                    isScrolled ? "bg-blue-600 hover:bg-blue-700" : ""
                                )}
                            >
                                <a href="#">
                                    {isScrolled
                                        ? (language === 'en' ? "Register" : "রেজিস্টার")
                                        : (language === 'en' ? "Login" : "লগইন")
                                    }
                                </a>
                            </Button>
                        </div>

                        {/* Mobile Buttons (Only on screens below 1024px) */}
                        <div className=" lg:hidden jastify-between items-center space-x-2  flex-shrink-0">
                            <div className="flex items-center space-x-1">
                                <ModeToggle />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={toggleLanguage}
                                    className="px-2 py-1 h-8"
                                >
                                    <span className={cn(
                                        "text-xs font-semibold",
                                        language === 'bn' && "bengali-text"
                                    )}>
                                        {language === 'en' ? "বাংলা" : "EN"}
                                    </span>
                                </Button>
                                <Button
                                    onClick={toggleMenu}
                                    className="p-2 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                                </Button>
                            </div>

                        </div>
                    </div>

                    {/* Mobile Menu (Only on screens below 1024px) */}
                    {isMenuOpen && (
                        <div className="lg:hidden md:hidden bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pt-4 pb-6 px-6 rounded-b-2xl">
                            <div className="space-y-2">
                                {menuItems.map((item) => {
                                    const href = item.href.startsWith('#') && location.pathname !== '/' ? `/${item.href}` : item.href
                                    return (
                                        <Link
                                            key={item.key}
                                            to={href}
                                            className={cn(
                                                "block py-3 px-4 text-gray-700 dark:text-gray-300 text-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 rounded-lg transition-colors duration-150 font-medium",
                                                language === 'bn' && "bengali-text"
                                            )}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.label[language]}
                                        </Link>
                                    )
                                })}
                            </div>

                            <div className="flex flex-col space-y-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <Button
                                    asChild
                                    variant={isScrolled ? "default" : "outline"}
                                    size="sm"
                                    className={cn(
                                        "w-full text-sm font-semibold",
                                        isScrolled ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                                    )}
                                >
                                    <a href="#">
                                        {isScrolled
                                            ? (language === 'en' ? "Register" : "রেজিস্টার")
                                            : (language === 'en' ? "Login" : "লগইন")
                                        }
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}