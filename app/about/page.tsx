import { getStory } from "@/lib/storyblok";

const DEFAULT_BIO = [
  "I've worked both agency and client-side, helping organisations understand customer behaviour and create better digital experiences through research, design and experimentation.",
  "Over the years I've worked across a broad range of sectors including automotive (BMW, FINN, General Motors, Toyota), retail (Adidas, Gap), technology (Google, Sony), finance (Barclays, NatWest), consultancy (Ernst & Young, McKinsey) and energy (BP, Shell), as well as startups across fitness, media and gaming.",
  "My work spans branding, sites, applications and digital products, ranging from long-term product engagements to smaller consultancy projects. I also use AI-assisted tools to support research, content creation, brand audits and photography where appropriate.",
  "Alongside my design work, I co-run Goff-Yu with my wife Vanessa, where we help businesses with design, marketing and digital projects.",
  "If there's a project that you would like help with let's talk.",
];

export default async function AboutPage() {
  const story = await getStory("about").catch(() => null);
  const content = story?.content ?? {};

  const paras: string[] = content.bio
    ? content.bio.split("\n\n").filter(Boolean)
    : DEFAULT_BIO;

  return (
    <div
      style={{ maxWidth: "720px", margin: "0 auto", padding: "64px 24px 96px" }}
    >
      {paras.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: "clamp(1.25rem, 3vw, 2.25rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            marginBottom: "1.5em",
          }}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
