import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("slug") ?? "/";
  const slug = raw === "home" ? "/" : `/${raw}`;
  (await draftMode()).enable();
  redirect(slug);
}
