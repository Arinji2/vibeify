"use client";

import { TrackType } from "@/utils/validations/playlists/themes";
import Image from "next/image";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

import useImage from "@/utils/useImage";
import { LyricsType } from "../../showLyrics";
export function DefaultSongCard({
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
  const { imageProps, ref } = useImage<HTMLAnchorElement>();
  return (
    <div className="w-full md:w-fit h-fit relative">
      <button
        className="absolute top-5 right-5 w-fit h-fit z-20"
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
            src="/themes/default/loading.svg"
            width={40}
            alt="Lyrics Shower"
            height={40}
            className="object-contain animate-spin z-20"
          />
        ) : (
          <Image
            src="/themes/default/lyrics.png"
            width={40}
            alt="Lyrics Shower"
            height={40}
            className="object-contain  z-20"
          />
        )}
      </button>
      <Link
        ref={ref}
        target="_blank"
        href={track.external_urls.spotify}
        className="w-full md:w-[390px] h-[450px] md:h-[600px] rounded-md flex flex-col   group items-start justify-end gap-1  bg-palette-text hover:shadow-[20px_20px_0_#43937F] shadow-[20px_20px_0_#43937F] relative overflow-hidden"
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

        <div className="w-full h-full bg-black bg-opacity-70 absolute z-10 top-0 left-0"></div>
        <div className="w-full h-fit backdrop-blur-sm z-10 absolute left-0 bottom-0 p-3 pb-6 flex flex-col items-start justify-start">
          <h4 className="text-palette-background font-bold text-[20px] md:text-[35px] z-20 text-left line-clamp-2">
            {track.name}
          </h4>
          <p className="text-white text-opacity-60 text-[15px] md:text-[25px] z-20">
            {track.album.artists.map((artist) => artist.name).join(", ")}
          </p>
        </div>
      </Link>
    </div>
  );
}
