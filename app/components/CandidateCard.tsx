"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import { Candidate } from "@/app/lib/cms-data";
import { urlFor } from "@/sanity/lib/image";
import { User } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

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
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

    // Determine image source: Sanity object or local path
    const imgSrc = candidate.image?.asset
        ? urlFor(candidate.image).url()
        : (typeof candidate.image === 'string' && candidate.image.length > 0 ? candidate.image : null);

    // Use campusLabel from CMS, fallback to mapped label
    const campusLabel = candidate.campusLabel || CAMPUS_LABELS[candidate.campus] || candidate.campus;

    // Check if member is active (default to true if not set)
    const isActive = candidate.isActive !== false;

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (imgSrc) setIsLightboxOpen(true);
    };

    return (
        <>
            <Link href={`/candidates/${candidate._id || candidate.id}`} className="group block h-full">
                <motion.div
                    className={`relative h-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:ring-2 hover:ring-primary/20 shine-effect ${!isActive ? 'opacity-80' : ''}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Number Badge */}
                    <div className={`absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm transition-colors duration-300 ${isActive ? 'bg-accent text-slate-900 group-hover:bg-primary group-hover:text-white' : 'bg-gray-300 text-gray-600'}`}>
                        {candidate.number}
                    </div>

                    {/* Image */}
                    <div
                        className="relative aspect-[4/5] bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={handleImageClick}
                    >
                        {imgSrc ? (
                            <Image
                                src={imgSrc}
                                alt={candidate.name}
                                fill
                                className={`object-cover transition-transform duration-700 group-hover:scale-110 ${!isActive ? 'grayscale' : ''}`}
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <User size={64} className="mb-2 opacity-50" />
                                <span className="text-sm font-medium">No Image</span>
                            </div>
                        )}

                        {/* Overlay gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-60 group-hover:opacity-40' : 'opacity-70'}`} />

                        {/* Zoom hint icon (optional, appears on hover) */}
                        {imgSrc && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <div className="bg-black/30 backdrop-blur-sm p-3 rounded-full text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3" /><path d="M11 8a3 3 0 0 0-3 3" /><circle cx="11" cy="11" r="8" /></svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-4 relative">
                        <div className="absolute -top-12 left-4 text-white">
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur ${isActive ? 'bg-primary/90' : 'bg-gray-500/80'}`}>
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

            {imgSrc && (
                <ImageLightbox
                    isOpen={isLightboxOpen}
                    onClose={() => setIsLightboxOpen(false)}
                    imageUrl={imgSrc}
                    alt={candidate.name}
                />
            )}
        </>
    );
}

