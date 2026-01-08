"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { CANDIDATES_QUERY, SITE_CONTENT_QUERY } from "@/sanity/lib/queries";
import { Candidate } from "@/app/lib/cms-data";
import CandidateCard from "@/app/components/CandidateCard";
import { Users } from "lucide-react";
import { useLocale } from "next-intl";

interface SiteContent {
    candidatesTitle: string;
    candidatesSubtitle: string;
    candidatesAll: string;
    candidatesNotFound: string;
    campusRangsit: string;
    campusLampang: string;
    campusThaPrachan: string;
}

export default function CandidatesPage() {
    const locale = useLocale();
    const [selectedCampus, setSelectedCampus] = useState("All");
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [candidatesData, siteContent] = await Promise.all([
                    client.fetch(CANDIDATES_QUERY, { lang: locale }, { cache: 'no-store' }),
                    client.fetch(SITE_CONTENT_QUERY, { lang: locale }, { cache: 'no-store' }),
                ]);
                setCandidates(candidatesData);
                setContent(siteContent);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [locale]);

    // Fallback labels
    const title = content?.candidatesTitle || (locale === 'th' ? 'ผู้สมัครของเรา' : 'Our Candidates');
    const subtitle = content?.candidatesSubtitle || (locale === 'th' ? 'ทีมงานคุณภาพพร้อมรับใช้' : 'A diverse team ready to serve.');
    const allLabel = content?.candidatesAll || (locale === 'th' ? 'ทั้งหมด' : 'All');
    const notFoundLabel = content?.candidatesNotFound || (locale === 'th' ? 'ไม่พบข้อมูล' : 'No candidates found.');
    const campusRangsit = content?.campusRangsit || (locale === 'th' ? 'รังสิต' : 'Rangsit');
    const campusLampang = content?.campusLampang || (locale === 'th' ? 'ลำปาง' : 'Lampang');
    const campusThaPrachan = content?.campusThaPrachan || (locale === 'th' ? 'ท่าพระจันทร์' : 'Tha Prachan');

    const CAMPUSES = [
        { id: "All", label: allLabel },
        { id: "Rangsit", label: campusRangsit },
        { id: "Lampang", label: campusLampang },
        { id: "Tha Prachan", label: campusThaPrachan },
    ];

    const filteredCandidates =
        selectedCampus === "All"
            ? candidates
            : candidates.filter((c) => c.campus === selectedCampus);

    return (
        <div className="min-h-screen pb-20 bg-gray-50/50">
            {/* Hero */}
            <section className="bg-white pt-24 pb-12 border-b border-gray-100">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 bg-primary/5 px-4 py-1.5 rounded-full">
                        <Users size={16} />
                        <span>Meet Our Team</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter text-slate-900">
                        {title}
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>
            </section>

            {/* Filter */}
            <section className="py-8 sticky top-[72px] z-40 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-4 flex justify-center">
                    <div className="inline-flex bg-white p-1 rounded-full border border-gray-200 shadow-sm overflow-x-auto max-w-full">
                        {CAMPUSES.map((campus) => (
                            <button
                                key={campus.id}
                                onClick={() => setSelectedCampus(campus.id)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${selectedCampus === campus.id
                                    ? "bg-primary text-white shadow-md transform scale-105"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-gray-50"
                                    }`}
                            >
                                {campus.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredCandidates.map((candidate) => (
                                <motion.div
                                    key={candidate._id || candidate.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <CandidateCard candidate={candidate} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && filteredCandidates.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <p>{notFoundLabel}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
