import { defineType, defineField } from 'sanity'

const supportedLanguages = [
    { id: 'th', title: 'Thai', isDefault: true },
    { id: 'en', title: 'English' },
]

export default defineType({
    title: 'Localized Text',
    name: 'localeText',
    type: 'object',
    fieldsets: [
        {
            title: 'Translations',
            name: 'translations',
            options: { collapsible: true }
        }
    ],
    fields: supportedLanguages.map(lang =>
        defineField({
            title: lang.title,
            name: lang.id,
            type: 'text',
            fieldset: lang.isDefault ? undefined : 'translations'
        })
    )
})
