# shared/

Code shared across the whole project — imported by frontend components,
content files, and API routes alike via the `@shared/*` alias.

| File | Contents |
| --- | --- |
| `types.ts` | The content model (Project, ExperienceItem, BlogPost, QAItem, ThemeDefinition, …) and API payload shapes (ContactPayload, RatingSummary, ChatMessage). **Add new fields here first** — the compiler then walks you through every file that must change. |
| `constants.ts` | Homepage `SECTION_IDS`, `THEME_IDS`, storage keys, and API `RATE_LIMITS`. |

Keeping these out of `frontend/src` is deliberate: they describe the
*project's* data language, not the UI. The SQL schema in
`backend/supabase/schema.sql` and the zod schemas in the API routes both
mirror these types — when you change one, change all three together.
