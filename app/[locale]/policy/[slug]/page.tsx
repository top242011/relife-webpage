import React from "react"; // Explicitly import React
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { POLICY_BY_SLUG_QUERY, SITE_CONTENT_QUERY } from "@/sanity/lib/queries";
import { Policy } from "@/app/lib/cms-data";
import { ArrowLeft, Calendar, Share2, Tag, BookOpen, Users, Leaf, Briefcase, GraduationCap, Heart, Shield } from "lucide-react";

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

    // Let's import PortableText
    const { PortableText } = await import('@portabletext/react');

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Brief Hero */}
            <div className="bg-slate-900 text-white pt-24 pb-20 px-4">
                <div className="container mx-auto max-w-4xl">
                    <Link
                        href="/policy"
                        className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        {backLabel}
                    </Link>

                    <div className="flex items-center gap-2 text-accent font-medium mb-4">
                        <Icon size={20} />
                        <span>{policy.category}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {policy.title}
                    </h1>

                    <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                        {policy.summary}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 max-w-4xl mx-auto">
                    {/* Metadata Bar */}
                    <div className="flex flex-wrap gap-6 border-b border-gray-100 pb-8 mb-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{publishedLabel}: Jan 7, 2026</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Tag size={16} />
                            <span>{policy.category}</span>
                        </div>
                        <button className="flex items-center gap-2 ml-auto text-primary hover:text-blue-700 font-medium transition-colors">
                            <Share2 size={16} />
                            {shareLabel}
                        </button>
                    </div>

                    {/* HTML Content / Portable Text */}
                    <div className="prose prose-lg prose-slate hover:prose-a:text-primary max-w-none">
                        {Array.isArray(policy.content) ? (
                            <PortableText value={policy.content} />
                        ) : (
                            // Fallback if somehow it's string (legacy mock data structure vs new sanity return)
                            <div dangerouslySetInnerHTML={{ __html: policy.content as string }} />
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
