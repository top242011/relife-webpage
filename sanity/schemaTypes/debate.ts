import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'debate',
    title: 'Debate / Article',
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
            name: 'date',
            title: 'Date',
            type: 'datetime',
        }),
        defineField({
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true }
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
            name: 'relatedMembers',
            title: 'Related Members',
            type: 'array',
            of: [{ type: 'reference', to: [{ type: 'candidate' }] }],
        }),
    ],
})
