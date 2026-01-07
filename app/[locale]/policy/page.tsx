import React from "react";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { POLICIES_QUERY, SITE_CONTENT_QUERY } from "@/sanity/lib/queries";
import { Policy } from "@/app/lib/cms-data";
import PolicyCard from "@/app/components/PolicyCard";
import Marquee from "@/app/components/Marquee";

type Props = {
    params: Promise<{ locale: string }>;
};

interface SiteContent {
    policiesTitle: string;
    policiesSubtitle: string;
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const content = await client.fetch<SiteContent>(SITE_CONTENT_QUERY, { lang: locale });

    return {
        title: `${content?.policiesTitle || 'Policies'} | Relife`,
        description: "Our vision for a new Thammasat. Explore our policies on Education, Environment, and more.",
    };
}

const KEYWORDS = [
    "Education for All",
    "Green University",
    "Transparent Governance",
    "Student Welfare",
    "Career Readiness",
    "Community Engagement",
    "Equal Rights",
    "Innovation",
];

export default async function PolicyPage({ params }: Props) {
    const { locale } = await params;
    const [policies, content] = await Promise.all([
        client.fetch<Policy[]>(POLICIES_QUERY, { lang: locale }),
        client.fetch<SiteContent>(SITE_CONTENT_QUERY, { lang: locale }),
    ]);

    const policiesTitle = content?.policiesTitle || (locale === 'th' ? 'นโยบาย' : 'Policies');
    const policiesSubtitle = content?.policiesSubtitle || (locale === 'th'
        ? 'เราเชื่อในการแก้ปัญหาจริง ด้วยนโยบายที่เป็นรูปธรรม'
        : 'We believe in practical solutions for real problems.');

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="pt-24 pb-12 px-4 container mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter text-slate-900">
                    {policiesTitle}
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    {policiesSubtitle}
                </p>
            </section>

            {/* Marquee */}
            <section className="mb-20">
                <Marquee items={KEYWORDS} speed={40} />
            </section>

            {/* Policy Grid */}
            <section className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {policies.map((policy) => (
                        <div key={policy._id || policy.id} className="h-80">
                            <PolicyCard policy={policy} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
