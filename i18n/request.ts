import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically varies based on local or incoming request
    let locale = await requestLocale;

    // Ensure that the incoming locale is valid
    if (!locale || !['th', 'en'].includes(locale)) {
        locale = 'th';
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});
