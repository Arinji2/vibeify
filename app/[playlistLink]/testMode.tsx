"use client";

import Link from "next/link";
import WidthWrapper from "../(wrapper)/widthWrapper";
import * as React from "react";
import { useState } from "react";

export function TestModeComponent({
  currentTheme,
  link,
}: {
  currentTheme: string;
  link: string;
}) {
  const [showSelector, setShowSelector] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center h-[200px] xl:h-[100px] bg-palette-background border-black border-t-[4px] fixed bottom-0 z-50">
      <WidthWrapper>
        <div className="w-full h-full flex flex-col xl:flex-row items-center justify-between">
          <p className="text-black font-bold text-2xl">
            You are currently in Test Mode!
          </p>
          <div className="w-full xl:w-fit h-full py-3 flex overflow-y-hidden flex-row items-center no-scrollbar justify-start xl:justify-between gap-5 overflow-x-scroll ">
            <div
              className={`${
                showSelector ? "h-[233px] opacity-100 " : "h-0 opacity-0"
              } w-[300px] transition-all overflow-hidden flex flex-col items-center justify-center ease-in-out border-[4px] border-black shrink-0 duration-500 absolute z-[100] bg-palette-background bottom-[calc(100%-60px)] xl:bottom-[calc(100%-12px)] rounded-md`}
            >
              <Link
                href={`/${link}?testMode=default`}
                className={`${
                  currentTheme === "default"
                    ? "bg-palette-primary hover:cursor-not-allowed "
                    : "bg-palette-background hover:bg-palette-primary "
                }w-full h-[75px] flex flex-col items-start justify-center  border-black border-[5px] border-x-0 border-y-0`}
              >
                <p className="text-black text-2xl font-bold px-2">Default</p>
              </Link>
              <Link
                href={`/${link}?testMode=neo-brutalism`}
                className={`${
                  currentTheme === "neo-brutalism"
                    ? "bg-palette-primary hover:cursor-not-allowed "
                    : "bg-palette-background hover:bg-palette-primary "
                }w-full h-[75px] flex flex-col items-start justify-center  border-black border-[5px] border-x-0 `}
              >
                <p className="text-black text-2xl font-bold px-2">
                  Neo-Brutalism
                </p>
              </Link>
              <Link
                href={`/${link}?testMode=pixel`}
                className={`${
                  currentTheme === "pixel"
                    ? "bg-palette-primary hover:cursor-not-allowed "
                    : "bg-palette-background hover:bg-palette-primary "
                }w-full h-[75px] flex flex-col items-start justify-center  border-black border-[5px] border-x-0 border-y-0`}
              >
                <p className="text-black text-2xl font-bold px-2">Pixel</p>
              </Link>
            </div>
            <button
              onClick={() => setShowSelector(!showSelector)}
              className="w-[300px] shrink-0 h-[100px] xl:h-full bg-palette-accent border-black border-[4px] relative hover:shadow-buttonHover group transition-all ease-in-out duration-300 hover:bg-palette-background shadow-button rounded-md flex flex-row items-center justify-center"
            >
              <p className="text-palette-background font-bold text-2xl group-hover:text-palette-accent transition-all ease-in-out duration-300">
                Select Theme!
              </p>
            </button>
            <Link
              href="/dashboard/playlists"
              className="w-[300px] shrink-0 h-[100px] xl:h-full bg-palette-background  border-black border-[4px] hover:bg-palette-error relative hover:shadow-buttonHover group transition-all ease-in-out duration-300  shadow-button rounded-md flex flex-row items-center justify-center"
            >
              <p className="text-palette-error font-bold text-2xl group-hover:text-palette-background transition-all ease-in-out duration-300">
                Go Back!
              </p>
            </Link>
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}
