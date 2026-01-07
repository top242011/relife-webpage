import { defineType, defineField } from 'sanity'

const supportedLanguages = [
    { id: 'th', title: 'Thai', isDefault: true },
    { id: 'en', title: 'English' },
]

export const baseLanguage = supportedLanguages.find(l => l.isDefault)

export default defineType({
    title: 'Localized String',
    name: 'localeString',
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
            type: 'string',
            fieldset: lang.isDefault ? undefined : 'translations'
        })
    )
})
