
"use client";

import { useState } from "react";
import Image from "next/image";

export default function AlbumArt({ src, alt, width = 200, height = 200, className }: { src: string, alt: string, width?: number, height?: number, className?: string }) {
  const [imgSrc, setImgSrc] = useState(src || "/default-album.png");

  return (
    <Image
      src={imgSrc}
      alt={alt || "Album Art"}
      width={width}
      height={height}
      className={className || "rounded-xl object-cover"}
      onError={() => setImgSrc("/default-album.png")} // 👈 fallback if broken
    />
  );
}
