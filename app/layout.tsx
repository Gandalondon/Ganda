import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Nav from "@/components/Nav";
import BackToTop from "@/components/BackToTop";
import StoryblokProvider from "@/components/StoryblokProvider";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400"] });

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <StoryblokProvider>
          <Nav />
          {children}
          <BackToTop />
          <Analytics />
          <SpeedInsights />
        </StoryblokProvider>
      </body>
    </html>
  );
}
