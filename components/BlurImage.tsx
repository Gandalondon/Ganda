"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "onLoad"> & {
  wrapperStyle?: React.CSSProperties;
};

export default function BlurImage({ wrapperStyle, style, alt, ...props }: Props & { alt: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      // data-fade-media: fades up on scroll when it starts below the fold
      // (see components/FadeUp.tsx).
      data-fade-media
      className={loaded ? undefined : "gd-skeleton"}
      style={{ position: "relative", width: "100%", ...wrapperStyle }}
    >
      <Image
        alt={alt}
        {...props}
        style={{
          ...style,
          transition: "opacity 0.3s",
          opacity: loaded ? 1 : 0,
        }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
