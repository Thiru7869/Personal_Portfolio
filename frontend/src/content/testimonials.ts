import type { Testimonial } from "@shared/types";

/**
 * src/content/testimonials.ts
 * ------------------------------------------------------------
 * Quotes from people you've worked with.
 *
 * IMPORTANT: entries with `placeholder: true` are illustrative
 * only and are NEVER shown on the site (the section filters them
 * out). They exist as a template. When you collect a REAL,
 * attributable quote from a named person, add it WITHOUT the
 * placeholder flag (or set it to false) and it will appear.
 * Three genuine quotes beat ten generic ones.
 */

export const testimonials: Testimonial[] = [
  {
    id: "guide-template",
    quote:
      "What set Thiru apart during the ECG research was his refusal to accept a good number he couldn't explain. He rebuilt our evaluation twice because the results felt too clean — and he was right both times.",
    name: "Research Guide",
    role: "Dept. of CSE, Annamacharya Institute of Technology and Sciences",
    placeholder: true,
  },
  {
    id: "client-template",
    quote:
      "He built our web app alone — API, dashboard, deployment, everything — and explained each decision in plain language. When something broke after launch, he had it fixed before most developers would have replied to the email.",
    name: "Freelance Client",
    role: "Small-business web project",
    placeholder: true,
  },
  {
    id: "peer-template",
    quote:
      "Thiru is the person our batch went to when a project was stuck. Not because he always knew the answer, but because he wouldn't stop until the error message made sense.",
    name: "Project Teammate",
    role: "B.Tech CSE, AITS Tirupati",
    placeholder: true,
  },
];

/** Only genuine, attributable testimonials — the site shows these. */
export const genuineTestimonials = testimonials.filter((t) => !t.placeholder);
