"use client";

import { storyblokInit, apiPlugin } from "@storyblok/react";

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  bridge: true,
});

export default function StoryblokProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
