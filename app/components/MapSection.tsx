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

    const sectionTitle = locale === 'th' ? 'พื้นที่ที่เราลงสมัคร' : 'Where We Run';
    const sectionSubtitle = locale === 'th'
        ? 'คลิกที่จังหวัดสีน้ำเงินเพื่อดูรายชื่อผู้สมัคร'
        : 'Click on a blue province to see our candidates';
    const viewAllLabel = locale === 'th' ? 'ดูผู้สมัครทั้งหมด' : 'View All Candidates';

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 bg-primary/10 px-4 py-2 rounded-full">
                        <MapPin size={18} />
                        <span>{locale === 'th' ? '3 วิทยาเขต' : '3 Campuses'}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        {sectionTitle}
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto">
                        {sectionSubtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Map */}
                    <div className="order-2 md:order-1">
                        <InteractiveMap
                            onProvinceSelect={handleProvinceSelect}
                            selectedProvinceId={selectedProvinceId}
                        />
                    </div>

                    {/* Info Panel */}
                    <div ref={infoPanelRef} className="order-1 md:order-2 md:sticky md:top-24">
                        {selectedData ? (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Users className="text-primary" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">{selectedData.provinceName}</h3>
                                        <p className="text-primary font-medium">{selectedData.campus}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-slate-600">
                                        {locale === 'th'
                                            ? `มีผู้สมัคร ${selectedData.candidates.length} คนในพื้นที่นี้`
                                            : `${selectedData.candidates.length} candidate(s) in this area`
                                        }
                                    </p>

                                    <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2">
                                        {selectedData.candidates.map((candidate) => (
                                            <Link
                                                key={candidate.id || candidate._id}
                                                href={`/candidates/${candidate._id || candidate.id}`}
                                                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                            >
                                                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                                    {candidate.number}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 hover:text-primary transition-colors">{candidate.name}</p>
                                                    <p className="text-sm text-slate-500 truncate">{candidate.position}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>

                                    <Link
                                        href="/candidates"
                                        className="block w-full text-center mt-6 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-blue-800 transition-all"
                                    >
                                        {viewAllLabel}
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="text-slate-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
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
