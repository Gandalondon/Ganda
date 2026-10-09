import { DM_Sans } from "next/font/google";

// The site loads DM Sans at 300 to 500 only (app/layout.tsx). The alternative
// home needs a heavy cut for GANDA and "Let's talk", so it loads weight 900
// here. Next only requests the file for this route.
export const altDisplay = DM_Sans({
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
});
