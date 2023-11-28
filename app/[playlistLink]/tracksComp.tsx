"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TrackType } from "@/utils/validations/playlists/themes";
import { Playlist } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { FetchNextSongsAction } from "./fetchNextSongs";
import { LyricsType, ShowLyrics } from "./showLyrics";

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

  const [showLyricsState, setShowLyricsState] = useState<LyricsType>({
    artists: [],
    songName: "",
    theme: "",
    trackId: "",
    songImage: "",
  });
  const [loadingLyrics, setLoadingLyrics] = useState(false);
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

  useEffect(() => {
    if (!loadingLyrics)
      setShowLyricsState({
        artists: showLyricsState.artists,
        songName: showLyricsState.songName,
        theme: showLyricsState.theme,
        trackId: "",
        songImage: showLyricsState.songImage,
      });
  }, [loadingLyrics]);

  return (
    <>
      <ShowLyrics
        setLoading={setLoadingLyrics}
        artists={showLyricsState.artists}
        songName={showLyricsState.songName}
        theme={showLyricsState.theme}
        trackId={showLyricsState.trackId}
        songImage={showLyricsState.songImage}
      />
      <div className="flex flex-col items-center justify-center w-full h-full pb-2 gap-3">
        <section className="w-full h-full min-h-[100svh] flex flex-row items-center justify-center flex-wrap gap-16 md:gap-7  p-4 mb-3">
          {tracks.map((track) => (
            <SongCard
              setLoading={setLoadingLyrics}
              loading={loadingLyrics}
              setShowLyricsState={setShowLyricsState}
              track={track}
              key={track.id}
            />
          ))}
        </section>
        <p ref={ref} className="font-bold text-black text-2xl">
          <Image
            src="/themes/default/loading.svg"
            width={40}
            alt="Lyrics Shower"
            height={40}
            className={`${
              atEnd && "invisible "
            }object-contain animate-spin z-20`}
          />
        </p>
      </div>
    </>
  );
}

function SongCard({
  track,
  setShowLyricsState,
  loading,
  setLoading,
}: {
  track: TrackType;
  setShowLyricsState: Dispatch<SetStateAction<LyricsType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [locLoading, setLocLoading] = useState(false);
  useEffect(() => {
    if (!loading) setLocLoading(loading);
  }, [loading]);
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
        target="_blank"
        href={track.external_urls.spotify}
        className="w-full md:w-[390px] h-[450px] md:h-[600px] rounded-md flex flex-col   group items-start justify-end gap-1  bg-palette-text hover:shadow-[20px_20px_0_#43937F] shadow-[20px_20px_0_#43937F] relative overflow-hidden"
      >
        <Image
          src={track.album.images[0].url}
          alt="Album Cover"
          className="group-hover:animate-image-pan object-cover absolute group-hover:scale-110 transition-all ease-in-out duration-300 will-change-transform"
          fill
          sizes="(min-width: 768px) 600px, 450px"
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
