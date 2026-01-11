"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { client } from "@/sanity/lib/client";
import { CANDIDATES_QUERY, SITE_CONTENT_QUERY } from "@/sanity/lib/queries";
import { Candidate } from "@/app/lib/cms-data";
import CandidateCard from "@/app/components/CandidateCard";
import { Users, Crown, ChevronDown, ChevronUp } from "lucide-react";
import { useLocale } from "next-intl";

interface SiteContent {
    candidatesTitle: string;
    candidatesSubtitle: string;
    candidatesAll: string;
    candidatesNotFound: string;
    campusRangsit: string;
    campusLampang: string;
    campusThaPrachan: string;
    executiveTitle: string;
    partyListTitle: string;
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
    const title = content?.candidatesTitle || (locale === 'th' ? 'สมาชิกสภาของเรา' : 'Our Council Members');
    const allLabel = content?.candidatesAll || (locale === 'th' ? 'ทั้งหมด' : 'All');
    const notFoundLabel = content?.candidatesNotFound || (locale === 'th' ? 'ไม่พบข้อมูล' : 'No members found.');
    const campusRangsit = content?.campusRangsit || (locale === 'th' ? 'รังสิต' : 'Rangsit');
    const campusLampang = content?.campusLampang || (locale === 'th' ? 'ลำปาง' : 'Lampang');
    const campusThaPrachan = content?.campusThaPrachan || (locale === 'th' ? 'ท่าพระจันทร์' : 'Tha Prachan');
    const executiveTitle = content?.executiveTitle || (locale === 'th' ? 'คณะกรรมการบริหาร' : 'Executive Committee');
    const partyListTitle = content?.partyListTitle || (locale === 'th' ? 'สมาชิกสภาแบบบัญชีรายชื่อ' : 'Party List Members');

    const CAMPUSES = [
        { id: "All", label: allLabel },
        { id: "Rangsit", label: campusRangsit },
        { id: "Lampang", label: campusLampang },
        { id: "Tha Prachan", label: campusThaPrachan },
    ];

    // Filter by campus
    const filteredCandidates =
        selectedCampus === "All"
            ? candidates
            : candidates.filter((c) => c.campus === selectedCampus);

    // Split by category
    const executiveMembers = filteredCandidates.filter((c) => c.memberCategory === 'executive');
    const partyListMembers = filteredCandidates.filter((c) => c.memberCategory === 'partyList' || !c.memberCategory);

    // Grid component for candidates
    const CandidateGrid = ({ members }: { members: Candidate[] }) => (
        <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
            <AnimatePresence mode="popLayout">
                {members.map((candidate) => (
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
    );


    // Section Component with Inactive Toggle
    const SectionWithInactive = ({ title, members }: { title: string, members: Candidate[] }) => {
        const activeMembers = members.filter(m => m.isActive !== false);
        const inactiveMembers = members.filter(m => m.isActive === false);
        const [isExpanded, setIsExpanded] = useState(false);

        if (members.length === 0) return null;

        return (
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                </div>

                {/* Active Members */}
                {activeMembers.length > 0 && (
                    <CandidateGrid members={activeMembers} />
                )}

                {/* Inactive Members Collapsible */}
                {inactiveMembers.length > 0 && (
                    <div className="mt-8">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 w-full py-4 border-t border-gray-200"
                        >
                            <span className="font-medium text-sm">
                                {locale === 'th' ? 'สมาชิกที่พ้นจากตำแหน่ง' : 'Former Members'} ({inactiveMembers.length})
                            </span>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <CandidateGrid members={inactiveMembers} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-20 bg-gray-50/50">
            {/* Filter */}
            <section className="py-3 sticky top-[64px] z-40 bg-white border-b border-gray-200">
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

            {/* Content */}
            <section className="container mx-auto px-4 py-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Executive Section */}
                        <SectionWithInactive title={executiveTitle} members={executiveMembers} />

                        {/* Party List Section */}
                        <SectionWithInactive title={partyListTitle} members={partyListMembers} />

                        {/* Empty State */}
                        {filteredCandidates.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <p>{notFoundLabel}</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

