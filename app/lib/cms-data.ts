import { BookOpen, Users, Leaf, Briefcase, GraduationCap, Heart, Shield } from "lucide-react";

export interface NavbarLink {
  label: string;
  href: string;
  subLinks?: NavbarLink[];
}

export const NAV_LINKS: NavbarLink[] = [
  {
    label: "Policy",
    href: "/policy",
  },
  {
    label: "Candidates",
    href: "/candidates",
    subLinks: [
      { label: "Rangsit", href: "/candidates/rangsit" },
      { label: "Lampang", href: "/candidates/lampang" },
      { label: "Tha Prachan", href: "/candidates/tha-prachan" },
    ],
  },
  {
    label: "Achievements",
    href: "/achievements",
  },
  {
    label: "News",
    href: "/news",
  },
];

export interface Policy {
  _id?: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string | any[]; // HTML content or Portable Text
  iconName: string; // Lucide icon name
  whySection?: any[];
  whatSection?: any[];
  howSection?: any[];
  heroImage?: any;
  tagline?: string;
  campus?: string;
  policyType?: string;
}

export const POLICIES: Policy[] = [
  {
    id: "1",
    slug: "education-reform",
    title: "Education for All",
    category: "Education",
    summary: "Reframing the university experience to be inclusive, accessible, and modern for every student.",
    content: `
      <p class='mb-4'>We believe that education is a fundamental right, not a privilege. Our "Education for All" policy focuses on three key pillars:</p>
      <ul class='list-disc pl-6 space-y-2 mb-6'>
        <li><strong>Accessibility:</strong> Ensuring all campus facilities and digital platforms are fully accessible to students with disabilities.</li>
        <li><strong>Affordability:</strong> Reducing hidden costs in tuition and providing more scholarship opportunities for students in need.</li>
        <li><strong>Modernization:</strong> upgrading classrooms with smart technology and providing free, high-speed internet access across all dormitories.</li>
      </ul>
      <p>By implementing these changes, we aim to create a learning environment where every student can thrive, regardless of their background or physical abilities.</p>
    `,
    iconName: "graduation-cap",
  },
  {
    id: "2",
    slug: "green-university",
    title: "Green University",
    category: "Environment",
    summary: "Transforming Thammasat into a sustainable, eco-friendly campus with net-zero goals.",
    content: `
      <p class='mb-4'>Climate change is the defining challenge of our time. Relife is committed to making Thammasat a leader in sustainability.</p>
      <h3 class='text-xl font-bold mb-3 mt-6'>Our Action Plan</h3>
      <ul class='list-disc pl-6 space-y-2 mb-6'>
        <li><strong>Renewable Energy:</strong> Installing solar panels on all major university buildings to reduce reliance on the grid.</li>
        <li><strong>Waste Reduction:</strong> Implementing a campus-wide single-use plastic ban and improving recycling infrastructure.</li>
        <li><strong>Green Spaces:</strong> Expanding park areas and planting 1,000 new trees across Rangsit and Lampang campuses.</li>
      </ul>
    `,
    iconName: "leaf",
  },
  {
    id: "3",
    slug: "transparent-governance",
    title: "Transparent Governance",
    category: "Politics",
    summary: "Open budget tracking and student participation in university decision-making processes.",
    content: `
      <p class='mb-4'>Transparency is the foundation of trust. We propose a radical shift in how the university administration operates.</p>
      <p class='mb-4'>Our "Open Data" initiative will require the publication of annual budget reports in a machine-readable format.</p>
      <p>Furthermore, we advocate for student representatives to have a voting seat on the University Council, ensuring that the student voice is not just heard, but heeded.</p>
    `,
    iconName: "shield",
  },
  {
    id: "4",
    slug: "student-welfare",
    title: "Enhanced Welfare",
    category: "Welfare",
    summary: "Better mental health support, quality dormitory living, and affordable campus food.",
    content: `
      <p class='mb-4'>Student well-being is our top priority. We plan to overhaul the current welfare system.</p>
      <ul class='list-disc pl-6 space-y-2 mb-6'>
        <li><strong>Mental Health:</strong> Increasing the number of counselors and reducing waiting times for appointments.</li>
        <li><strong>Dormitories:</strong> Renovating older dorms and enforcing strict hygiene standards.</li>
        <li><strong>Food Quality:</strong> Subsidizing healthy meal options at all cafeterias.</li>
      </ul>
    `,
    iconName: "heart",
  },
  {
    id: "5",
    slug: "career-readiness",
    title: "Career Usage",
    category: "Economy",
    summary: "Bridging the gap between graduation and employment with real-world skills workshops.",
    content: `
      <p class='mb-4'>The job market is changing. We must prepare students for the future of work.</p>
      <p>We will partner with leading tech companies and NGOs to offer credit-bearing workshops on data science, digital marketing, and social entrepreneurship.</p>
    `,
    iconName: "briefcase",
  },
  {
    id: "6",
    slug: "community-engagement",
    title: "Local Community",
    category: "Social",
    summary: "Strengthening ties between the university and the surrounding communities.",
    content: `
      <p class='mb-4'>Thammasat is part of a larger community. We will launch initiatives to support local businesses and address community issues such as traffic and drainage.</p>
    `,
    iconName: "users",
  },
];

export interface Candidate {
  _id?: string;
  id: string;
  name: string;
  number: number;
  campus: string;
  campusLabel?: string;
  memberCategory?: 'executive' | 'partyList';
  isActive?: boolean;
  image: any;
  bio?: string;
  education?: string[];
  vision?: string;
  position: string;
  workExperience?: string[];
  achievements?: string[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
}

export const candidatesByProvince: Record<string, { provinceName: string, campus: string, candidates: Candidate[] }> = {
  // กรุงเทพมหานคร (ท่าพระจันทร์)
  "TH-10": {
    provinceName: "กรุงเทพมหานคร",
    campus: "Dhamma Prachan",
    candidates: [
      {
        id: "c1",
        name: "นายธรรม ศาสตร์",
        number: 1,
        image: "/candidate-1.png",
        position: "หัวหน้าทีม",
        campus: "Tha Prachan",
        bio: "Dedicated leader with a focus on student rights.",
        education: ["Bachelor of Laws"],
        vision: "Transparency and Integrity"
      },
      {
        id: "c2",
        name: "นางสาวการ เมือง",
        number: 2,
        image: "/candidate-2.png",
        position: "รองหัวหน้า",
        campus: "Tha Prachan",
        bio: "Advocate for policy reform.",
        education: ["Political Science"],
        vision: "Equality for all"
      },
    ]
  },
  // ปทุมธานี (รังสิต)
  "TH-13": {
    provinceName: "ปทุมธานี",
    campus: "Rangsit",
    candidates: [
      {
        id: "c3",
        name: "นายรัก ดี",
        number: 3,
        image: "/candidate-1.png",
        position: "ผู้สมัครเขต 1",
        campus: "Rangsit",
        bio: "Community organizer.",
        education: ["Economics"],
        vision: "Sustainable development"
      },
      {
        id: "c4",
        name: "นางสาวเรียน เด่น",
        number: 4,
        image: "/candidate-2.png",
        position: "ผู้สมัครเขต 2",
        campus: "Rangsit",
        bio: "Academic excellence promoter.",
        education: ["Engineering"],
        vision: "Innovation in education"
      },
    ]
  },
  // ลำปาง (ศูนย์ลำปาง)
  "TH-52": {
    provinceName: "ลำปาง",
    campus: "Lampang",
    candidates: [
      {
        id: "c5",
        name: "นายรถ ม้า",
        number: 5,
        image: "/candidate-3.png",
        position: "ผู้สมัคร",
        campus: "Lampang",
        bio: "Local representative.",
        education: ["Arts"],
        vision: "Preserving culture"
      },
    ]
  }
};

export const CANDIDATES: Candidate[] = Object.values(candidatesByProvince).flatMap(p => p.candidates);
