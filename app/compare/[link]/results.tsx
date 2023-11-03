import { ComparePlaylist } from "@/utils/validations/products/compare/types";
import Link from "next/link";
import ResultShower from "./resultShower";

export default async function Results({
  playlist1,
  playlist2,
  urlParams,
}: {
  playlist1: ComparePlaylist[];
  playlist2: ComparePlaylist[];
  urlParams: string;
}) {
  const ids1 = new Set(playlist1.map((item) => item.id));
  const ids2 = new Set(playlist2.map((item) => item.id));

  const missingIn1 = playlist2.filter((item) => !ids1.has(item.id));
  const missingIn2 = playlist1.filter((item) => !ids2.has(item.id));

  const presentInBoth = playlist1.filter((item) => ids2.has(item.id));

  let percentageMatch = (
    (1 -
      (missingIn1.length + missingIn2.length) /
        (playlist1.length + playlist2.length)) *
    100
  ).toFixed(0);

  return (
    <>
      <div className="w-full h-full flex gap-y-10  flex-col xl:flex-row items-center xl:justify-evenly justify-center">
        <Link
          href={`/compare/${urlParams}?selected=1#resultShower`}
          className="h-[550px] md:h-[400px] w-[90%] group flex md:flex-row flex-col xl:flex-col items-center justify-center gap-x-5 gap-12 p-4 hover:shadow-buttonHover transition-all ease-in-out duration-300  bg-palette-background border-[4px] shadow-button rounded-md border-black xl:w-[380px]"
        >
          <div className="w-[180px] h-[130px] rounded-md shadow-[10px_10px_0_#4E4393] group-hover:bg-[#4E4393] group-hover:shadow-[10px_10px_0_#43937F] transition-all ease-in-out duration-500 bg-palette-accent flex flex-col items-center justify-center">
            <p className="text-8xl font-bold text-white">1</p>
          </div>
          <p className="text-5xl font-bold text-palette-text">Playlist 1</p>
          <div className="xl:hidden hidden md:block h-[60%] w-[3px] bg-black"></div>
          <div className="md:w-[30%] w-full xl:w-full flex flex-col items-center justify-center h-fit">
            <p className="text-[18px] xl:text-[16px] text-center font-medium text-palette-text">
              View songs missing in Playlist 1 from Playlist 2
            </p>
          </div>
        </Link>
        <div className="md:w-[230px] w-[90%] h-[190px] bg-palette-background border-[4px] shadow-button rounded-md border-black flex flex-row gap-x-6 md:flex-col items-center justify-center gap-2">
          <p
            className={`font-bold text-[50px] ${
              percentageMatch >= "50"
                ? "text-palette-success"
                : "text-palette-error"
            }`}
          >
            {percentageMatch}%
          </p>
          <p
            className={`font-bold text-[40px] ${
              percentageMatch >= "50"
                ? "text-palette-success"
                : "text-palette-error"
            }`}
          >
            MATCH
          </p>
        </div>
        <Link
          href={`/compare/${urlParams}?selected=2#resultShower`}
          className="h-[550px] md:h-[400px] w-[90%] flex md:flex-row flex-col xl:flex-col items-center justify-center gap-x-5 gap-12 p-4 hover:shadow-buttonHover group transition-all ease-in-out duration-300  bg-palette-background border-[4px] shadow-button rounded-md border-black xl:w-[380px]"
        >
          <div className="w-[180px] h-[130px] rounded-md shadow-[10px_10px_0_#4E4393] group-hover:bg-[#4E4393] group-hover:shadow-[10px_10px_0_#43937F] transition-all ease-in-out duration-500 bg-palette-accent flex flex-col items-center justify-center">
            <p className="text-8xl font-bold text-white">2</p>
          </div>
          <p className="text-5xl font-bold text-palette-text">Playlist 2</p>
          <div className="xl:hidden hidden md:block h-[60%] w-[3px] bg-black"></div>
          <div className="md:w-[30%] w-full xl:w-full flex flex-col items-center justify-center h-fit">
            <p className="text-[18px] xl:text-[16px] text-center font-medium text-palette-text">
              View songs missing in Playlist 2 from Playlist 1
            </p>
          </div>
        </Link>
      </div>

      <ResultShower
        playlist1Matching={presentInBoth}
        playlist1Missing={missingIn1}
        playlist2Matching={presentInBoth}
        playlist2Missing={missingIn2}
      />
    </>
  );
}
