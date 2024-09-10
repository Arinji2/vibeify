"use client";

import { LazyLoadImage } from "react-lazy-load-image-component";

export function SongImage({ trackImage }: { trackImage: string }) {
  return (
    <div className="border-[1px] md:size-[60px] size-[50px] shadow-button shrink-0 overflow-hidden border-black">
      <LazyLoadImage
        alt={"Album Cover"}
        className=" object-center  w-full object-cover h-full"
        sizes="(min-width: 768px) 600px, 450px"
        src={trackImage}
        effect="blur"
      />
    </div>
  );
}
