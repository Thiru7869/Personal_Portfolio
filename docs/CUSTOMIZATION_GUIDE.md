# Customization Guide

How to change every kind of content on the site. All examples are real —
open the file and you'll find the same shapes.

The golden rule: **content lives in `frontend/src/content/` and
`frontend/src/config/`, never inside components.** TypeScript checks every
edit; if the site builds, your edit is structurally valid.

After any edit: the dev server hot-reloads instantly; production updates on
your next `git push`.

---

## Personal details (name, email, phone, socials, availability)

File: `frontend/src/config/site.ts`

- `name`, `shortName`, `roles`, `tagline`, `location`
- `email`, `phone`, `whatsapp` (digits only, country code, no `+`)
- `available` / `availabilityText` — the green hero badge
- `resumeUrl` — points at `public/resume/Thiru-Resume.pdf` by default
- `meetingUrl` — your Cal.com/Calendly link for **Book Meeting**
- `heroStats` — the four numbers in the hero
- `socialLinks` — GitHub, LinkedIn, X (Twitter), LeetCode, Email, WhatsApp, Phone

This one file feeds the hero, contact section, footer, terminal, AI
assistant, and SEO metadata.

## The About story

File: `frontend/src/content/profile.ts`

- `aboutParagraphs` — the four paragraphs, rendered in order. Write like
  you talk; this is the most-read text on the site.
- `heroTypingLines` — the rotating typed roles in the hero.
- `shortBio` — one paragraph used for SEO descriptions and the AI assistant.

## Projects

File: `frontend/src/content/projects.ts`

Copy an existing entry and edit. Required fields worth care:

- `slug` — unique, kebab-case (used for analytics)
- `featured: true` — shows the ★ badge; keep 2–3 featured
- `problem` / `solution` / `architecture` / `challenges` / `learnings` —
  these fill the Quick View modal; recruiters read these
- `github`, `liveDemo`, `caseStudy` — all optional; buttons appear only
  when present

## Experience / internships

File: `frontend/src/content/experience.ts` — newest first. Each role has
`responsibilities` (what you did) and `achievements` (what changed because
you did it — keep numbers in these).

## Education

File: `frontend/src/content/education.ts` — institution, location, degree,
stream, duration, description. There is intentionally no GPA field.

## Skills

File: `frontend/src/content/skills.ts`

Add to the right group with a Wikipedia link (use the `wiki("Article_Name")`
helper) and a level: `Advanced`, `Proficient`, `Comfortable`, or `Learning`.
New groups: add an entry with an `icon` key and register the icon in
`components/sections/Skills.tsx` (`groupIcons` map).

## Blog posts

File: `frontend/src/content/blog/articles-*.ts`

Append an object with a unique `slug`, `publishDate` (`YYYY-MM-DD`),
`description`, `tags`, `category`, and an `articleBody` string — this
project's existing posts run short (roughly 80–110 words, one focused
idea each); write to whatever length actually serves the post. The page
at `/blog/<slug>`, the index card, the sitemap entry, and the AI
assistant's awareness of it all appear automatically on the next build.

## Q&A

File: `frontend/src/content/faq/faq-*.ts` — same pattern as blogs: unique `slug`,
`question`, `category`, markdown `answer`. New categories create their own
group on `/qa` automatically.

## Certificates

1. Drop the image (SVG/PNG/JPG, ~16:10 ratio looks best) into
   `frontend/public/certificates/` — or upload to Cloudinary and use the
   full URL.
2. Add the entry in `frontend/src/content/certificates.ts` (`image` is the
   path/URL; `url` is the optional Verify link).

## Research paper

File: `frontend/src/content/research.ts` — title, venue, year, status,
abstract, contributions, keywords, citation. Replace
`frontend/public/research/paper.pdf` with the real PDF (keep the filename,
or update `downloadUrl`).

## Resume

Replace `frontend/public/resume/Thiru-Resume.pdf` (keep the filename, or
update `resumeUrl` in `site.ts`). The hero button, terminal `resume`
command, and command palette all use it.

## Testimonials

File: `frontend/src/content/testimonials.ts` — quote, name, role. Three
good ones beat ten generic ones.

## What I Build (services)

File: `frontend/src/content/services.ts` — title, description, icon key,
three bullet points. Icons map in `components/sections/Services.tsx`.

## AI assistant knowledge

File: `frontend/src/content/ai-knowledge.ts`

The knowledge base **compiles itself** from all the files above — edit a
project and the assistant knows immediately. For facts that fit nowhere
else (hobbies, FAQs, preferences), add lines to the `EXTRA_KNOWLEDGE`
string at the top. Tone and rules live in `assistantSystemPrompt`;
`suggestedQuestions` are the chips in the chat.

## Terminal commands

File: `frontend/src/lib/terminal-commands.ts`

Append to `COMMANDS`:

```ts
{
  name: "coffee",
  description: "Critical infrastructure status",
  run: () => ({ lines: ["☕ reserves: 82% — operational"] }),
},
```

`help`, Tab-completion, and "did you mean" pick it up automatically. The
`ctx` argument gives you `setMode`, `setAppearance`, `navigate`, `scrollTo`,
and `openUrl` for commands that do things.

## Navigation

File: `frontend/src/config/navigation.ts` — `navItems` (navbar, keep ≤ 7)
and `footerLinks`. Section targets must match ids in
`shared/constants.ts` → `SECTION_IDS`.

## Section order / removing a section

File: `frontend/src/app/(site)/page.tsx` — reorder or delete the component
lines. If you remove one permanently, also remove its id from
`SECTION_IDS` and any nav links pointing at it.

## Themes

See [THEME_GUIDE.md](THEME_GUIDE.md).
