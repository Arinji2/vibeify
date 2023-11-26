"use client";
import WidthWrapper from "@/app/(wrapper)/widthWrapper";
import Image from "next/image";
import * as React from "react";
import { useState } from "react";

export function SelectGenreComponent() {
  const [genres, setGenres] = useState<string[]>([]);

  return (
    <div className="w-full h-full p-4 md:h-full flex flex-col items-center justify-start gap-6">
      <h1 className="font-bold text-5xl md:text-6xl pt-3 text-palette-background  text-center">
        SELECT GENRES
      </h1>

      <div className="w-full h-full   p-4 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1">
        <div className="w-full h-full flex flex-col items-center justify-center">
          <button
            onClick={() => {
              if (genres.includes("Pop"))
                setGenres(genres.filter((i) => i !== "Pop"));
              else setGenres([...genres, "Pop"]);
            }}
            className={`${
              genres.includes("Pop")
                ? "bg-palette-tertiary "
                : "bg-palette-background "
            }w-[200px] shrink-0 flex flex-col items-center justify-center gap-5 aspect-square border-[5px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300`}
          >
            <Image
              src="/convert/pop.svg"
              width={60}
              height={60}
              alt="Convert Pop Genre"
            />
            <p className="font-bold text-[40px] text-palette-accent">POP</p>
          </button>
        </div>
      </div>

      <BottomBar genres={genres} />
    </div>
  );
}

function BottomBar({ genres }: { genres: string[] }) {
  return (
    <div className="w-full h-fit md:py-0 py-2  md:h-[100px] fixed  bottom-0 bg-palette-background border-t-[5px] border-black">
      <WidthWrapper>
        <div className="w-full h-full gap-y-6 flex flex-col md:flex-row  items-start md:items-center justify-center  md:justify-around ">
          <div className="w-full h-full flex flex-row items-center justify-start gap-4 ">
            <Image
              src="/convert/genres.svg"
              alt="Selected Genres"
              width={60}
              height={60}
            />
            <div className="w-fit h-full flex flex-col items-start justify-center gap-1">
              <h2 className="text-2xl font-bold text-palette-text">
                Selected Genres
              </h2>
              <p className="w-[300px] text-xl font-semibold text-palette-accent  h-fit gap-1 truncate ">
                {genres.length !== 0 ? genres.join(", ") : "No Genre Selected"}
              </p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-start md:items-end justify-center gap-2 ">
            <button
              disabled={genres.length === 0}
              className="px-4 py-2  w-fit shadow-button enabled:hover:shadow-buttonHover disabled:bg-slate-400 border-[3px] bg-palette-tertiary border-black  flex flex-row gap-2 items-center justify-center"
            >
              <p className="text-[25px] text-black font-medium">Continue</p>
            </button>
          </div>
        </div>
      </WidthWrapper>
    </div>
  );
}
