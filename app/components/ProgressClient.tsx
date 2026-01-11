"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { CheckCircle, Clock, FileText, User, ChevronRight, BarChart3 } from "lucide-react";
import { Link } from "@/i18n/navigation";

// --- Types ---
type Policy = {
    _id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    iconName?: string;
    progress: number;
    policyType: string;
    campus?: string;
};

type Meeting = {
    _id: string;
    title: string;
    date: string;
    type: string;
    campus?: string;
    attendees?: { status: string; member: { _id: string; name: string } }[];
    votes?: { title: string; results: { vote: string; member: any }[] }[];
    motions?: { title: string; proposer: { _id: string; name: string } }[];
};

type Debate = {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    date: string;
    coverImage?: any;
};

type Props = {
    data: {
        policies: Policy[];
        meetings: Meeting[];
        debates: Debate[];
    };
    locale: string;
};

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => {
    let color = "bg-gray-300";
    let label = "0%";

    if (progress >= 100) { color = "bg-green-500"; label = "100%"; }
    else if (progress >= 75) { color = "bg-blue-500"; label = "75%"; }
    else if (progress >= 50) { color = "bg-yellow-500"; label = "50%"; }
    else if (progress >= 25) { color = "bg-orange-400"; label = "25%"; }
    else { color = "bg-slate-300"; label = "0%"; }

    return (
        <div className="w-full">
            <div className="flex justify-between text-xs mb-1 font-medium text-slate-500">
                <span>Progress</span>
                <span>{label}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${color} rounded-full`}
                />
            </div>
        </div>
    );
};

const AttendancePieChart = ({ meetings, t }: { meetings: Meeting[], t: any }) => {
    // Aggregate data
    let present = 0, leave = 0, absent = 0;

    meetings.forEach(m => {
        m.attendees?.forEach(a => {
            if (a.status === 'present') present++;
            if (a.status === 'leave') leave++;
            if (a.status === 'absent') absent++;
        });
    });

    const total = present + leave + absent;
    if (total === 0) return <div className="text-center text-gray-500 py-10">No meeting data available</div>;

    const presentDeg = (present / total) * 360;
    const leaveDeg = (leave / total) * 360;
    const absentDeg = (absent / total) * 360;

    return (
        <div className="flex flex-col items-center justify-center py-6">
            <div
                className="w-48 h-48 rounded-full relative"
                style={{
                    background: `conic-gradient(
                        #22c55e 0deg ${presentDeg}deg,
                        #eab308 ${presentDeg}deg ${presentDeg + leaveDeg}deg,
                        #ef4444 ${presentDeg + leaveDeg}deg 360deg
                    )`
                }}
            >
                <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{Math.round((present / total) * 100)}%</span>
                    <span className="text-xs text-slate-500">Attendance</span>
                </div>
            </div>
            <div className="flex gap-4 mt-6 text-sm">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Present ({present})</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Leave ({leave})</div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent ({absent})</div>
            </div>
        </div>
    );
};

export default function ProgressClient({ data, locale }: Props) {
    const t = useTranslations('ProgressPage');
    const [activeTab, setActiveTab] = useState<'policy' | 'council'>('policy');
    const [policyFilter, setPolicyFilter] = useState('all'); // all, central, Rangsit, Lampang, Tha Prachan

    // Filter Policies
    const filteredPolicies = data.policies.filter(p => {
        if (policyFilter === 'all') return true;
        if (policyFilter === 'central') return p.policyType === 'central';
        return p.campus === policyFilter;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{t('title')}</h1>
                <p className="text-slate-600">{t('subtitle')}</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-slate-100 p-1 rounded-xl inline-flex">
                    <button
                        onClick={() => setActiveTab('policy')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'policy' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {t('policyTab')}
                    </button>
                    <button
                        onClick={() => setActiveTab('council')}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'council' ? 'bg-white shadow-sm text-primary' : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        {t('councilTab')}
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'policy' ? (
                    <motion.div
                        key="policy"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Policy Filters */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8">
                            {['all', 'central', 'Rangsit', 'Lampang', 'Tha Prachan'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setPolicyFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${policyFilter === f
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary/50'
                                        }`}
                                >
                                    {f === 'central' ? t('filter.central') : f === 'all' ? t('filter.all') : t(`filter.${f}` as any) || f}
                                </button>
                            ))}
                        </div>

                        {/* Policies Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPolicies.map((policy) => (
                                <div key={policy._id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                                            {policy.category}
                                        </span>
                                        {policy.policyType === 'center' && (
                                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                                {policy.campus}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{policy.title}</h3>
                                    <p className="text-slate-500 text-sm mb-6 line-clamp-2">{policy.summary}</p>
                                    <ProgressBar progress={policy.progress || 0} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="council"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {/* Section 1: Attendance & Motions (2 cols) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Attendance */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-primary" />
                                    {t('attendance')}
                                </h3>
                                <AttendancePieChart meetings={data.meetings} t={t} />
                            </div>

                            {/* Recent Motions */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <FileText size={20} className="text-primary" />
                                    {t('motions')}
                                </h3>
                                <div className="space-y-4">
                                    {data.meetings.flatMap(m => m.motions || []).slice(0, 5).map((motion, idx) => (
                                        <div key={idx} className="flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="mt-1 min-w-[24px] w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-900">{motion.title}</p>
                                                <p className="text-xs text-slate-500 mt-1">Proposed by {motion.proposer?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {data.meetings.flatMap(m => m.motions || []).length === 0 && (
                                        <p className="text-slate-400 text-sm text-center">No recent motions</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Debates */}
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('debates')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.debates.map((debate) => (
                                    <Link key={debate._id} href={`/progress/debate/${debate.slug}`} className="group block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="h-48 bg-slate-200 relative">
                                            {/* Placeholder for image */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                                <FileText size={48} />
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{debate.title}</h4>
                                            <p className="text-slate-500 text-sm line-clamp-3">{debate.summary}</p>
                                            <div className="mt-4 flex items-center text-primary text-sm font-medium">
                                                Read More <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Section 3: Recent Votes */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">{t('votes')}</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3">Topic</th>
                                            <th className="px-6 py-3">Meeting</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.meetings.filter(m => m.votes && m.votes.length > 0).slice(0, 5).map((meeting) => (
                                            meeting.votes?.map((vote, vIdx) => (
                                                <tr key={`${meeting._id}-${vIdx}`} className="bg-white border-b hover:bg-slate-50">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{vote.title}</td>
                                                    <td className="px-6 py-4 text-slate-500">{meeting.title}</td>
                                                    <td className="px-6 py-4 text-slate-500">{new Date(meeting.date).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={"/candidates" as any} className="text-primary hover:text-blue-700 font-medium text-xs">
                                                            {t('viewProfile')}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
