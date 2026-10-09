import { redirect } from "next/navigation";

// The hero B layout is now the home page. Anyone with the old preview link
// lands there.
export default function HeroBPage() {
  redirect("/");
}
