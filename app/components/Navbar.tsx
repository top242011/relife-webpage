"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
    const t = useTranslations('Navbar');
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-white py-5"
        }`;

    const textClasses = "text-slate-900";

    const navLinks = [
        { label: t('home'), href: '/' },
        { label: t('policies'), href: '/policy' },
        { label: t('progress'), href: '/progress' },
        {
            label: t('candidates'),
            href: '/candidates',
            subLinks: [
                { label: t('campuses.rangsit'), href: '/candidates?campus=Rangsit' },
                { label: t('campuses.lampang'), href: '/candidates?campus=Lampang' },
                { label: t('campuses.thaprachan'), href: '/candidates?campus=Tha Prachan' },
            ]
        },
    ];

    return (
        <nav className={navbarClasses}>
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="font-bold text-2xl tracking-tight text-primary">
                    RELIFE
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div
                            key={link.href}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(link.label)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-primary ${textClasses} ${activeDropdown === link.label ? "text-primary" : ""
                                    }`}
                            >
                                <span className="flex items-center gap-1">
                                    {link.label}
                                    {link.subLinks && <ChevronDown size={14} />}
                                </span>
                            </Link>

                            {/* Dropdown */}
                            {link.subLinks && (
                                <AnimatePresence>
                                    {activeDropdown === link.label && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 py-2"
                                        >
                                            {link.subLinks.map((subLink) => (
                                                <Link
                                                    key={subLink.href}
                                                    href={subLink.href}
                                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-gray-50 hover:text-primary transition-colors"
                                                >
                                                    {subLink.label}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}

                    <LanguageSwitcher />

                    <a
                        href="https://docs.google.com/forms/d/e/1FAIpQLSfHUCqKNBki9Aoy2p385GfNSFHmitIjWF3g_lyqIp3qtGKQ_g/viewform"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-primary text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors"
                    >
                        {t('join')}
                    </a>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-slate-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <div key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="block text-lg font-medium text-slate-900 py-2"
                                        onClick={() => !link.subLinks && setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                    {link.subLinks && (
                                        <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-gray-100">
                                            {link.subLinks.map((subLink) => (
                                                <Link
                                                    key={subLink.href}
                                                    href={subLink.href}
                                                    className="text-slate-600 py-1"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                >
                                                    {subLink.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="py-2">
                                <LanguageSwitcher />
                            </div>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfHUCqKNBki9Aoy2p385GfNSFHmitIjWF3g_lyqIp3qtGKQ_g/viewform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-primary text-white w-full py-3 rounded-lg font-semibold mt-4 block text-center"
                            >
                                {t('join')}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
