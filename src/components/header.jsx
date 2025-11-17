import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useLanguageStore } from "@/lib/store";
import { ModeToggle } from "./themes/theme-toggle";
import { cn } from "@/lib/utils";
import { useTheme } from '@/components/themes/theme-provider';

const menuItems = [
  {
    key: "home",
    href: "#hero",
    label: {
      en: "Home",
      bn: "হোম",
    },
  },
  {
    key: "about",
    href: "#about",
    label: {
      en: "About",
      bn: "আমাদের সম্পর্কে",
    },
  },
  {
    key: "curriculum",
    href: "#mic-curriculum",
    label: {
      en: "Curriculum",
      bn: "কারিকুলাম",
    },
  },
  {
    key: "admission",
    href: "/admission",
    label: {
      en: "Admission",
      bn: "ভর্তি",
    },
  },
  {
    key: "contact",
    href: "#contact",
    label: {
      en: "Contact",
      bn: "যোগাযোগ",
    },
  },
];

export const HeroHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { language, setLanguage } = useLanguageStore();
  const location = useLocation();
  const menuRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const { theme } = useTheme();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bahire click korle menu close howar function
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside menu AND outside menu button
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLanguage = () => setLanguage(language === "en" ? "bn" : "en");

  return (
    <header className="fixed z-50 w-full">
      <nav className="px-4">
        <div
          className={cn(
            "mx-auto transition-all duration-300 mt-2",
            isScrolled
              ? "max-w-5xl bg-background/50 rounded-2xl border backdrop-blur-lg"
              : "max-w-6xl"
          )}
        >
          {/* Navbar Container */}
          <div className="flex items-center justify-between py-3 px-6">
            {/* Logo - Left */}
            <div className="flex justify-start flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img
                  src={theme === 'dark' ? '/manzil-logo/manzil-institute-logo-dark.webp' : '/manzil-logo/manzil-institute-logo-light.webp'}
                  alt="Manzil Institute Logo"
                  width="170"
                  height="40"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Desktop Navigation - Center (Only on 1024px+) */}
            <div className="hidden lg:flex justify-center flex-grow">
              <div className="flex items-center space-x-8">
                {menuItems.map((item) => {
                  const href =
                    item.href.startsWith("#") && location.pathname !== "/"
                      ? `/${item.href}`
                      : item.href;
                  return (
                    <Link
                      key={item.key}
                      to={href}
                      className={cn(
                        "text-gray-700 dark:text-gray-300 hover:text-[#00AEEF] text-sm font-medium transition-colors duration-150 whitespace-nowrap",
                        language === "bn" && "bengali-text"
                      )}
                    >
                      {item.label[language]}
                    </Link>
                  );
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
                <span
                  className={cn(
                    "text-xs font-semibold whitespace-nowrap",
                    language === "bn" && "bengali-text"
                  )}
                >
                  {language === "en" ? "বাংলা" : "English"}
                </span>
              </Button>
              <Button
                asChild
                variant={isScrolled ? "default" : "outline"}
                size="sm"
                className={cn(
                  "text-xs font-semibold whitespace-nowrap h-9",
                  isScrolled ? "bg-[#00AEEF] text-white hover:bg-[#00AEEF]/90" : ""
                )}
              >
                <Link to="/apply">
                  {isScrolled
                    ? language === "en"
                      ? "Apply Now"
                      : "এপ্লাই করুন"
                    : language === "en"
                    ? "Login"
                    : "লগইন"}
                </Link>
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
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      language === "bn" && "bengali-text"
                    )}
                  >
                    {language === "en" ? "বাংলা" : "EN"}
                  </span>
                </Button>
                <Button
                  ref={buttonRef}
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  className="p-2 bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="size-6" />
                  ) : (
                    <Menu className="size-6" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu with Animation */}
          <div
            ref={menuRef}
            className={cn(
              "lg:hidden  bg-background/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 pt-1  px-6 rounded-b-2xl transition-all duration-300 ease-in-out overflow-hidden",
              isMenuOpen
                ? "max-h-96 opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
            )}
          >
            <div className="space-y-2">
              {menuItems.map((item) => {
                const href =
                  item.href.startsWith("#") && location.pathname !== "/"
                    ? `/${item.href}`
                    : item.href;
                return (
                  <Link
                    key={item.key}
                    to={href}
                    className={cn(
                      "block py-3 px-4 text-gray-700 dark:text-gray-300 text-center hover:bg-[#00AEEF]/10 dark:hover:bg-[#00AEEF]/5 hover:text-[#00AEEF] rounded-lg transition-colors duration-150 font-medium",
                      language === "bn" && "bengali-text"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label[language]}
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col space-y-3 mb-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                asChild
                variant={isScrolled ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-full text-sm font-semibold",
                  isScrolled ? "bg-[#00AEEF] hover:bg-[#00AEEF]/90 text-white" : ""
                )}
              >
                <Link to="/apply">
                  {isScrolled
                    ? language === "en"
                      ? "Apply Now"
                      : "এপ্লাই করুন"
                    : language === "en"
                    ? "Login"
                    : "লগইন"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
