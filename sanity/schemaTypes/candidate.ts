import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'candidate',
    title: 'Candidate',
    type: 'document',
    fields: [
        defineField({
            name: 'name',
            title: 'Name',
            type: 'localeString',
        }),
        defineField({
            name: 'number',
            title: 'Candidate Number',
            type: 'number',
        }),
        defineField({
            name: 'position',
            title: 'Position',
            type: 'localeString',
        }),
        defineField({
            name: 'campus',
            title: 'Campus',
            type: 'string',
            options: {
                list: [
                    { title: 'Rangsit', value: 'Rangsit' },
                    { title: 'Lampang', value: 'Lampang' },
                    { title: 'Tha Prachan', value: 'Tha Prachan' },
                ]
            }
        }),
        defineField({
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'bio',
            title: 'Biography',
            type: 'localeText',
        }),
        defineField({
            name: 'vision',
            title: 'Vision Quote',
            type: 'localeText',
        }),
        defineField({
            name: 'education',
            title: 'Education',
            type: 'array',
            of: [{ type: 'string' }]
        })
    ],
})
