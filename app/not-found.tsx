import Link from "next/link";
import type { Metadata } from "next";
import PageStatement from "@/components/PageStatement";

export const metadata: Metadata = {
  title: "Page not found | Ganda",
  robots: { index: false },
};

// The 404 page: same opening statement as Work and About, inside <main> so the
// skip link has somewhere to go.
export default function NotFound() {
  return (
    <main id="main" style={{ paddingBottom: "calc(96 * var(--u))" }}>
      <PageStatement>This page does not exist.</PageStatement>
      <div className="gd-container">
        <p style={{ fontSize: "var(--type-body)" }}>
          <Link href="/work" style={{ textDecoration: "underline" }}>
            See the work
          </Link>{" "}
          or go back to the <Link href="/" style={{ textDecoration: "underline" }}>home page</Link>.
        </p>
      </div>
    </main>
  );
}
