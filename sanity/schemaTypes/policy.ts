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
            description: 'Legacy content field (optional)',
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'localeString',
            description: 'Short impactful text displayed in Hero section',
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image (Legacy)',
            type: 'image',
            description: '⚠️ ไม่ใช้แล้ว - ใช้ภาพด้านล่างแทน',
            options: {
                hotspot: true,
            },
            hidden: true,
        }),
        defineField({
            name: 'heroImageWide',
            title: 'Hero Image - หน้านโยบาย (16:9)',
            type: 'image',
            description: 'ภาพสำหรับแสดงในหน้านโยบาย (Policy Card) แนะนำขนาด 1920x1080 หรืออัตราส่วน 16:9',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'heroImageTall',
            title: 'Hero Image - หน้าแรก Marquee (9:16)',
            type: 'image',
            description: 'ภาพสำหรับแสดงใน Marquee หน้าแรก แนะนำขนาด 1080x1920 หรืออัตราส่วน 9:16',
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: 'whySection',
            title: 'Why Section (ทำไมต้องแก้ปัญหา)',
            type: 'localeBlock',
        }),
        defineField({
            name: 'whatSection',
            title: 'What Section (เราจะทำอะไร)',
            type: 'localeBlock',
        }),
        defineField({
            name: 'howSection',
            title: 'How Section (ทำอย่างไรให้สำเร็จ)',
            type: 'localeBlock',
        }),
        defineField({
            name: 'iconName',
            title: 'Icon Name (Lucide Icon slug)',
            type: 'string',
            description: 'e.g. graduation-cap, leaf, shield'
        }),
        defineField({
            name: 'progress',
            title: 'Progress (%)',
            type: 'number',
            options: {
                list: [0, 25, 50, 75, 100],
            },
            initialValue: 0,
        }),
        defineField({
            name: 'policyType',
            title: 'Policy Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Central (ส่วนกลาง)', value: 'central' },
                    { title: 'Center (ศูนย์)', value: 'center' },
                ],
                layout: 'radio',
            },
            initialValue: 'central',
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
                ],
            },
            hidden: ({ document }) => document?.policyType !== 'center',
        }),
    ],
})
