# Ganda

Portfolio site for Tony Goff-Yu — [gandalondon.com](https://gandalondon.com)

## Stack

- Next.js 15 (App Router)
- TypeScript
- Storyblok CMS
- CSS custom properties
- Vercel

## Development

```bash
npx next dev -p 3000
```

Requires `.env.local` with:

```
NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=
REVALIDATE_SECRET=
```

## Deployment

Push to `main` — Vercel deploys automatically.
