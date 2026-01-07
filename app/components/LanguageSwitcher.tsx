'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { ChangeEvent, useTransition } from 'react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const nextLocale = e.target.value;
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale });
        });
    };

    return (
        <select
            defaultValue={locale}
            className="bg-transparent border border-slate-200 rounded text-sm py-1 px-2 text-slate-600 focus:outline-none focus:border-primary"
            onChange={onSelectChange}
            disabled={isPending}
        >
            <option value="th">🇹🇭 TH</option>
            <option value="en">🇬🇧 EN</option>
        </select>
    );
}
