"use client";
import * as React from "react";
import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { getTrackLyrics } from "./fetchSongLyrics";
import Image from "next/image";
import WidthWrapper from "../(wrapper)/widthWrapper";
import { XSquare } from "lucide-react";
export type LyricsType = {
  theme: string;
  songName: string;
  artists: string[];
  trackId: string;
  songImage: string;
};
export function ShowLyrics({
  songName,
  artists,
  trackId,
  setLoading,
  songImage,
}: {
  songName: string;
  artists: string[];
  trackId: string;
  setLoading: Function;
  songImage: string;
}) {
  const [lyricsState, setLyricsState] = useState<string[]>([]);
  const [showLyrics, setShowLyrics] = useState<boolean>(false);
  const [trackIDState, setTrackIDState] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setTrackIDState(trackId);
  }, [trackId]);

  useEffect(() => {
    if (trackIDState.length === 0) return;
    getTrackLyrics(trackIDState).then(({ lyrics, error }) => {
      setLoading(false);
      if (error) toast.error("Lyrics not found");
      else {
        setLyricsState(lyrics);
        setShowLyrics(true);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIDState]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted
    ? createPortal(
        <DisplayTrack
          lyrics={lyricsState}
          setShowLyrics={setShowLyrics}
          showLyrics={showLyrics}
          songName={songName}
          artists={artists}
          songImage={songImage}
          setTrackIDState={setTrackIDState}
        />,
        document.body
      )
    : null;
}

function DisplayTrack({
  lyrics,

  songName,
  showLyrics,
  setShowLyrics,
  artists,
  songImage,
  setTrackIDState,
}: {
  lyrics: string[];

  songName: string;
  showLyrics: boolean;
  setShowLyrics: Function;
  artists: string[];
  songImage: string;
  setTrackIDState: Function;
}) {
  return (
    <div
      className={`${
        showLyrics ? "translate-y-0 " : "-translate-y-full "
      } transition-all fixed top-0 left-0 z-50 ease-in-out duration-500 w-full h-[100vh] bg-black`}
    >
      <Image
        src={songImage}
        fill
        priority
        sizes="100vw"
        className="object-cover  absolute "
        alt="Song Image"
        quality={100}
      />
      <div className="absolute w-full z-10 h-full bg-black bg-opacity-70 backdrop-blur-sm xl:backdrop-blur-0"></div>

      <div className="w-full h-full flex flex-col xl:flex-row items-center justify-end xl:justify-center gap-6">
        <div className="w-full h-full flex relative flex-col items-center gap-5 justify-end ">
          <div className="absolute  w-full h-full left-0 top-0 z-20 bg-black xl:block hidden bg-opacity-50"></div>
          <WidthWrapper>
            <div className="w-full h-full z-30 flex flex-col items-center xl:justify-center justify-end">
              <div className="overflow-y-auto z-50 px-3 flex flex-col items-start justify-start gap-4 w-full h-full max-h-[calc(100%-300px)]  ">
                {lyrics.map((lyric, index) => (
                  <p
                    key={index}
                    className={`text-[15px] xl:text-[30px] z-30  text-white text-opacity-70`}
                  >
                    {lyric}
                  </p>
                ))}
              </div>
            </div>
          </WidthWrapper>
        </div>
        <div className="w-full h-fit  xl:max-h-[calc(100%-300px)]  py-3 xl:py-0 flex flex-col items-center xl:justify-end justify-center z-50 xl:h-full ">
          <WidthWrapper>
            <div className="xl:py-6 flex relative flex-col items-start xl:items-end justify-end gap-8  w-full xl:h-full h-fit pb-4">
              <button
                className="absolute top-0 xl:top-5 right-0 w-fit h-fit z-50"
                onClick={() => {
                  setShowLyrics(false);
                  setTrackIDState("");
                }}
              >
                <XSquare className="text-white text-4xl xl:w-[50px] h-[35px] w-[35px] xl:h-[50px]" />
              </button>
              <h1 className="text-[35px] xl:text-[60px] text-white font-bold w-[90%] xl:w-full text-left xl:text-right line-clamp-2 break-words z-40 ">
                {songName}
              </h1>
              <p className="text-[20px] xl:text-[40px] text-white font-bold w-full text-left xl:text-right line-clamp-2 break-words z-40 ">
                {artists.join(", ")}
              </p>
            </div>
          </WidthWrapper>
        </div>
      </div>
    </div>
  );
}

/*
   <div
      className={`${
        showLyrics ? "translate-y-0 " : "-translate-y-full "
      } transition-all fixed top-0 left-0 z-50 ease-in-out duration-500 w-full h-[100vh] bg-black`}
    >
      <div className="w-full h-full flex flex-col items-center gap-5 justify-end ">
        <WidthWrapper>
          <div className="w-full h-full z-30 flex flex-col items-center justify-end">
            <div className="overflow-y-auto z-50 flex flex-col items-start justify-start gap-4 w-full h-full max-h-[calc(100%-300px)]  ">
              {lyrics.map((lyric, index) => (
                <p
                  key={index}
                  className={`text-[15px] xl:text-[30px] z-30  text-white text-opacity-70`}
                >
                  {lyric}
                </p>
              ))}
            </div>
          </div>
        </WidthWrapper>
        <div className="w-full h-fit shrink-0 xl:shrink py-3 xl:py-0 flex flex-col items-center xl:justify-end justify-center z-50 xl:h-full ">
          <WidthWrapper>
            <div className="xl:py-6 flex relative flex-col items-start xl:items-end justify-end gap-8  w-full xl:h-full h-fit pb-4">
              <button
                className="absolute top-0 xl:top-5 right-0 w-fit h-fit z-50"
                onClick={() => {
                  setShowLyrics(false);
                  setTrackIDState("");
                }}
              >
                <XSquare className="text-white text-4xl xl:w-[50px] h-[35px] w-[35px] xl:h-[50px]" />
              </button>
              <h1 className="text-[35px] xl:text-[60px] text-white font-bold w-[90%] xl:w-full text-left xl:text-right line-clamp-2 break-words z-40 ">
                {songName}
              </h1>
              <p className="text-[20px] xl:text-[40px] text-white font-bold w-full text-left xl:text-right line-clamp-2 break-words z-40 ">
                {artists.join(", ")}
              </p>
            </div>
          </WidthWrapper>
        </div>
      </div>
    </div>
    */
