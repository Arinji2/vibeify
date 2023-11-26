"use client";
import { useEffect, useState } from "react";

import { TrackType } from "@/utils/validations/playlists/themes";
import { Playlist } from "@spotify/web-api-ts-sdk";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { FetchNextSongsAction } from "./fetchNextSongs";

export default function TracksComponent({
  playlistData,
  initialTracks,
}: {
  playlistData: Playlist;
  initialTracks: TrackType[];
}) {
  const [tracks, setTracks] = useState<TrackType[]>(initialTracks);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (inView) {
      setLoading(true);
      setOffset((prev) => prev + 1);
      FetchNextSongsAction(offset + 1, playlistData).then((res) => {
        if (res.length === 0) {
          setAtEnd(true);
        }

        setTracks((prev) => [...prev, ...res]);
        setLoading(false);
      });
    }
  }, [inView, offset, playlistData]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pb-2 gap-3">
      <section className="w-full h-full min-h-[100svh] flex flex-row items-center justify-center flex-wrap gap-16 md:gap-7  p-4 mb-3">
        {tracks.map((track) => (
          <SongCard track={track} key={track.id} />
        ))}
      </section>
      <p ref={ref} className="font-bold text-black text-2xl">
        <Loader2
          className={`${
            atEnd && "invisible "
          } animate-spin text-black text-4xl w-[50px] h-[50px]`}
        />
      </p>
    </div>
  );
}

function SongCard({ track }: { track: TrackType }) {
  return (
    <Link
      target="_blank"
      href={track.external_urls.spotify}
      className="w-full md:w-[390px] h-[450px] md:h-[600px] rounded-md flex flex-col  group items-start justify-end gap-1  bg-palette-text hover:shadow-[20px_20px_0_#43937F] shadow-[20px_20px_0_#43937F] relative overflow-hidden"
    >
      <Image
        src={track.album.images[0].url}
        alt="Album Cover"
        className="object-cover absolute group-hover:scale-110 transition-all ease-in-out duration-300 will-change-transform"
        fill
        blurDataURL={track.blurDataURL}
        placeholder="blur"
        sizes="600px"
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
      <Image
        src="/themes/default/lyrics.png"
        width={40}
        alt="Lyrics Shower"
        height={40}
        className="object-contain absolute top-5 right-5 z-20"
      />
    </Link>
  );
}
