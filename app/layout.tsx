import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Nav from "@/components/Nav";
import ClosingCta from "@/components/ClosingCta";
import FadeUp from "@/components/FadeUp";
import BackToTop from "@/components/BackToTop";
import StoryblokProvider from "@/components/StoryblokProvider";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Ganda — Tony Goff-Yu",
  description: "Design, branding and digital experience.",
  metadataBase: new URL("https://gandalondon.com"),
  openGraph: {
    title: "Ganda — Tony Goff-Yu",
    description: "Design, branding and digital experience.",
    url: "https://gandalondon.com",
    siteName: "Ganda",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Ganda — Tony Goff-Yu",
    description: "Design, branding and digital experience.",
  },
};

// Runs before first paint so below-the-fold text starts hidden without a
// flash. Skipped for reduced motion and inside iframes (Storyblok editor).
// The 4s fallback un-hides everything if the app script never starts.
const FADE_BOOT = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||window.top!==window)return;d.classList.add("gd-fade");setTimeout(function(){if(!window.__gdFade)d.classList.remove("gd-fade")},4000)}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FADE_BOOT }} />
      </head>
      <body>
        <StoryblokProvider>
          <Nav />
          {children}
          <ClosingCta />
          <FadeUp />
          <BackToTop />
          <Analytics />
          <SpeedInsights />
        </StoryblokProvider>
      </body>
    </html>
  );
}
