import { type SchemaTypeDefinition } from 'sanity'
import policy from './policy'
import candidate from './candidate'
import localeString from './localeString'
import localeText from './localeText'
import localeBlock from './localeBlock'
import { siteContent } from './siteContent'
import meeting from './meeting'
import debate from './debate'

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [policy, candidate, localeString, localeText, localeBlock, siteContent, meeting, debate],
}
