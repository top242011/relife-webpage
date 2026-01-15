import React from "react";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POLICY_BY_SLUG_QUERY, SITE_CONTENT_QUERY } from "@/sanity/lib/queries";
import { Policy } from "@/app/lib/cms-data";
import { urlFor } from "@/sanity/lib/image";
import {
    ArrowLeft, Calendar, Share2, Tag, BookOpen, Users, Leaf,
    Briefcase, GraduationCap, Heart, Shield, Search, CheckCircle,
    Settings, ArrowRight, Home
} from "lucide-react";
import { PortableText } from '@portabletext/react';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

interface SiteContent {
    policiesBack: string;
    commonShare: string;
    commonPublished: string;
}

const iconMap: Record<string, any> = {
    "graduation-cap": GraduationCap,
    "leaf": Leaf,
    "shield": Shield,
    "heart": Heart,
    "briefcase": Briefcase,
    "users": Users,
    "book-open": BookOpen,
};

export async function generateMetadata({ params }: Props) {
    const { locale, slug } = await params;
    const policy = await client.fetch<Policy>(POLICY_BY_SLUG_QUERY, { slug, lang: locale });

    if (!policy) {
        return {
            title: "Policy Not Found",
        };
    }

    return {
        title: `${policy.title} | Relife Policies`,
        description: policy.summary,
    };
}

export default async function PolicyDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    const [policy, content] = await Promise.all([
        client.fetch<Policy>(POLICY_BY_SLUG_QUERY, { slug, lang: locale }),
        client.fetch<SiteContent>(SITE_CONTENT_QUERY, { lang: locale }),
    ]);

    if (!policy) {
        notFound();
    }

    const Icon = policy.iconName ? (iconMap[policy.iconName] || BookOpen) : BookOpen;

    // Fallback labels
    const backLabel = content?.policiesBack || (locale === 'th' ? 'กลับหน้ารวม' : 'Back to Policies');
    const shareLabel = content?.commonShare || (locale === 'th' ? 'แชร์' : 'Share');
    const publishedLabel = content?.commonPublished || (locale === 'th' ? 'เผยแพร่เมื่อ' : 'Published');

    // Section Titles
    const whyTitle = locale === 'th' ? 'ทำไมต้องแก้ปัญหา (WHY)' : 'Why It Matters (WHY)';
    const whatTitle = locale === 'th' ? 'เราจะทำอะไร (WHAT)' : 'What We Will Do (WHAT)';
    const howTitle = locale === 'th' ? 'ทำอย่างไรให้สำเร็จ (HOW)' : 'How We Do It (HOW)';

    // Custom Portable Text Components for better styling
    const ptComponents = {
        block: {
            h1: ({ children }: any) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
            h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-6 mb-3 text-slate-800">{children}</h2>,
            h3: ({ children }: any) => <h3 className="text-xl font-bold mt-4 mb-2 text-slate-800">{children}</h3>,
            normal: ({ children }: any) => <p className="mb-4 leading-relaxed text-slate-600">{children}</p>,
        },
        list: {
            bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 space-y-2 text-slate-600">{children}</ul>,
            number: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-slate-600">{children}</ol>,
        },
        listItem: {
            bullet: ({ children }: any) => <li>{children}</li>,
            number: ({ children }: any) => <li className="pl-1">{children}</li>,
        }
    };

    return (
        <article className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative bg-primary text-white pt-32 pb-24 md:pb-32 px-4 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 z-0 opacity-10">
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_white_0%,_transparent_50%)]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,_white_0%,_transparent_50%)]"></div>
                </div>

                <div className="container mx-auto max-w-5xl relative z-10">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-8 font-medium">
                        <Link href="/" className="text-white/70 hover:text-white transition-colors flex items-center gap-1">
                            <Home size={14} /> Home
                        </Link>
                        <span className="text-white/50">/</span>
                        <Link href="/policy" className="text-white/70 hover:text-white transition-colors">
                            Policies
                        </Link>
                        <span className="text-white/50">/</span>
                        <span className="text-accent font-semibold truncate max-w-[200px]">{policy.title}</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-accent font-medium mb-6 border border-white/10">
                                <Icon size={16} />
                                <span>{policy.category}</span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                                {policy.title}
                            </h1>

                            {policy.tagline && (
                                <p className="text-xl md:text-2xl text-white/90 font-medium mb-6 leading-relaxed border-l-4 border-primary pl-4">
                                    {policy.tagline}
                                </p>
                            )}

                            <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                                {policy.summary}
                            </p>

                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-6">
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Calendar size={16} />
                                    <span>{publishedLabel}: Jan 7, 2026</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-sm">
                                    <Tag size={16} />
                                    <span>{policy.category}</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image / Illustration */}
                        {policy.heroImage && (
                            <div className="hidden md:block w-1/3 max-w-[320px]">
                                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500 ring-4 ring-white/10">
                                    <img
                                        src={urlFor(policy.heroImage).url()}
                                        alt={policy.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="container mx-auto px-4 -mt-10 relative z-20 max-w-5xl space-y-8">

                {/* 1. WHY Section */}
                {policy.whySection && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp transition-all duration-300 hover:shadow-2xl hover:border-amber-200 hover:-translate-y-1">
                        <div className="bg-gradient-to-r from-amber-50 to-white border-b border-gray-100 p-6 md:p-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                <Search size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{whyTitle}</h2>
                        </div>
                        <div className="p-6 md:p-10">
                            <div className="prose prose-lg prose-slate max-w-none">
                                <PortableText value={policy.whySection} components={ptComponents} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. WHAT Section */}
                {policy.whatSection && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp transition-all duration-300 hover:shadow-2xl hover:border-blue-200 hover:-translate-y-1" style={{ animationDelay: '0.1s' }}>
                        <div className="bg-gradient-to-r from-blue-50 to-white border-b border-gray-100 p-6 md:p-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                <CheckCircle size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{whatTitle}</h2>
                        </div>
                        <div className="p-6 md:p-10">
                            <div className="prose prose-lg prose-slate max-w-none">
                                <PortableText value={policy.whatSection} components={ptComponents} />
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. HOW Section */}
                {policy.howSection && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden animate-slideUp transition-all duration-300 hover:shadow-2xl hover:border-emerald-200 hover:-translate-y-1" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-gradient-to-r from-emerald-50 to-white border-b border-gray-100 p-6 md:p-8 flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                                <Settings size={24} strokeWidth={2.5} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{howTitle}</h2>
                        </div>
                        <div className="p-6 md:p-10">
                            <div className="prose prose-lg prose-slate max-w-none">
                                <PortableText value={policy.howSection} components={ptComponents} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Fallback for legacy content */}
                {!policy.whySection && !policy.whatSection && !policy.howSection && (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                        <div className="prose prose-lg prose-slate hover:prose-a:text-primary max-w-none">
                            {Array.isArray(policy.content) ? (
                                <PortableText value={policy.content} components={ptComponents} />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: policy.content as string }} />
                            )}
                        </div>
                    </div>
                )}

                {/* Footer / Share */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 pb-12">
                    <Link
                        href="/policy"
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        {backLabel}
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-medium mr-2">{shareLabel}</span>
                        <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>

            </div>
        </article>
    );
}
