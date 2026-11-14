"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  hue: number;
  image?: string;
  alt?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Post image. next/image resizes and lazy-loads it through the app's own domain.
 * If the image is missing or fails to load, a generated gradient is shown instead,
 * so a broken-image icon never appears.
 */
export default function Cover({ hue, image, alt = "", sizes = "100vw", priority = false, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <div className={`relative overflow-hidden bg-subtle ${className}`}>
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );
  }

  const a = `hsl(${hue} 85% 58%)`;
  const c = `hsl(${(hue + 320) % 360} 70% 22%)`;
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${c}, ${a})` }}
    />
  );
}
