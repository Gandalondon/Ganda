import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Nav from "@/components/Nav";
import ClosingCta from "@/components/ClosingCta";
import FadeUp from "@/components/FadeUp";
import StoryblokProvider from "@/components/StoryblokProvider";
import { SITE_DESCRIPTION } from "@/lib/seo";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Ganda — Tony Goff-Yu",
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://gandalondon.com"),
  openGraph: {
    title: "Ganda — Tony Goff-Yu",
    description: SITE_DESCRIPTION,
    url: "https://gandalondon.com",
    siteName: "Ganda",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ganda — Tony Goff-Yu",
    description: SITE_DESCRIPTION,
  },
};

// Master switch for the scroll fade-up (text and work grid tiles). Set to
// false to turn the whole effect off; nothing else needs to change.
const FADE_ENABLED = true;

// How things reveal as they scroll in. "blur": text, images and tiles all
// start slightly blurred and sharpen, with no fade or movement. "rise": text
// fades up (opacity and a 12px rise) while images and tiles still unblur.
const FADE_STYLE: "blur" | "rise" = "blur";

// Runs before first paint so below-the-fold text starts hidden without a
// flash. Skipped for reduced motion and inside iframes (Storyblok editor).
// The 4s fallback un-hides everything if the app script never starts.
const FADE_BOOT = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||window.top!==window)return;d.classList.add("gd-fade");${FADE_STYLE === "blur" ? 'd.classList.add("gd-fade-blur");' : ""}setTimeout(function(){if(!window.__gdFade)d.classList.remove("gd-fade")},4000)}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={dmSans.className} suppressHydrationWarning>
      <head>
        {FADE_ENABLED && (
          <script dangerouslySetInnerHTML={{ __html: FADE_BOOT }} />
        )}
      </head>
      <body>
        <StoryblokProvider>
          <a href="#main" className="gd-skip">
            Skip to content
          </a>
          <Nav />
          {children}
          <ClosingCta />
          {FADE_ENABLED && <FadeUp />}
          <Analytics />
          <SpeedInsights />
        </StoryblokProvider>
      </body>
    </html>
  );
}
