# Ways of working (Ganda)

Read this before starting work on the site. Short version: content changes never need a deploy; code changes are tried locally first and pushed only when they look right.

## Three kinds of change

1. **Content** (copy, images, new pages built from existing blocks): edit in Storyblok and publish. The site updates through the revalidate webhook. No GitHub, no Vercel.
2. **Code or design** (layout, type, spacing, nav): work on a branch, check it locally, then push. Vercel builds a preview for every branch push. Merge to `main` to go live.
3. **Schema** (a new field or block in Storyblok that the code reads): add the field in Storyblok first, then ship code that reads it with a fallback (the live site must keep working while the field is empty), then fill in the content. Do this rarely.

## See it locally before pushing

On the Mac, in `~/Ganda`:

1. `npm install` (first time only).
2. Put the Storyblok preview token in `.env.local` as `NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=...` (Vercel, Settings, Environment Variables, or `npx vercel env pull .env.local`). Never commit this file.
3. `npm run dev`, then open http://localhost:3000. It reads the live Storyblok content, so content edits show on refresh and code edits show instantly.

If the dev server will not start, send Claude the first error. Do not fall back to pushing just to see a change.

## Content snapshot (for Claude)

`npm run snapshot` saves the published Storyblok content to `content-snapshot/` (ignored by git, no secrets in it). Claude uses it to test pages, case studies and copy against the real content instead of guessing. Run it before a design session and after big content changes. `npm run snapshot -- --draft` includes unpublished edits.

## Branches and git

- `main` is live. Keep a tag before big releases (for example `live-backup-YYYY-MM-DD`).
- One branch per piece of work. Separate commits for separate changes.
- Never commit `package-lock.json` changes, `_backup/`, `Claude outputs/` or `.claude/settings.local.json`.
- After every commit: push the branch to GitHub. Claude does this (see below); Tony does not need to.

## Rules for Claude

- Check `content-snapshot/` first. If it is missing or old, ask for a new one rather than guessing at copy.
- Edit files in `~/Ganda` directly when the link to the computer is up, so changes show on localhost.
- If the Mac is asleep or unreachable, do not give Tony scripts or terminal commands to run later. Prepare the work, say it is ready, and do it once the Mac is back. He is a designer, not a developer: keep every instruction to plain steps.
- Pushing: when Tony says push (or go live, ship it and so on), Claude pushes. The Mac has no GitHub login, so Claude commits on the Mac, pushes the same change to GitHub from its own session through Tony's GitHub connection, then lines the Mac branch up with GitHub (`git reset --keep origin/<branch>`). Branch pushes work. Tag pushes were refused on 10 Oct 2026 and pushing `main` is untested: if either is refused, give Tony the one line to paste, for example `cd ~/Ganda && git push origin main live-backup-2026-10-10`.
- Test at 320, 390, 768, 1024, 1440, 1920 and 2560 wide. Run axe (WCAG AA), check keyboard focus, reduced motion and the text-spacing overrides.
- If Tony is repeating the same manual process several times (pushing to Vercel to preview, re-checking the same page by hand, copying the same values around), say so and suggest the better way. Do not wait to be asked.
- Copy rules: UK English, no em dashes, "site" not "website", no "'d" contractions.
- Type and spacing come from the scale in `app/globals.css` (`--u`, `--type-display`, `--gd-statement-gap`). Do not hard-code new sizes.
- Text rules built in to `lib/inline.tsx`: no single-word last lines and no line breaks inside hyphenated words. Use `typeset` for plain text statements.

## Before going live

Run the checks above plus: Lighthouse (production build), titles and descriptions on every page, sitemap, 404, and a look at one case study on a real phone and in Safari. Confirm the Storyblok revalidate webhook is set up.
