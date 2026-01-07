import { defineQuery } from "next-sanity";

export const POLICIES_QUERY = defineQuery(`*[_type == "policy"]{
  _id,
  "title": title[$lang],
  "slug": slug.current,
  "category": category[$lang],
  "summary": summary[$lang],
  content,
  iconName
}`);

export const POLICY_BY_SLUG_QUERY = defineQuery(`*[_type == "policy" && slug.current == $slug][0]{
  _id,
  "title": title[$lang],
  "slug": slug.current,
  "category": category[$lang],
  "summary": summary[$lang],
  "content": content[$lang],
  iconName
}`);

export const CANDIDATES_QUERY = defineQuery(`*[_type == "candidate"] | order(number asc){
  _id,
  "name": name[$lang],
  number,
  campus,
  "position": position[$lang],
  image,
  "bio": bio[$lang],
  "vision": vision[$lang],
  education
}`);

export const CANDIDATE_BY_ID_QUERY = defineQuery(`*[_type == "candidate" && _id == $id][0]{
  _id,
  "name": name[$lang],
  number,
  campus,
  "position": position[$lang],
  image,
  "bio": bio[$lang],
  "vision": vision[$lang],
  education
}`);

export const SITE_CONTENT_QUERY = defineQuery(`*[_type == "siteContent"][0]{
  // Navbar
  "navHome": navHome[$lang],
  "navPolicies": navPolicies[$lang],
  "navCandidates": navCandidates[$lang],
  "navContact": navContact[$lang],
  "navJoin": navJoin[$lang],
  "campusRangsit": campusRangsit[$lang],
  "campusLampang": campusLampang[$lang],
  "campusThaPrachan": campusThaPrachan[$lang],
  
  // HomePage
  "heroTitle": heroTitle[$lang],
  "heroSubtitle": heroSubtitle[$lang],
  "ctaLearnMore": ctaLearnMore[$lang],
  "ctaMeetTeam": ctaMeetTeam[$lang],
  "marqueeKeywords": marqueeKeywords[][$lang],
  "features": features[]{
    "title": title[$lang],
    "description": description[$lang]
  },
  
  // CandidatesPage
  "candidatesTitle": candidatesTitle[$lang],
  "candidatesSubtitle": candidatesSubtitle[$lang],
  "candidatesAll": candidatesAll[$lang],
  "candidatesNotFound": candidatesNotFound[$lang],
  
  // PoliciesPage
  "policiesTitle": policiesTitle[$lang],
  "policiesSubtitle": policiesSubtitle[$lang],
  "policiesReadMore": policiesReadMore[$lang],
  "policiesBack": policiesBack[$lang],
  
  // Common
  "commonShare": commonShare[$lang],
  "commonPublished": commonPublished[$lang]
}`);
