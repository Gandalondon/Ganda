// Saves the published Storyblok content to content-snapshot/ so it can be read
// offline (and by Claude, to test against the real copy). No dependencies.
// Run from the project root:  npm run snapshot
// Reads NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN from .env.local (or the environment).
// Add --draft to include unpublished changes.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";

function envToken() {
  if (process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN)
    return process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN;
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN\s*=\s*(.*)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  }
  return "";
}

const token = envToken();
if (!token) {
  console.error("No NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN found in .env.local.");
  process.exit(1);
}
const version = process.argv.includes("--draft") ? "draft" : "published";
const base = process.env.STORYBLOK_API || "https://api.storyblok.com";
const out = "content-snapshot";

const stories = [];
for (let page = 1; ; page++) {
  const url = `${base}/v2/cdn/stories?token=${encodeURIComponent(token)}&version=${version}&per_page=100&page=${page}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Storyblok answered ${res.status} on page ${page}. Check the token.`);
    process.exit(1);
  }
  const data = await res.json();
  stories.push(...data.stories);
  const total = Number(res.headers.get("total") || stories.length);
  if (data.stories.length === 0 || stories.length >= total) break;
}

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "stories.json"), JSON.stringify(stories, null, 2));
for (const s of stories) {
  const file = join(out, "stories", `${s.full_slug}.json`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(s, null, 2));
}
writeFileSync(
  join(out, "_info.json"),
  JSON.stringify({ version, count: stories.length, savedAt: new Date().toISOString() }, null, 2),
);
console.log(`Saved ${stories.length} ${version} stories to ${out}/`);
