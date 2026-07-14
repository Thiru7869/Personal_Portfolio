import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Terminal } from "@/components/sections/Terminal";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Activity } from "@/components/sections/Activity";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Research } from "@/components/sections/Research";
import { Certificates } from "@/components/sections/Certificates";
import { Services } from "@/components/sections/Services";
import { Now } from "@/components/sections/Now";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { Rating } from "@/components/sections/Rating";
import { Insights } from "@/components/sections/Insights";
import { Contact } from "@/components/sections/Contact";
import { site, socialLinks } from "@/config/site";
import { shortBio } from "@/content/profile";
import { researchPaper } from "@/content/research";

/**
 * The single-page homepage. Section order is defined here —
 * each section component reads its content from src/content/.
 */
export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    alternateName: site.shortName,
    description: shortBio,
    email: `mailto:${site.email}`,
    url: site.url,
    jobTitle: site.roles,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    sameAs: socialLinks
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.shortName} — Portfolio`,
    url: site.url,
    author: { "@type": "Person", name: site.name },
  };

  const paperJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: researchPaper.title,
    author: researchPaper.authors.map((name) => ({ "@type": "Person", name })),
    datePublished: String(researchPaper.year),
    publisher: researchPaper.venue,
    abstract: researchPaper.abstract,
    keywords: researchPaper.keywords.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personJsonLd, websiteJsonLd, paperJsonLd]),
        }}
      />
      <Hero />
      <About />
      <Terminal />
      <Skills />
      <Projects />
      <Activity />
      <Experience />
      <Education />
      <Research />
      <Certificates />
      <Services />
      <Now />
      <Testimonials />
      <FaqPreview />
      <Rating />
      <Insights />
      <Contact />
    </>
  );
}
