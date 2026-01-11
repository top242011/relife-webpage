"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Candidate } from "@/app/lib/cms-data";
import { urlFor } from "@/sanity/lib/image";

interface CandidateCardProps {
    candidate: Candidate | any;
}

// Campus label mapping for fallback
const CAMPUS_LABELS: Record<string, string> = {
    'Rangsit': 'รังสิต',
    'Lampang': 'ลำปาง',
    'Tha Prachan': 'ท่าพระจันทร์',
};

export default function CandidateCard({ candidate }: CandidateCardProps) {
    // Determine image source: Sanity object or local path
    const imgSrc = candidate.image?.asset
        ? urlFor(candidate.image).url()
        : (typeof candidate.image === 'string' ? candidate.image : '/candidate-1.png');

    // Use campusLabel from CMS, fallback to mapped label
    const campusLabel = candidate.campusLabel || CAMPUS_LABELS[candidate.campus] || candidate.campus;

    // Check if member is active (default to true if not set)
    const isActive = candidate.isActive !== false;

    return (
        <Link href={`/candidates/${candidate._id || candidate.id}`} className="group block h-full">
            <motion.div
                className={`relative h-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!isActive ? 'opacity-80' : ''}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Number Badge */}
                <div className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm transition-colors duration-300 ${isActive ? 'bg-accent text-slate-900 group-hover:bg-primary group-hover:text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {candidate.number}
                </div>

                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    <Image
                        src={imgSrc}
                        alt={candidate.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${!isActive ? 'grayscale' : ''}`}
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Overlay gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-opacity ${isActive ? 'opacity-60 group-hover:opacity-40' : 'opacity-70'}`} />
                </div>

                {/* Content */}
                <div className="p-4 relative">
                    <div className="absolute -top-12 left-4 text-white">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur ${isActive ? 'bg-primary/80' : 'bg-gray-500/80'}`}>
                            {campusLabel}
                        </span>
                    </div>

                    <h3 className={`text-lg font-bold mb-1 transition-colors ${isActive ? 'text-slate-900 group-hover:text-primary' : 'text-gray-500'}`}>
                        {candidate.name}
                    </h3>
                    <p className={`text-sm font-medium ${isActive ? 'text-slate-500' : 'text-gray-400'}`}>
                        {candidate.position}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}

