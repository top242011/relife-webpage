import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { CANDIDATE_BY_ID_QUERY, MEMBER_STATS_QUERY } from "@/sanity/lib/queries";
import { Candidate } from "@/app/lib/cms-data";
import { ArrowLeft, Quote, GraduationCap, Trophy, Briefcase } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";

type Props = {
    params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale, id } = await params;

    // We fetch candidate here for metadata
    const candidate = await client.fetch<Candidate>(CANDIDATE_BY_ID_QUERY, { id, lang: locale });

    if (!candidate) return { title: "Candidate Not Found" };

    return {
        title: `${candidate.name} | Relife Candidate`,
        description: candidate.bio,
    };
}

export default async function CandidateDetailPage({ params }: Props) {
    const { locale, id } = await params;
    const [candidate, stats] = await Promise.all([
        client.fetch<Candidate>(CANDIDATE_BY_ID_QUERY, { id, lang: locale }),
        client.fetch<any>(MEMBER_STATS_QUERY, { id })
    ]);

    if (!candidate) notFound();

    const imgSrc = candidate.image?.asset
        ? urlFor(candidate.image).url()
        : (typeof candidate.image === 'string' ? candidate.image : '/candidate-1.png');


    return (
        <div className="min-h-screen bg-white md:flex">
            {/* Left Column: Image */}
            <div className="relative w-full md:w-1/2 lg:w-5/12 h-[50vh] md:h-screen md:sticky md:top-0 bg-gray-100">
                <Image
                    src={imgSrc}
                    alt={candidate.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent md:hidden" />

                <Link
                    href="/candidates"
                    className="absolute top-8 left-8 md:top-24 z-20 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* Right Column: Content */}
            <div className="relative z-10 w-full md:w-1/2 lg:w-7/12 px-6 py-12 md:p-16 lg:p-24 overflow-y-auto bg-white">
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <span className="text-secondary-foreground font-semibold uppercase tracking-wider text-sm text-gray-400 mb-2 block">
                            {candidate.campus}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
                            {candidate.name}
                        </h1>
                        <p className="text-xl text-primary font-medium mt-2">
                            {candidate.position}
                        </p>
                    </div>

                    <div className="bg-primary text-white w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-2xl text-3xl md:text-4xl font-bold shadow-lg shrink-0">
                        {candidate.number}
                    </div>
                </div>

                <div className="space-y-12">
                    {/* Quote / Vision */}
                    <blockquote className="relative p-8 bg-accent/10 border-l-4 border-accent rounded-r-xl">
                        <Quote className="absolute top-4 left-4 text-accent/20 w-8 h-8 rotate-180" />
                        <p className="text-xl md:text-2xl font-serif text-slate-800 italic relative z-10">
                            "{candidate.vision}"
                        </p>
                    </blockquote>

                    {/* Bio */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            About Me
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {candidate.bio}
                        </p>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <GraduationCap size={20} className="text-primary" />
                            Education
                        </h3>
                        <ul className="space-y-4">
                            {candidate.education?.map((edu, idx) => (
                                <li key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    <span className="text-slate-700 font-medium">{edu}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Work Experience */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Briefcase size={20} className="text-primary" />
                            Work Experience
                        </h3>
                        {candidate.workExperience && candidate.workExperience.length > 0 ? (
                            <ul className="space-y-4">
                                {candidate.workExperience.map((work, idx) => (
                                    <li key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                        <span className="text-slate-700 font-medium">{work}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-400">-</span>
                            </div>
                        )}
                    </div>

                    {/* Achievements */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Trophy size={20} className="text-primary" />
                            Achievements
                        </h3>
                        {candidate.achievements && candidate.achievements.length > 0 ? (
                            <ul className="space-y-4">
                                {candidate.achievements.map((achievement, idx) => (
                                    <li key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
                                        <span className="text-slate-700 font-medium">{achievement}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <span className="text-gray-400">-</span>
                            </div>
                        )}
                    </div>

                    {/* Parliamentary Performance */}
                    {(stats?.meetings?.length > 0 || stats?.votes?.length > 0) && (
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Trophy size={20} className="text-primary" />
                                Parliamentary Performance
                            </h3>

                            {/* Attendance Score */}
                            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Attendance Record</h4>
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl font-bold text-slate-900">
                                        {(() => {
                                            // Score = Total Meetings - Attended (Present) ? No, user said "Total - Entered = 0 if full".
                                            // So it calculates "Missed" count?
                                            // "Criteria is: Central + Center meetings THEN MINUS number of times entered. If entered full amount, value will be zero."
                                            // So result is "Number of Absences/Leaves".
                                            const total = stats.meetings.length;
                                            const attended = stats.meetings.filter((m: any) => m.attendance === 'present').length;
                                            const score = total - attended;
                                            // Note: 'leave' implies entered? User said "meeting options: join, leave, absent".
                                            // "minus number of times entered". Does "Leave" count as entered? Usually Leave is excusable absence.
                                            // I will assume "Entered" = Present.
                                            return score;
                                        })()}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        Missed Meetings / Absences
                                        <br />
                                        <span className="text-xs text-slate-400">(0 means perfect attendance)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Voting History */}
                            {stats.votes?.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Voting History</h4>
                                    <div className="space-y-3">
                                        {stats.votes.map((meeting: any) => (
                                            meeting.votes?.map((vote: any, idx: number) => (
                                                <div key={`${meeting._id}-${idx}`} className="flex justify-between items-center bg-white border border-slate-100 p-4 rounded-lg shadow-sm">
                                                    <div>
                                                        <div className="font-medium text-slate-900">{vote.title}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{meeting.title} • {new Date(meeting.date).toLocaleDateString()}</div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${vote.myVote === 'approve' ? 'bg-green-100 text-green-700' :
                                                            vote.myVote === 'disapprove' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {vote.myVote}
                                                    </span>
                                                </div>
                                            ))
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">
                            Social Media
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Facebook */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                <span className="text-2xl">📘</span>
                                {candidate.socialLinks?.facebook ? (
                                    <a
                                        href={candidate.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Facebook
                                    </a>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>

                            {/* Instagram */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                <span className="text-2xl">📷</span>
                                {candidate.socialLinks?.instagram ? (
                                    <a
                                        href={candidate.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Instagram
                                    </a>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>

                            {/* Twitter/X */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                <span className="text-2xl">🐦</span>
                                {candidate.socialLinks?.twitter ? (
                                    <a
                                        href={candidate.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        Twitter
                                    </a>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>

                            {/* TikTok */}
                            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                                <span className="text-2xl">🎵</span>
                                {candidate.socialLinks?.tiktok ? (
                                    <a
                                        href={candidate.socialLinks.tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline font-medium"
                                    >
                                        TikTok
                                    </a>
                                ) : (
                                    <span className="text-gray-400">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
