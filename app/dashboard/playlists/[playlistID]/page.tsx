import { getToken } from "@/utils/getToken";
import { getPlaylist } from "@/utils/getUserData";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Stats from "./stats";
import Themes from "./themes";

export default async function Page({
  params,
}: {
  params: { playlistID: string | undefined };
}) {
  if (!params.playlistID) notFound();
  const token = await getToken();

  const playlistData = await getPlaylist(token, params.playlistID);

  return (
    <main className="md:min-h-excludeNav h-fit bg-palette-accent w-full flex flex-col items-center justify-start py-3 ">
      <div className="w-full h-full flex pt-3 md:flex-row gap-3 md:items-center flex-nowrap items-center justify-start md:justify-center flex-col">
        <div className="md:w-[50%] h-full w-full flex flex-col md:items-start items-center justify-start gap-4">
          <h1 className="text-palette-background text-[40px] shrink-0 line-clamp-2 font-bold md:text-[60px]">
            {playlistData.name}
          </h1>
          <div className="h-fit md:w-[50%] w-[90%] flex flex-col items-center  md:items-start gap-2">
            <h1 className="text-palette-background text-[20px] line-clamp-2 text-opacity-60 font-semibold md:text-[30px]">
              {playlistData.display_name}
            </h1>
            <div className="bg-palette-text h-[3px] w-full"></div>
          </div>
          <div className="w-full h-full md:pl-3 flex flex-col md:items-start items-center justify-center">
            <div className="w-[90%] md:w-full gap-y-6 h-[750px] xl:h-[450px] p-4 bg-palette-background flex flex-col xl:flex-row items-center justify-center gap-4 border-black border-[3px] shadow-button">
              <Suspense
                fallback={
                  <Loader2 className="w-[140px] text-black h-[140px] animate-spin" />
                }
              >
                <Stats
                  token={token}
                  playlistID={params.playlistID}
                  playlistData={playlistData}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <Themes playlistData={playlistData} />
      </div>
    </main>
  );
}
