import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import PolicyMarquee from "@/app/components/PolicyMarquee";
import HeroSection from "@/app/components/HeroSection";
import MapSection from "@/app/components/MapSection";
import { client } from "@/sanity/lib/client";
import { SITE_CONTENT_QUERY, POLICIES_QUERY } from "@/sanity/lib/queries";
import { Policy } from "@/app/lib/cms-data";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaLearnMore: string;
  ctaMeetTeam: string;
  heroMedia?: any;
  heroMediaAlt?: string;
  enableParallax?: boolean;
  marqueeKeywords: string[];
  features: { title: string; description: string }[];
}

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const [content, policies] = await Promise.all([
    client.fetch<SiteContent>(SITE_CONTENT_QUERY, { lang: locale }),
    client.fetch<Policy[]>(POLICIES_QUERY, { lang: locale }),
  ]);

  // Fallback values if CMS content is not available
  const heroTitle = content?.heroTitle || (locale === 'th' ? 'ชีวิตใหม่ ธรรมศาสตร์ใหม่' : 'New Life, New Thammasat');
  const heroSubtitle = content?.heroSubtitle || (locale === 'th' ? 'พรรคปฏิรูปธรรมศาสตร์ เพื่อนักศึกษา โดยนักศึกษา' : 'Relife Party for the Students, by the Students.');
  const ctaLearnMore = content?.ctaLearnMore || (locale === 'th' ? 'เรียนรู้เพิ่มเติม' : 'Learn More');
  const ctaMeetTeam = content?.ctaMeetTeam || (locale === 'th' ? 'พบทีมงาน' : 'Meet the Team');
  // const marqueeKeywords = content?.marqueeKeywords?.length > 0
  //   ? content.marqueeKeywords
  //   : ["Equality", "Sustainability", "Transparency", "Innovation", "Inclusion", "Democracy", "Welfare", "Progress"];
  const features = content?.features?.length > 0
    ? content.features
    : [
      { title: locale === 'th' ? 'การเปลี่ยนแปลงจริง' : 'Real Change', description: locale === 'th' ? 'เรามีแผนที่เป็นรูปธรรมเพื่อพัฒนาชีวิตนักศึกษา' : 'We have concrete plans to improve student life.' },
      { title: locale === 'th' ? 'เสียงของคุณ' : 'Your Voice', description: locale === 'th' ? 'พรรคที่ฟังเสียงนักศึกษาอย่างแท้จริง' : 'A party that truly listens to students.' },
      { title: locale === 'th' ? 'พร้อมสู่อนาคต' : 'Future Ready', description: locale === 'th' ? 'เตรียมธรรมศาสตร์สู่อนาคตด้วยนโยบายที่ทันสมัย' : 'Preparing Thammasat for the future.' },
    ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        ctaLearnMore={ctaLearnMore}
        ctaMeetTeam={ctaMeetTeam}
        heroMedia={content?.heroMedia}
        heroMediaAlt={content?.heroMediaAlt}
        enableParallax={content?.enableParallax}
      />

      {/* Marquee Section */}
      <div className="bg-[#0B1527] overflow-hidden relative">
        <div className="relative z-10">
          <PolicyMarquee policies={policies} speed={60} />
        </div>
      </div>

      {/* Interactive Map Section */}
      <MapSection locale={locale} />

      {/* Brief feature section to fill space */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center text-slate-900">
          {features.map((feature, index) => (
            <div key={index} className="px-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 md:mb-4">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
