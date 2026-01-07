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

export default function CandidateCard({ candidate }: CandidateCardProps) {
    // Determine image source: Sanity object or local path
    const imgSrc = candidate.image?.asset
        ? urlFor(candidate.image).url()
        : (typeof candidate.image === 'string' ? candidate.image : '/candidate-1.png');

    return (
        <Link href={`/candidates/${candidate._id || candidate.id}`} className="group block h-full">
            <motion.div
                className="relative h-full overflow-hidden rounded-xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Number Badge */}
                <div className="absolute top-4 right-4 z-10 bg-accent text-slate-900 w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {candidate.number}
                </div>

                {/* Image */}
                <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
                    <Image
                        src={candidate.image}
                        alt={candidate.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-4 relative">
                    <div className="absolute -top-12 left-4 text-white">
                        <span className="text-xs font-bold uppercase tracking-wider bg-primary/80 px-2 py-1 rounded backdrop-blur">
                            {candidate.campus}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {candidate.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium">
                        {candidate.position}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
