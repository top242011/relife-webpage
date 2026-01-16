"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Policy } from "@/app/lib/cms-data";
import { urlFor } from "@/sanity/lib/image";
import { ArrowRight, BookOpen, Users, Leaf, Briefcase, GraduationCap, Heart, Shield, ImageIcon } from "lucide-react";

interface PolicyCardProps {
    policy: Policy | any;
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

export default function PolicyCard({ policy }: PolicyCardProps) {
    const Icon = policy.iconName ? (iconMap[policy.iconName] || BookOpen) : BookOpen;
    const hasImage = policy.heroImageWide;

    return (
        <Link href={`/policy/${policy.slug || policy._id || policy.id}`} className="block">
            <motion.div
                className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20"
                initial="rest"
                whileHover="hover"
                animate="rest"
            >
                {/* Policy Image */}
                <div className="relative h-40 bg-gradient-to-br from-primary/80 to-primary overflow-hidden">
                    {hasImage ? (
                        <img
                            src={urlFor(policy.heroImageWide).width(640).height(360).url()}
                            alt={policy.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-white/30">
                                <Icon size={64} strokeWidth={1} />
                            </div>
                        </div>
                    )}
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                        {policy.category}
                    </div>

                    {/* Location Badge */}
                    {(policy.policyType === 'central' || policy.policyType === 'center' || policy.campus) && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-600 border border-slate-100 shadow-sm flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            {policy.policyType === 'central' || policy.policyType === 'center'
                                ? "ส่วนกลาง"
                                : (policy.campus === "Rangsit" ? "รังสิต"
                                    : policy.campus === "Lampang" ? "ลำปาง"
                                        : policy.campus === "Tha Prachan" ? "ท่าพระจันทร์"
                                            : policy.campus)}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 pb-8">
                    <div className="flex justify-between items-start mb-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Icon size={20} />
                        </div>
                        <motion.div
                            variants={{
                                rest: { x: -10, opacity: 0 },
                                hover: { x: 0, opacity: 1 },
                            }}
                            className="text-primary"
                        >
                            <ArrowRight size={20} />
                        </motion.div>
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors line-clamp-2 overflow-hidden">
                        {policy.title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 overflow-hidden">
                        {policy.summary}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
