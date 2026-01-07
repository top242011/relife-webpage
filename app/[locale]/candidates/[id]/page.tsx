import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { CANDIDATE_BY_ID_QUERY } from "@/sanity/lib/queries";
import { Candidate } from "@/app/lib/cms-data";
import { ArrowLeft, Quote, GraduationCap, Trophy } from "lucide-react";
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
    const candidate = await client.fetch<Candidate>(CANDIDATE_BY_ID_QUERY, { id, lang: locale });

    if (!candidate) notFound();

    const imgSrc = candidate.image?.asset
        ? urlFor(candidate.image).url()
        : (typeof candidate.image === 'string' ? candidate.image : '/candidate-1.png');


    return (
        <div className="min-h-screen bg-white md:flex">
            {/* Left Column: Image */}
            <div className="w-full md:w-1/2 lg:w-5/12 h-[50vh] md:h-screen sticky top-0 bg-gray-100">
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
            <div className="w-full md:w-1/2 lg:w-7/12 px-6 py-12 md:p-16 lg:p-24 overflow-y-auto">
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
                </div>
            </div>
        </div>
    );
}
