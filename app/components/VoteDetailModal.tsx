"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, FileText } from "lucide-react";
import ParliamentChart from "./ParliamentChart";

type Attendee = {
    status: string;
    member: { _id: string; name: string };
};

type VoteResult = {
    vote: string;
    member: { _id: string; name: string; image?: any };
};

type Vote = {
    title: string;
    results: VoteResult[];
};

type Meeting = {
    _id: string;
    title: string;
    date: string;
    attendees?: Attendee[];
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    vote: Vote | null;
    meeting: Meeting | null;
    t: any;
};

const voteBadgeStyles: Record<string, string> = {
    approve: "bg-green-100 text-green-700",
    disapprove: "bg-red-100 text-red-700",
    abstain: "bg-yellow-100 text-yellow-700",
    no_vote: "bg-slate-200 text-slate-600",
};

export default function VoteDetailModal({ isOpen, onClose, vote, meeting, t }: Props) {
    if (!vote || !meeting) return null;

    // Count votes
    const voteCount = {
        approve: vote.results?.filter((r) => r.vote === "approve").length || 0,
        disapprove: vote.results?.filter((r) => r.vote === "disapprove").length || 0,
        abstain: vote.results?.filter((r) => r.vote === "abstain").length || 0,
        no_vote: vote.results?.filter((r) => r.vote === "no_vote").length || 0,
    };

    // Count attendance
    const attendanceCount = {
        present: meeting.attendees?.filter((a) => a.status === "present").length || 0,
        leave: meeting.attendees?.filter((a) => a.status === "leave").length || 0,
        absent: meeting.attendees?.filter((a) => a.status === "absent").length || 0,
    };

    // Prepare seats for parliament chart
    const seats = vote.results?.map((r) => ({
        id: r.member._id,
        name: r.member.name,
        vote: r.vote as "approve" | "disapprove" | "abstain" | "no_vote",
    })) || [];

    const getVoteLabel = (voteType: string) => {
        if (voteType === "approve") return t("approve");
        if (voteType === "disapprove") return t("disapprove");
        if (voteType === "abstain") return t("abstain");
        if (voteType === "no_vote") return t("noVote");
        return voteType;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start rounded-t-2xl">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                        <FileText size={20} className="text-primary" />
                                        {t("title")}
                                    </h2>
                                    <p className="text-sm text-slate-600 mt-1 max-w-md">
                                        {vote.title}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {meeting.title} • {new Date(meeting.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-8">
                                {/* Parliament Chart */}
                                <div className="bg-slate-50 rounded-xl p-6">
                                    <ParliamentChart seats={seats} totalSeats={100} t={t} />
                                </div>

                                {/* Vote Summary */}
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
                                        {t("voteSummary")}
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-green-500"></span>
                                            <span className="text-sm text-slate-700">
                                                {t("approve")}: <strong>{voteCount.approve}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-red-500"></span>
                                            <span className="text-sm text-slate-700">
                                                {t("disapprove")}: <strong>{voteCount.disapprove}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-yellow-500"></span>
                                            <span className="text-sm text-slate-700">
                                                {t("abstain")}: <strong>{voteCount.abstain}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-4 h-4 rounded-full bg-slate-600"></span>
                                            <span className="text-sm text-slate-700">
                                                {t("noVote")}: <strong>{voteCount.no_vote}</strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Attendees Summary */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Users size={20} className="text-primary" />
                                        {t("attendees")}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Present */}
                                        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                                <span className="text-sm font-semibold text-green-700">
                                                    {t("presentMembers")} ({attendanceCount.present})
                                                </span>
                                            </div>
                                            <div className="text-xs text-green-600 space-y-1 max-h-32 overflow-y-auto">
                                                {meeting.attendees
                                                    ?.filter((a) => a.status === "present")
                                                    .map((a) => (
                                                        <div key={a.member._id}>{a.member.name}</div>
                                                    ))}
                                            </div>
                                        </div>

                                        {/* Leave */}
                                        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                                <span className="text-sm font-semibold text-yellow-700">
                                                    {t("leaveMembers")} ({attendanceCount.leave})
                                                </span>
                                            </div>
                                            <div className="text-xs text-yellow-600 space-y-1 max-h-32 overflow-y-auto">
                                                {meeting.attendees
                                                    ?.filter((a) => a.status === "leave")
                                                    .map((a) => (
                                                        <div key={a.member._id}>{a.member.name}</div>
                                                    ))}
                                                {attendanceCount.leave === 0 && <span className="text-yellow-400">-</span>}
                                            </div>
                                        </div>

                                        {/* Absent */}
                                        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                                <span className="text-sm font-semibold text-red-700">
                                                    {t("absentMembers")} ({attendanceCount.absent})
                                                </span>
                                            </div>
                                            <div className="text-xs text-red-600 space-y-1 max-h-32 overflow-y-auto">
                                                {meeting.attendees
                                                    ?.filter((a) => a.status === "absent")
                                                    .map((a) => (
                                                        <div key={a.member._id}>{a.member.name}</div>
                                                    ))}
                                                {attendanceCount.absent === 0 && <span className="text-red-400">-</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Individual Vote Results */}
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText size={20} className="text-primary" />
                                        {t("voteResults")}
                                    </h3>
                                    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                                        <div className="max-h-64 overflow-y-auto">
                                            {vote.results?.map((result, idx) => (
                                                <div
                                                    key={result.member._id}
                                                    className={`flex justify-between items-center px-4 py-3 ${idx !== vote.results.length - 1 ? "border-b border-slate-50" : ""
                                                        }`}
                                                >
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {result.member.name}
                                                    </span>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-bold ${voteBadgeStyles[result.vote] || "bg-slate-100 text-slate-600"
                                                            }`}
                                                    >
                                                        {getVoteLabel(result.vote)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 rounded-b-2xl">
                                <button
                                    onClick={onClose}
                                    className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
                                >
                                    {t("close")}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
