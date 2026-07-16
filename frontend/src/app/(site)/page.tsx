import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Journey } from "@/components/sections/Journey";
import { Terminal } from "@/components/sections/Terminal";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Activity } from "@/components/sections/Activity";
import { Research } from "@/components/sections/Research";
import { Certificates } from "@/components/sections/Certificates";
import { Services } from "@/components/sections/Services";
import { Now } from "@/components/sections/Now";
import { Testimonials } from "@/components/sections/Testimonials";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { Rating } from "@/components/sections/Rating";
import { Insights } from "@/components/sections/Insights";
import { Contact } from "@/components/sections/Contact";
import { Outro } from "@/components/sections/Outro";
import { StoryBridge } from "@/components/ui/StoryBridge";
import { StorySpine } from "@/components/layout/StorySpine";
import { site, socialLinks } from "@/config/site";
import { shortBio } from "@/content/profile";
import { researchPaper } from "@/content/research";

/**
 * The single-page homepage — one continuous story in five acts:
 *
 *   I    Arrival        Hero (intro loader hands off here)
 *   II   Who I am       About → Journey (work + study, one timeline)
 *   III  What I can do  Skills → Projects → Terminal → Activity
 *   IV   Depth          Research → Achievements → Services → Now
 *   V    Connect        Testimonials → FAQ → Feedback → Stats →
 *                       Contact → Outro (the ending)
 *
 * StoryBridges narrate the act changes; StorySpine draws the
 * journey down the left edge on wide screens. Section order is
 * defined here — content lives in src/content/.
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
    url: researchPaper.publicationUrl,
    sameAs: [researchPaper.publicationUrl],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([personJsonLd, websiteJsonLd, paperJsonLd]),
        }}
      />
      <StorySpine />
      <Hero />

      {/* Act II — who I am */}
      <StoryBridge text="First, the person behind the code." />
      <About />
      <Journey />

      {/* Act III — what I can do */}
      <StoryBridge text="Skills are claims. Projects are proof." />
      <Skills />
      <Projects />
      <Terminal />
      <Activity />

      {/* Act IV — depth */}
      <StoryBridge text="Beyond the features: research, credentials, and what I offer." />
      <Research />
      <Certificates />
      <Services />
      <Now />

      {/* Act V — connect */}
      <StoryBridge text="You've seen the work. Let's talk." />
      <Testimonials />
      <FaqPreview />
      <Rating />
      <Insights />
      <Contact />
      <Outro />
    </>
  );
}
