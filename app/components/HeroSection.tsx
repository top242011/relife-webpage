"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

interface HeroSectionProps {
    heroTitle: string;
    heroSubtitle: string;
    ctaLearnMore: string;
    ctaMeetTeam: string;
    heroMedia?: any;
    heroMediaAlt?: string;
    enableParallax?: boolean;
}

export default function HeroSection({
    heroTitle,
    heroSubtitle,
    ctaLearnMore,
    ctaMeetTeam,
    heroMedia,
    heroMediaAlt,
    enableParallax = true,
}: HeroSectionProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const hasMedia = !!heroMedia?.asset;

    return (
        <section
            ref={ref}
            className="relative h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 bg-slate-900">
                {hasMedia ? (
                    <motion.div
                        className="relative w-full h-full"
                        style={enableParallax ? { y, opacity } : {}}
                    >
                        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                        <Image
                            src={urlFor(heroMedia).url()}
                            alt={heroMediaAlt || "Hero Background"}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                ) : (
                    <div className="absolute inset-0 z-0 animate-gradient opacity-90" />
                )}

                {/* Abstract shapes layer (visible on top of gradient, behind text) */}
                {!hasMedia && (
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 translate-x-1/4 pointer-events-none" />
                )}
            </div>

            {/* Content Layer */}
            <div className="container relative z-10 px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-4 md:mb-6 tracking-tighter leading-[0.95] px-2 ${hasMedia ? 'text-white drop-shadow-lg' : 'text-white'}`}>
                        {heroTitle}
                    </h1>
                    <p className={`text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 max-w-2xl mx-auto font-medium px-4 ${hasMedia ? 'text-gray-100 drop-shadow-md' : 'text-blue-50'}`}>
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                        <Link
                            href="/policy"
                            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-white text-base sm:text-lg font-bold rounded-full hover:bg-white hover:text-primary transition-all hover:scale-105 shadow-lg shadow-black/20 flex items-center justify-center gap-2 ring-2 ring-transparent hover:ring-white/50"
                        >
                            {ctaLearnMore} <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="/candidates"
                            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full border-2 transition-all text-center ${hasMedia
                                ? 'bg-white/10 text-white border-white hover:bg-white hover:text-slate-900 backdrop-blur-sm'
                                : 'bg-white text-slate-900 border-white hover:border-primary hover:text-primary'
                                }`}
                        >
                            {ctaMeetTeam}
                        </Link>
                    </div>
                </motion.div>
            </div>


        </section>
    );
}
