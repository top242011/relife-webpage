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
  "campusLabel": campusLabel[$lang],
  memberCategory,
  isActive,
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
  education,
  workExperience,
  achievements,
  socialLinks
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
  "executiveTitle": executiveTitle[$lang],
  "partyListTitle": partyListTitle[$lang],
  
  // PoliciesPage
  "policiesTitle": policiesTitle[$lang],
  "policiesSubtitle": policiesSubtitle[$lang],
  "policiesReadMore": policiesReadMore[$lang],
  "policiesBack": policiesBack[$lang],
  
  // Common
  "commonShare": commonShare[$lang],
  "commonPublished": commonPublished[$lang]
}`);

export const PROGRESS_PAGE_QUERY = defineQuery(`{
  "policies": * [_type == "policy"]{
  _id,
  "title": title[$lang],
  "slug": slug.current,
  "category": category[$lang],
  "summary": summary[$lang],
  iconName,
  progress,
  policyType,
  campus
},
  "meetings": * [_type == "meeting"] | order(date desc){
  _id,
  title,
  date,
  type,
  campus,
  attendees[]{
    status,
    member-> { _id, "name": name[$lang] }
},
  votes[]{
  title,
  results[]{
    vote,
    member-> { _id, "name": name[$lang], image }
}
    },
motions[]{
  title,
    proposer -> { _id, "name": name[$lang] }
}
  },
"debates": * [_type == "debate"] | order(date desc)[0...4]{
  _id,
    "title": title[$lang],
      "slug": slug.current,
        "summary": summary[$lang],
          date,
          coverImage
}
}`);

export const DEBATE_BY_SLUG_QUERY = defineQuery(`*[_type == "debate" && slug.current == $slug][0]{
  _id,
  "title": title[$lang],
  "date": date,
  "content": content[$lang],
  coverImage
}`);

export const MEMBER_STATS_QUERY = defineQuery(`{
  "meetings": * [_type == "meeting" && references($id)]{
  _id,
  title,
  date,
  type,
  "attendance": attendees[member._ref == $id][0].status
},
  "votes": * [_type == "meeting"]{
  _id,
  title,
  date,
  votes[]{
    title,
    "myVote": results[member._ref == $id][0].vote
  }
},
  "motions": * [_type == "meeting"]{
  _id,
  title,
  date,
  motions[proposer._ref == $id]{
    title
  }
}
}`);
