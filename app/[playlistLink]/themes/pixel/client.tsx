"use client";

import { TrackType } from "@/utils/validations/playlists/themes";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { LyricsType } from "../../showLyrics";

export function PixelSongCard({
  track,
  setShowLyricsState,
  loading,
  setLoading,
  setLocLoading,
  locLoading,
}: {
  track: TrackType;
  setShowLyricsState: Dispatch<SetStateAction<LyricsType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setLocLoading: Dispatch<SetStateAction<boolean>>;
  locLoading: boolean;
}) {
  const [imageProps, setImageProps] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function setDimensions() {
      if (parentRef.current) {
        const { height, width } = parentRef.current.getBoundingClientRect();
        setImageProps({ height, width });
      }
    }
    window.addEventListener("resize", setDimensions);
    setDimensions();
    return () => window.removeEventListener("resize", setDimensions);
  }, [parentRef.current]);
  return (
    <div className="w-full md:w-fit h-fit relative">
      <button
        className="absolute top-5 right-5 w-fit h-fit z-20 bg-[#80EED3] border-[4px] border-black shadow-button p-2 aspect-square"
        onClick={() => {
          setLocLoading(true);
          setLoading(true);
          setShowLyricsState({
            artists: track.album.artists.map((artist) => artist.name),
            songName: track.name,
            theme: "default",
            trackId: track.id!,
            songImage: track.album.images[0].url,
          });
        }}
      >
        {locLoading ? (
          <Image
            src="/themes/neo-brutalism/loading.svg"
            width={30}
            alt="Lyrics Shower"
            height={30}
            className="object-contain animate-spin z-20"
          />
        ) : (
          <Image
            src="/themes/neo-brutalism/lyrics.png"
            width={30}
            alt="Lyrics Shower"
            height={30}
            className="object-contain  z-20"
          />
        )}
      </button>
      <Link
        target="_blank"
        href={track.external_urls.spotify}
        className="w-full md:w-[350px] h-[500px] md:h-[700px] p-5  flex flex-col   group items-start justify-end gap-1  bg-[#FFF4E8] border-black border-[5px]  relative overflow-hidden"
      >
        <div className="w-full h-[150px] md:h-[250px] mt-[30px] md:mt-[50px] shrink-0  z-10  p-3 pb-6 flex flex-col items-start justify-end">
          <h4 className="text-black font-bold text-[20px] md:text-[35px] z-20 text-left line-clamp-2">
            {track.name}
          </h4>
          <p className="text-black  text-[15px] text-left md:text-[25px] z-20">
            {track.album.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
        <div
          ref={parentRef}
          className="w-full h-full overflow-hidden border-black border-[5px] relative"
        >
          <LazyLoadImage
            alt={"Album Cover"}
            height={imageProps.height}
            width={imageProps.width}
            className=" object-center   max-w-none object-cover h-full"
            sizes="(min-width: 768px) 600px, 450px"
            src={track.album.images[0].url}
            effect="blur"
          />
        </div>
      </Link>
    </div>
  );
}
