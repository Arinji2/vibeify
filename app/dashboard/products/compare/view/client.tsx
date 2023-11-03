"use client";

import ShareCompareModal from "@/app/(models)/shareCompareModal";
import { useState } from "react";
import { createPortal } from "react-dom";
import Lottie from "react-lottie-player";
import Compare1 from "../../../../../public/animations/compare1.json";
import Compare2 from "../../../../../public/animations/compare2.json";

export function Compare1Loading() {
  return (
    <Lottie
      animationData={Compare1}
      className="w-[150px] h-[150px]"
      loop
      play
    />
  );
}

export function Compare2Loading() {
  return (
    <Lottie
      animationData={Compare2}
      className="w-[150px] h-[150px]"
      loop
      play
    />
  );
}

export function Share({
  playlistID1,
  playlistID2,
}: {
  playlistID1: string;
  playlistID2: string;
}) {
  const [isSharing, setIsSharing] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setIsSharing(true);
        }}
        className="text-xl font-bold text-palette-text border-b-2 border-black"
      >
        Share Results
      </button>
      {isSharing &&
        createPortal(
          <ShareCompareModal
            playlistID1={playlistID1}
            playlistID2={playlistID2}
            setIsOpen={setIsSharing}
          />,
          document.body
        )}
    </>
  );
}
