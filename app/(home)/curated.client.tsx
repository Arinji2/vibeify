"use client";

import useImage from "@/utils/useImage";
import { LazyLoadImage } from "react-lazy-load-image-component";

export function CardImage({
  playlistImage,
  playlistID,
}: {
  playlistImage: string;
  playlistID: string;
}) {
  const { imageProps, ref } = useImage<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="w-full h-[250px] xl:h-full rounded-md overflow-hidden border-[4px] border-black shadow-button"
    >
      <LazyLoadImage
        alt={"Album Cover"}
        height={imageProps.height}
        width={imageProps.width}
        className=" object-center    max-w-none object-cover h-full"
        src={`https://db-listify.arinji.com/api/files/playlists/${playlistID}/${playlistImage}`}
        effect="blur"
      />
    </div>
  );
}
