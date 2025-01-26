"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { TrackType } from "@/utils/validations/playlists/themes";
import { Playlist } from "@spotify/web-api-ts-sdk";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { FetchNextSongsAction } from "./fetchNextSongs";
import { LyricsType, ShowLyrics } from "./showLyrics";
import { DefaultSongCard } from "./themes/default/client";
import { NeoBrutalismSongCard } from "./themes/neo-brutalism/client";
import { PixelSongCard } from "./themes/pixel/client";

export default function TracksComponent({
  playlistData,
  initialTracks,
  theme,
}: {
  playlistData: Playlist;
  initialTracks: TrackType[];
  theme: string;
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
  }, [inView, offset, playlistData, loading]);

  useEffect(() => {
    if (!loadingLyrics)
      setShowLyricsState({
        artists: showLyricsState.artists,
        songName: showLyricsState.songName,
        theme: showLyricsState.theme,
        trackId: "",
        songImage: showLyricsState.songImage,
      });
  }, [
    loadingLyrics,
    showLyricsState.artists,
    showLyricsState.songName,
    showLyricsState.theme,
    showLyricsState.songImage,
  ]);

  return (
    <>
      <ShowLyrics
        setLoading={setLoadingLyrics}
        artists={showLyricsState.artists}
        songName={showLyricsState.songName}
        trackId={showLyricsState.trackId}
        songImage={showLyricsState.songImage}
      />
      <div className="flex flex-col items-center justify-center w-full h-full pb-2 gap-3">
        <section className="w-full h-full min-h-[100svh] flex flex-row items-center justify-center flex-wrap gap-16 md:gap-7  p-4 mb-3">
          {tracks.map((track) => (
            <SongCard
              theme={theme}
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
            src={`/themes/${
              theme === "pixel" ? "neo-brutalism" : theme
            }/loading.svg`}
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
  theme,
}: {
  track: TrackType;
  setShowLyricsState: Dispatch<SetStateAction<LyricsType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  theme: string;
}) {
  const [locLoading, setLocLoading] = useState(false);
  useEffect(() => {
    if (!loading) setLocLoading(loading);
  }, [loading]);
  return (
    <>
      {theme === "default" && (
        <DefaultSongCard
          loading={loading}
          locLoading={locLoading}
          setLoading={setLoading}
          setLocLoading={setLocLoading}
          setShowLyricsState={setShowLyricsState}
          track={track}
        />
      )}
      {theme === "neo-brutalism" && (
        <NeoBrutalismSongCard
          loading={loading}
          locLoading={locLoading}
          setLoading={setLoading}
          setLocLoading={setLocLoading}
          setShowLyricsState={setShowLyricsState}
          track={track}
        />
      )}
      {theme === "pixel" && (
        <PixelSongCard
          loading={loading}
          locLoading={locLoading}
          setLoading={setLoading}
          setLocLoading={setLocLoading}
          setShowLyricsState={setShowLyricsState}
          track={track}
        />
      )}
    </>
  );
}
