import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "Ganda — Tony Goff-Yu",
  description: "Design, branding and digital experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.className}>
      <body>
        <Script
          src="//app.storyblok.com/f/storyblok-v2-latest.js"
          strategy="beforeInteractive"
        />
        <Nav />
        {children}
      </body>
    </html>
  );
}
