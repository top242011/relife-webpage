"use client";

import React, { useState, useEffect, useRef } from "react";
import InteractiveMap from "./InteractiveMap";
import { Candidate } from "@/app/lib/cms-data";
import { MapPin, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { client } from "@/sanity/lib/client";
import { CANDIDATES_QUERY } from "@/sanity/lib/queries";

// Mapping from campus to province ID and province name
const CAMPUS_TO_PROVINCE: Record<string, { provinceId: string; provinceName: string }> = {
    "Tha Prachan": { provinceId: "TH-10", provinceName: "กรุงเทพมหานคร" },
    "Rangsit": { provinceId: "TH-13", provinceName: "ปทุมธานี" },
    "Lampang": { provinceId: "TH-52", provinceName: "ลำปาง" },
};

interface MapSectionProps {
    locale: string;
}

interface CandidatesByProvince {
    [provinceId: string]: {
        provinceName: string;
        campus: string;
        candidates: Candidate[];
    };
}

export default function MapSection({ locale }: MapSectionProps) {
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    const [candidatesByProvince, setCandidatesByProvince] = useState<CandidatesByProvince>({});
    const [loading, setLoading] = useState(true);
    const infoPanelRef = useRef<HTMLDivElement>(null);

    // Handle province selection with scroll on mobile
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
        // Scroll to info panel on mobile
        if (window.innerWidth < 768 && infoPanelRef.current) {
            setTimeout(() => {
                infoPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const candidates: Candidate[] = await client.fetch(
                    CANDIDATES_QUERY,
                    { lang: locale },
                    { cache: 'no-store' }
                );

                // Group candidates by campus and map to province
                const grouped: CandidatesByProvince = {};

                candidates.forEach((candidate) => {
                    const campusMapping = CAMPUS_TO_PROVINCE[candidate.campus];
                    if (campusMapping) {
                        const { provinceId, provinceName } = campusMapping;
                        if (!grouped[provinceId]) {
                            grouped[provinceId] = {
                                provinceName,
                                campus: candidate.campus,
                                candidates: [],
                            };
                        }
                        grouped[provinceId].candidates.push(candidate);
                    }
                });

                setCandidatesByProvince(grouped);
            } catch (error) {
                console.error("Failed to fetch candidates:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, [locale]);

    const selectedData = selectedProvinceId
        ? candidatesByProvince[selectedProvinceId]
        : null;

    // Calculate stats for map
    const provinceStats = Object.keys(candidatesByProvince).reduce((acc, provinceId) => {
        acc[provinceId] = candidatesByProvince[provinceId].candidates.length;
        return acc;
    }, {} as Record<string, number>);

    const sectionTitle = locale === 'th' ? 'พื้นที่ที่เราลงสมัคร' : 'Where We Run';
    const sectionSubtitle = locale === 'th'
        ? 'คลิกที่จังหวัดสีน้ำเงินเพื่อดูรายชื่อผู้สมัคร'
        : 'Click on a blue province to see our candidates';
    const viewAllLabel = locale === 'th' ? 'ดูผู้สมัครทั้งหมด' : 'View All Candidates';

    return (
        <section className="py-16 sm:py-20 md:py-24 bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-3 md:mb-4 bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                        <MapPin size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span>{locale === 'th' ? '3 วิทยาเขต' : '3 Campuses'}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
                        {sectionTitle}
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg text-slate-500 max-w-xl mx-auto px-2">
                        {sectionSubtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start max-w-6xl mx-auto">
                    {/* Map */}
                    <div className="order-2 md:order-1">
                        <InteractiveMap
                            onProvinceSelect={handleProvinceSelect}
                            selectedProvinceId={selectedProvinceId}
                            provinceStats={provinceStats}
                        />
                    </div>

                    {/* Info Panel */}
                    <div ref={infoPanelRef} className="order-1 md:order-2 md:sticky md:top-24">
                        {selectedData ? (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                                        <Users className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 truncate">{selectedData.provinceName}</h3>
                                        <p className="text-sm sm:text-base text-primary font-medium">{selectedData.campus}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <p className="text-sm sm:text-base text-slate-600">
                                        {locale === 'th'
                                            ? `มีผู้สมัคร ${selectedData.candidates.length} คนในพื้นที่นี้`
                                            : `${selectedData.candidates.length} candidate(s) in this area`
                                        }
                                    </p>

                                    <div className="space-y-2 sm:space-y-3 max-h-[200px] sm:max-h-[240px] overflow-y-auto pr-2">
                                        {selectedData.candidates.map((candidate) => (
                                            <Link
                                                key={candidate.id || candidate._id}
                                                href={`/candidates/${candidate._id || candidate.id}`}
                                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                            >
                                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm sm:text-base">
                                                    {candidate.number}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-medium text-sm sm:text-base text-slate-900 hover:text-primary transition-colors truncate">{candidate.name}</p>
                                                    <p className="text-xs sm:text-sm text-slate-500 truncate">{candidate.position}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href="/candidates"
                                        className="block w-full text-center mt-4 sm:mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white text-sm sm:text-base font-bold rounded-full hover:bg-blue-800 transition-all"
                                    >
                                        {viewAllLabel}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <MapPin className="text-slate-400 w-6 h-6 sm:w-8 sm:h-8" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                                    {locale === 'th' ? 'เลือกจังหวัด' : 'Select a Province'}
                                </h3>
                                <p className="text-slate-500">
                                    {locale === 'th'
                                        ? 'คลิกที่จังหวัดสีน้ำเงินบนแผนที่เพื่อดูข้อมูลผู้สมัคร'
                                        : 'Click on a blue province on the map to see candidate information'
                                    }
                                </p>
                                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                                    {Object.entries(candidatesByProvince).map(([id, data]) => (
                                        <button
                                            key={id}
                                            onClick={() => setSelectedProvinceId(id)}
                                            className="px-4 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-full hover:bg-primary hover:text-white transition-all"
                                        >
                                            {data.provinceName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
