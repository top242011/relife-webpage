import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Marquee from "@/app/components/Marquee";
import { client } from "@/sanity/lib/client";
import { SITE_CONTENT_QUERY } from "@/sanity/lib/queries";

interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaLearnMore: string;
  ctaMeetTeam: string;
  marqueeKeywords: string[];
  features: { title: string; description: string }[];
}

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 60;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const content = await client.fetch<SiteContent>(SITE_CONTENT_QUERY, { lang: locale });

  // Fallback values if CMS content is not available
  const heroTitle = content?.heroTitle || (locale === 'th' ? 'ชีวิตใหม่ ธรรมศาสตร์ใหม่' : 'New Life, New Thammasat');
  const heroSubtitle = content?.heroSubtitle || (locale === 'th' ? 'พรรคปฏิรูปธรรมศาสตร์ เพื่อนักศึกษา โดยนักศึกษา' : 'Relife Party for the Students, by the Students.');
  const ctaLearnMore = content?.ctaLearnMore || (locale === 'th' ? 'เรียนรู้เพิ่มเติม' : 'Learn More');
  const ctaMeetTeam = content?.ctaMeetTeam || (locale === 'th' ? 'พบทีมงาน' : 'Meet the Team');
  const marqueeKeywords = content?.marqueeKeywords?.length > 0
    ? content.marqueeKeywords
    : ["Equality", "Sustainability", "Transparency", "Innovation", "Inclusion", "Democracy", "Welfare", "Progress"];
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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image / Pattern would go here */}
        <div className="absolute inset-0 z-0 bg-slate-50">
          {/* Abstract shapes or image */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/4" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-slate-900 leading-[0.9]">
            {heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            {heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/policy" className="px-8 py-4 bg-primary text-white text-lg font-bold rounded-full hover:bg-blue-800 transition-all hover:scale-105 shadow-lg shadow-primary/20 flex items-center gap-2">
              {ctaLearnMore} <ArrowRight size={20} />
            </Link>
            <Link href="/candidates" className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 text-lg font-bold rounded-full hover:border-primary hover:text-primary transition-all">
              {ctaMeetTeam}
            </Link>
          </div>
        </div>

      </section>

      {/* Marquee Section */}
      <div className="py-10 bg-slate-900 text-white transform -rotate-2 scale-105 origin-left">
        <Marquee items={marqueeKeywords} speed={30} />
      </div>

      {/* Brief feature section to fill space */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center text-slate-900">
          {features.map((feature, index) => (
            <div key={index}>
              <h3 className="text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
