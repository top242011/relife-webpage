import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { DEBATE_BY_SLUG_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import React from "react";

// Revalidate every hour
export const revalidate = 3600;

export default async function DebatePage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;

    // Fetch data
    const debate = await client.fetch(DEBATE_BY_SLUG_QUERY, { slug, lang: locale });

    if (!debate) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Link href="/progress" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-6">
                <ArrowLeft size={16} className="mr-1" /> Back to Progress
            </Link>

            <article>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{debate.title}</h1>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-8">
                    <Calendar size={16} />
                    {new Date(debate.date).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'long' })}
                </div>

                {debate.coverImage && (
                    // In a real app, use Sanity Image Builder here. For now, skipping image rendering logic or assuming URL helper
                    <div className="w-full h-64 bg-slate-200 rounded-xl mb-8"></div>
                )}

                <div className="prose prose-lg prose-slate max-w-none">
                    <PortableText value={debate.content} />
                </div>
            </article>
        </div>
    );
}
