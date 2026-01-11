"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Policy } from "@/app/lib/cms-data";
import { ArrowRight, BookOpen, Users, Leaf, Briefcase, GraduationCap, Heart, Shield } from "lucide-react";

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

    return (
        <Link href={`/policy/${policy.slug || policy.id}`} className="block h-full">
            <motion.div
                className="group relative h-full bg-white border border-gray-100 rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20"
                initial="rest"
                whileHover="hover"
                animate="rest"
            >
                {/* Background transition */}
                <motion.div
                    className="absolute inset-0 bg-primary origin-bottom"
                    variants={{
                        rest: { scaleY: 0 },
                        hover: { scaleY: 1 },
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <motion.div
                            className="p-3 rounded-lg bg-gray-50 text-primary group-hover:bg-white/10 group-hover:text-white transition-colors"
                        >
                            <Icon size={24} />
                        </motion.div>
                        <motion.div
                            variants={{
                                rest: { x: -10, opacity: 0 },
                                hover: { x: 0, opacity: 1 },
                            }}
                            className="text-white"
                        >
                            <ArrowRight />
                        </motion.div>
                    </div>

                    <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-white transition-colors">
                        {policy.title}
                    </h3>

                    <p className="text-sm font-medium text-primary mb-4 group-hover:text-accent transition-colors">
                        {policy.category}
                    </p>

                    <div className="mt-4">
                        <p className="text-slate-600 text-sm leading-relaxed group-hover:text-gray-100 transition-colors">
                            {policy.summary}
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
