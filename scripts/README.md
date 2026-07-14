# scripts/

Utility scripts. Run from the repo root with Node — no dependencies needed.

| Script | What it does |
| --- | --- |
| `generate-assets.mjs` | Regenerates the stand-in binary assets the site links to: `frontend/public/resume/Thiru-Resume.pdf`, `frontend/public/research/paper.pdf`, and the six certificate SVGs in `frontend/public/certificates/`. Content comes from the same facts the site displays. |

```bash
node scripts/generate-assets.mjs
```

These generated files exist so every link on the site works from the first
deploy. **Replace them with your real resume PDF, published paper, and
certificate scans** — keep the same filenames and nothing else needs to
change.
