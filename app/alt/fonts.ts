import { DM_Sans } from "next/font/google";

// The site loads DM Sans at 300 to 500 only (app/layout.tsx). GANDA and the
// closing "LET'S TALK" (on every page) need a heavy cut, so it loads weight
// 900 here.
export const altDisplay = DM_Sans({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});
