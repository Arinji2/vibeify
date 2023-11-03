import { Loader2 } from "lucide-react";
import { Compare1Loading, Compare2Loading } from "./client";
export default function Loading() {
  return (
    <div className="w-full md:min-h-excludeNav h-full bg-palette-accent flex flex-col items-center justify-center gap-4 py-2">
      <h1 className="text-white font-bold md:text-[60px] text-[55px] text-center">
        COMPARE RESULTS
      </h1>
      <div className="w-full  h-full flex gap-y-10  flex-col xl:flex-row items-center xl:justify-evenly justify-center">
        <div className="h-[550px] md:h-[400px] w-[90%] flex md:flex-row flex-col xl:flex-col items-center justify-center gap-x-5 gap-12 p-4 hover:shadow-buttonHover transition-all ease-in-out duration-300  bg-palette-background border-[4px] shadow-button rounded-md border-black xl:w-[380px]">
          <div className="w-[180px] h-[130px] rounded-md shadow-[10px_10px_0_#4E4393] bg-palette-accent flex flex-col items-center justify-center">
            <p className="text-8xl font-bold text-white">1</p>
          </div>
          <Compare1Loading />
        </div>
        <div className="md:w-[230px] w-[90%] h-[190px] bg-palette-background border-[4px] shadow-button rounded-md border-black flex flex-row gap-x-6 md:flex-col items-center justify-center gap-2">
          <Loader2 className="font-bold w-[100px] h-[100px] text-palette-text animate-spin" />
        </div>
        <div className="h-[550px] md:h-[400px] w-[90%] flex md:flex-row flex-col xl:flex-col items-center justify-center gap-x-5 gap-12 p-4 hover:shadow-buttonHover transition-all ease-in-out duration-300  bg-palette-background border-[4px] shadow-button rounded-md border-black xl:w-[380px]">
          <div className="w-[180px] h-[130px] rounded-md shadow-[10px_10px_0_#4E4393] bg-palette-accent flex flex-col items-center justify-center">
            <p className="text-8xl font-bold text-white">2</p>
          </div>
          <Compare2Loading />
        </div>
      </div>
    </div>
  );
}
