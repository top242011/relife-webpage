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
            name: 'memberCategory',
            title: 'Member Category',
            type: 'string',
            options: {
                list: [
                    { title: 'คณะกรรมการบริหาร (Executive)', value: 'executive' },
                    { title: 'สมาชิกสภาแบบบัญชีรายชื่อ (Party List)', value: 'partyList' },
                ],
                layout: 'radio',
            },
            initialValue: 'partyList',
        }),
        defineField({
            name: 'isActive',
            title: 'Active Status (ดำรงตำแหน่งอยู่)',
            description: 'Uncheck if this member is no longer in position. Their photo will appear in grayscale.',
            type: 'boolean',
            initialValue: true,
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
            name: 'campusLabel',
            title: 'Campus Label (Thai Display)',
            type: 'localeString',
            description: 'Thai label for campus badge (e.g., รังสิต, ลำปาง, ท่าพระจันทร์)',
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
        }),
        defineField({
            name: 'workExperience',
            title: 'Work Experience',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'achievements',
            title: 'Achievements',
            type: 'array',
            of: [{ type: 'string' }]
        }),
        defineField({
            name: 'socialLinks',
            title: 'Social Media Links',
            type: 'object',
            fields: [
                defineField({
                    name: 'facebook',
                    title: 'Facebook URL',
                    type: 'url',
                }),
                defineField({
                    name: 'instagram',
                    title: 'Instagram URL',
                    type: 'url',
                }),
                defineField({
                    name: 'twitter',
                    title: 'Twitter/X URL',
                    type: 'url',
                }),
                defineField({
                    name: 'tiktok',
                    title: 'TikTok URL',
                    type: 'url',
                }),
            ]
        })
    ],
    preview: {
        select: {
            title: 'name.th',
            subtitle: 'position.th',
            media: 'image',
        },
    },
})
