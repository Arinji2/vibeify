"use client";

import { Playlist, Track } from "@spotify/web-api-ts-sdk";
import { ReactNode, useState } from "react";

export function SongSectionUI({
  playlist,
  children,
  totalSongs,
  isCommon,
}: {
  playlist: Playlist<Track>;
  children: ReactNode;
  totalSongs: number;
  isCommon?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      className={`${
        isOpen ? "h-[500px] md:h-[550px] " : " h-[170px] md:h-[100px] "
      }w-[90%] transition-all ease-in-out duration-700  border-[3px] border-black shadow-button rounded-lg bg-palette-accent flex flex-col items-center overflow-hidden justify-start py-4 gap-8 px-2 md:px-8`}
    >
      <div className="w-full h-fit shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="w-full h-fit flex flex-col md:flex-row items-start md:items-center justify-start gap-2">
          <h2 className="text-white truncate whitespace-nowrap text-[20px] md:text-[30px] xl:text-[40px] font-bold">
            {isCommon ? "Common Songs" : `Missing In ${playlist.name}`}
          </h2>
          <p className="shrink-0 text-[20px] text-white/70 font-medium">
            Total: {totalSongs}
          </p>
        </div>
        <div className="w-fit h-fit flex flex-row items-center justify-end gap-3 shrink-0">
          <button
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="px-4 md:px-6 rounded-lg py-2 border-[3px] bg-palette-error border-black flex flex-row gap-2 items-center justify-center"
          >
            <p className="text-[15px] text-white font-medium whitespace-nowrap">
              {isOpen ? "Hide Section" : "Show Section"}
            </p>
          </button>
        </div>
      </div>
      <div className="w-full h-[300px] md:h-[420px] shrink-0  border-[3px] border-black rounded-lg grid xl:grid-cols-3 grid-cols-1 md:grid-cols-2 gap-4 flex-wrap px-2 md:px-5 no-scrollbar overflow-y-scroll p-5">
        {children}
      </div>
    </div>
  );
}
