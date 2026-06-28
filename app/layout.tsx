import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";

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
    <html lang="en">
      <body>
        <Script
          src="//app.storyblok.com/f/storyblok-v2-latest.js"
          strategy="beforeInteractive"
        />
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
