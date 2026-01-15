"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Heart, Leaf, Shield, Users } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Policy } from "@/app/lib/cms-data";

interface PolicyMarqueeProps {
    policies: Policy[];
    direction?: "left" | "right";
    speed?: number;
}

const iconMap: Record<string, any> = {
    "graduation-cap": GraduationCap,
    "leaf": Leaf,
    "shield": Shield,
    "heart": Heart,
    "briefcase": Briefcase,
    "users": Users,
    "book-open": BookOpen,
};

export default function PolicyMarquee({ policies, direction = "left", speed = 40 }: PolicyMarqueeProps) {
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const MarqueeCard = ({ policy }: { policy: Policy }) => {
        const Icon = policy.iconName ? (iconMap[policy.iconName] || BookOpen) : BookOpen;
        const hasImage = policy.heroImage;

        return (
            <Link href={`/policy/${policy.slug || policy._id || policy.id}`} className="block relative w-[280px] h-[340px] md:w-[320px] md:h-[380px] rounded-2xl overflow-hidden group">
                {/* Background Image */}
                {hasImage ? (
                    <img
                        src={urlFor(policy.heroImage).width(400).height(400).url()}
                        alt={policy.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                        <Icon size={80} className="text-white/10" />
                    </div>
                )}

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    {/* Top Section: Badges */}
                    <div className="flex justify-between items-start">
                        {/* Icon Badge */}
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg">
                            <Icon size={20} />
                        </div>

                        {/* Location Badge (if exists) - Changed from orange to blue/white style */}
                        {(policy.policyType === 'central' || policy.policyType === 'center' || policy.campus) && (
                            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700 shadow-md border border-blue-100/50 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                {policy.policyType === 'central' || policy.policyType === 'center'
                                    ? "ส่วนกลาง"
                                    : (policy.campus === "Rangsit" ? "รังสิต"
                                        : policy.campus === "Lampang" ? "ลำปาง"
                                            : policy.campus === "Tha Prachan" ? "ท่าพระจันทร์"
                                                : policy.campus)}
                            </div>
                        )}
                    </div>

                    {/* Bottom Section: Title and Category */}
                    <div>
                        <span className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] text-white/90 mb-2.5 border border-white/10 font-medium">
                            {policy.category}
                        </span>
                        <h3 className="text-white text-lg md:text-xl font-bold leading-snug drop-shadow-md group-hover:text-amber-300 transition-colors duration-300">
                            {policy.title}
                        </h3>
                    </div>
                </div>
            </Link>
        );
    };

    // Duplicate policies enough times to ensure continuous scroll
    const duplicatedPolicies = [...policies, ...policies, ...policies, ...policies];

    return (
        <section className="bg-gradient-to-b from-[#0a1628] via-[#0B1527] to-[#0a1628] py-12 md:py-16">
            {/* Header Section */}
            <div className="container mx-auto px-4 mb-8 md:mb-10">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        นโยบายของเรา
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        สำรวจนโยบายที่เราต้องการพัฒนาเพื่อมหาวิทยาลัยของเรา
                    </p>
                </div>
            </div>

            {/* Marquee Section */}
            <div
                ref={containerRef}
                className="relative overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div
                    className={`flex gap-5 ${isHovered ? '[animation-play-state:paused]' : ''}`}
                    style={{
                        animation: `marquee-scroll ${speed}s linear infinite`,
                        width: 'max-content',
                    }}
                >
                    {duplicatedPolicies.map((policy, index) => (
                        <div key={`${policy._id || policy.id}-${index}`} className="flex-shrink-0">
                            <MarqueeCard policy={policy} />
                        </div>
                    ))}
                </div>

                {/* Gradients to fade edges */}
                <div className="absolute top-0 left-0 h-full w-24 md:w-40 bg-gradient-to-r from-[#0a1628] to-transparent pointer-events-none z-10" />
                <div className="absolute top-0 right-0 h-full w-24 md:w-40 bg-gradient-to-l from-[#0a1628] to-transparent pointer-events-none z-10" />
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-10 md:mt-12">
                <div className="text-center">
                    <Link
                        href="/policy"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-105"
                    >
                        ดูนโยบายทั้งหมด
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
