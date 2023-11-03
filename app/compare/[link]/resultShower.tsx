"use client";
import { ComparePlaylist } from "@/utils/validations/products/compare/types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import * as React from "react";
import { useState, useEffect, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import Link from "next/link";

export default function ResultShower({
  playlist1Missing,
  playlist1Matching,

  playlist2Missing,
  playlist2Matching,
}: {
  playlist1Missing: ComparePlaylist[];
  playlist1Matching: ComparePlaylist[];

  playlist2Missing: ComparePlaylist[];
  playlist2Matching: ComparePlaylist[];
}) {
  const searchParams = useSearchParams();
  const [number, setNumber] = useState(searchParams.get("selected" ?? ""));

  useEffect(() => {
    setNumber(searchParams.get("selected" ?? ""));
  }, [searchParams]);

  return (
    <div
      className={` w-full relative h-fit overflow-hidden flex flex-col items-center justify-center mt-5`}
    >
      <div className="h-0 w-0 absolute left-0 top-0" id="resultShower"></div>
      <ResultParent
        number={number!}
        matchingPlaylist={playlist1Missing}
        missingPlaylist={playlist1Matching}
        playlistNumber="1"
      />
      <ResultParent
        number={number!}
        matchingPlaylist={playlist2Matching}
        missingPlaylist={playlist2Missing}
        playlistNumber="2"
      />
    </div>
  );
}

function ResultParent({
  number,
  matchingPlaylist,
  missingPlaylist,
  playlistNumber,
}: {
  number: string;
  matchingPlaylist: ComparePlaylist[];
  missingPlaylist: ComparePlaylist[];
  playlistNumber: string;
}) {
  const [mode, setMode] = useState<"missing" | "matching">("matching");
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div
      className={`${
        number === playlistNumber
          ? "translate-x-0 h-[100svh]  "
          : ` h-0 absolute ${
              playlistNumber === "1" ? "-translate-x-full" : "translate-x-full"
            } overflow-hidden `
      } w-full transition-transform no-scrollbar  ease-in-out duration-700 `}
    >
      <div className="flex flex-col items-center justify-start gap-5 p-2  w-full h-full ">
        <p className="text-white font-bold text-[50px] text-center">
          Results for Playlist {playlistNumber}
        </p>
        <div className="w-full h-fit flex flex-row items-center justify-center gap-5 flex-wrap">
          <button
            onClick={(e) => {
              e.preventDefault();
              setMode("matching");
            }}
            className="w-[350px] h-[70px] bg-palette-success border-[4px] border-black shadow-button flex flex-col items-center justify-center"
          >
            <p className="text-white font-bold text-[30px]">Show Matching</p>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              setMode("missing");
            }}
            className="w-[350px] h-[70px] bg-palette-error border-[4px] border-black shadow-button flex flex-col items-center justify-center"
          >
            <p className="text-white font-bold text-[30px]">Show Missing</p>
          </button>
        </div>
        <div
          className="w-full h-full flex flex-row items-start justify-center gap-6 flex-wrap  py-4 overflow-y-auto no-scrollbar"
          ref={parent}
        >
          {mode === "matching" && (
            <>
              {matchingPlaylist.map((item) => (
                <Result item={item} mode="matching" key={item.id} />
              ))}
            </>
          )}
          {mode === "missing" && (
            <>
              {missingPlaylist.map((item) => (
                <Result item={item} mode="missing" key={item.id} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Result({
  item,
  mode,
}: {
  item: ComparePlaylist;
  mode: "missing" | "matching";
}) {
  return (
    <Link
      href={item.link ?? "https://spotify.com"}
      key={item.id}
      className={`${
        mode === "matching"
          ? "shadow-[6px_6px_0_#3BBD58]  "
          : "shadow-[6px_6px_0_#BD3B3B] "
      }w-[95%] md:w-[400px] aspect-video relative rounded-md group bg-palette-tertiary bg-opacity-80 overflow-hidden`}
    >
      <Image
        src={item.image}
        fill
        sizes="400px"
        alt={item.name}
        className="object-cover absolute group-hover:scale-110 transition-all ease-in-out duration-300 "
      />
      <div className="w-full h-full bg-black group-hover:bg-opacity-60 transition-all ease-in-out duration-300  bg-opacity-80 z-10 absolute"></div>
      <div className="w-full h-full flex flex-col items-start justify-end p-4 ">
        <p className="text-white font-semibold text-[20px] line-clamp-2 w-full text-left z-20">
          {item.name}
        </p>
      </div>
    </Link>
  );
}
