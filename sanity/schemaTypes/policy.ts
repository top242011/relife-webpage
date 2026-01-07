import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'policy',
    title: 'Policy',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'localeString',
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title.th',
                maxLength: 96,
            },
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'localeString',
        }),
        defineField({
            name: 'summary',
            title: 'Summary',
            type: 'localeText',
        }),
        defineField({
            name: 'content',
            title: 'Content',
            type: 'localeBlock',
        }),
        defineField({
            name: 'iconName',
            title: 'Icon Name (Lucide Icon slug)',
            type: 'string',
            description: 'e.g. graduation-cap, leaf, shield'
        }),
    ],
})
