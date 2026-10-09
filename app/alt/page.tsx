import { redirect } from "next/navigation";

// The alternative home now lives at "/". This route is kept so earlier links
// to /alt still work.
export default function AltRedirect() {
  redirect("/");
}
