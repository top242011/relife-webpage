import { defineField, defineType } from 'sanity';

export const siteContent = defineType({
    name: 'siteContent',
    title: 'Site Content',
    type: 'document',
    groups: [
        { name: 'navbar', title: 'Navbar' },
        { name: 'homepage', title: 'Home Page' },
        { name: 'candidates', title: 'Candidates Page' },
        { name: 'policies', title: 'Policies Page' },
        { name: 'common', title: 'Common' },
    ],
    fields: [
        // ===== NAVBAR =====
        defineField({
            name: 'navHome',
            title: 'Nav: Home',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'navPolicies',
            title: 'Nav: Policies',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'navCandidates',
            title: 'Nav: Candidates',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'navContact',
            title: 'Nav: Contact',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'navJoin',
            title: 'Nav: Join Us',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'campusRangsit',
            title: 'Campus: Rangsit',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'campusLampang',
            title: 'Campus: Lampang',
            type: 'localeString',
            group: 'navbar',
        }),
        defineField({
            name: 'campusThaPrachan',
            title: 'Campus: Tha Prachan',
            type: 'localeString',
            group: 'navbar',
        }),

        // ===== HOME PAGE =====
        defineField({
            name: 'heroTitle',
            title: 'Hero Title',
            type: 'localeString',
            group: 'homepage',
        }),
        defineField({
            name: 'heroSubtitle',
            title: 'Hero Subtitle',
            type: 'localeString',
            group: 'homepage',
        }),
        defineField({
            name: 'ctaLearnMore',
            title: 'CTA: Learn More',
            type: 'localeString',
            group: 'homepage',
        }),
        defineField({
            name: 'ctaMeetTeam',
            title: 'CTA: Meet the Team',
            type: 'localeString',
            group: 'homepage',
        }),
        defineField({
            name: 'marqueeKeywords',
            title: 'Marquee Keywords',
            type: 'array',
            of: [{ type: 'localeString' }],
            group: 'homepage',
        }),
        defineField({
            name: 'features',
            title: 'Feature Cards',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        defineField({
                            name: 'title',
                            title: 'Title',
                            type: 'localeString',
                        }),
                        defineField({
                            name: 'description',
                            title: 'Description',
                            type: 'localeText',
                        }),
                    ],
                },
            ],
            group: 'homepage',
        }),

        // ===== CANDIDATES PAGE =====
        defineField({
            name: 'candidatesTitle',
            title: 'Page Title',
            type: 'localeString',
            group: 'candidates',
        }),
        defineField({
            name: 'candidatesSubtitle',
            title: 'Page Subtitle',
            type: 'localeString',
            group: 'candidates',
        }),
        defineField({
            name: 'candidatesAll',
            title: 'Filter: All',
            type: 'localeString',
            group: 'candidates',
        }),
        defineField({
            name: 'candidatesNotFound',
            title: 'Not Found Message',
            type: 'localeString',
            group: 'candidates',
        }),
        defineField({
            name: 'executiveTitle',
            title: 'Executive Section Title',
            type: 'localeString',
            group: 'candidates',
        }),
        defineField({
            name: 'partyListTitle',
            title: 'Party List Section Title',
            type: 'localeString',
            group: 'candidates',
        }),

        // ===== POLICIES PAGE =====
        defineField({
            name: 'policiesTitle',
            title: 'Page Title',
            type: 'localeString',
            group: 'policies',
        }),
        defineField({
            name: 'policiesSubtitle',
            title: 'Page Subtitle',
            type: 'localeText',
            group: 'policies',
        }),
        defineField({
            name: 'policiesReadMore',
            title: 'Read More Button',
            type: 'localeString',
            group: 'policies',
        }),
        defineField({
            name: 'policiesBack',
            title: 'Back Button',
            type: 'localeString',
            group: 'policies',
        }),

        // ===== COMMON =====
        defineField({
            name: 'commonShare',
            title: 'Share Button',
            type: 'localeString',
            group: 'common',
        }),
        defineField({
            name: 'commonPublished',
            title: 'Published Label',
            type: 'localeString',
            group: 'common',
        }),
    ],
    preview: {
        prepare() {
            return {
                title: 'Site Content',
                subtitle: 'Global site settings and text',
            };
        },
    },
});
