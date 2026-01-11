import { defineQuery } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { PROGRESS_PAGE_QUERY } from "@/sanity/lib/queries";
import ProgressClient from "@/app/components/ProgressClient";
import React from "react";

// Revalidate every hour
export const revalidate = 3600;

export default async function ProgressPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Fetch data
    const data = await client.fetch(PROGRESS_PAGE_QUERY, { lang: locale });

    return <ProgressClient data={data} locale={locale} />;
}
