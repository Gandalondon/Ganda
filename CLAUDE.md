# Ganda

Portfolio site for Tony Goff.

## Project

- Repository: https://github.com/Gandalondon/Ganda.git
- Local: ~/Documents/ganda-next
- Production: https://gandalondon.com
- Preview: https://ganda-eta.vercel.app

This project is completely unrelated to FINN.

---

# Stack

- Next.js 15 (App Router)
- TypeScript
- Storyblok CMS
- CSS (custom properties and utility classes)
- Vercel deployment
- next/image

---

# Design Principles

- Minimal, content-first portfolio.
- Mobile first.
- Accessibility matters.
- Keep layouts clean and consistent.
- Prefer simple solutions over clever ones.
- Reuse existing components before creating new ones.
- Avoid unnecessary animations or dependencies.

---

# Content Style

- Use "site", never "website".
- Keep copy concise.
- Prefer "design" over "UX/UI" unless specifically required.
- Maintain a professional, understated tone.
- Reduce unnecessary words wherever possible.

---

# Architecture

## Root

app/layout.tsx

Contains the global layout and navigation.

## Pages

- Home: app/page.tsx
- About: app/about/page.tsx
- Project: app/work/[slug]/page.tsx

## Components

- Nav.tsx
- WorkGrid.tsx
- ProjectDetail.tsx
- BlurImage.tsx

## Storyblok

lib/storyblok.ts

Functions:

- getStory()
- getWorkProjects()

---

# Storyblok

Field keys are immutable.

Current conventions:

Page:

- bio
- clients
- thumbnail

Blocks:

text_block

- Title
- text
- image

image

- image

WorkGrid displays every story inside `work/`.

Stories without thumbnails are intentionally hidden.

Draft mode uses Storyblok Visual Editor.

---

# Project Decisions

- No project hero section.
- Project pages are built entirely from Storyblok blocks.
- text_block uses split layout.
- image blocks are full width.
- Missing thumbnail hides the project.
- Archive is handled through Storyblok.
- Navigation uses "Book a call" linking to Cal.com.
- Body and navigation use font weight 300.
- Headings use weight 400.

---

# Development

Start locally:

```bash
cd ~/Documents/ganda-next
npx next dev -p 3000
```

Deployment:

- Push to `main`
- Vercel deploys automatically

---

# Git Workflow

Before making changes always verify:

```bash
pwd
git branch
git status
```

Typical workflow:

```bash
git add .
git commit -m "Description"
git push origin main
```

---

# Current Priorities

1. Finish portfolio content.
2. Polish responsive layouts.
3. Complete Storyblok integration.
4. Launch gandalondon.com.
5. Performance and SEO improvements.

---

# Known Issues

- Domain propagation may still be completing.
- DKIM warning in Fasthosts (email only).
- Capabilities section is currently hardcoded.
- CLAUDE.md is intentionally local.

---

# Rules for Claude

- This repository is NOT related to FINN.
- Never reference files from another repository.
- Never invent filenames or folders.
- Search the repository before making assumptions.
- Verify files exist before suggesting edits.
- Keep solutions simple and maintainable.
- Prefer modifying existing components over creating new ones.
- Preserve the existing design language unless asked otherwise.
- If unsure, ask rather than guessing.