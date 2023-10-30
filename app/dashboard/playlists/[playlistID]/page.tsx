import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import {
  PlaylistSchema,
  SyncSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import {
  PlaylistType,
  SyncType,
  ViewType,
} from "@/utils/validations/playlists/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import { WeeklySync, Visibility } from "./components";
import { dateToReadable } from "@/utils/getDate";
import Stats from "./stats";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { FirstCharUpper } from "@/utils/helpers";

export default async function Page({
  params,
}: {
  params: { playlistID: string | undefined };
}) {
  if (!params.playlistID) notFound();
  const token = await getToken();

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  let playlistData: PlaylistType;

  try {
    let playlistRecord = await pb
      .collection("playlists")
      .getFirstListItem(`id = "${params.playlistID}"`);
    let parsedPlaylist = PlaylistSchema.safeParse(playlistRecord);
    if (!parsedPlaylist.success) notFound();

    playlistData = parsedPlaylist.data as PlaylistType;
  } catch (e) {
    notFound();
  }

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
                  pb={pb}
                  playlistID={params.playlistID}
                  playlistData={playlistData}
                />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="md:w-[50%] h-full w-full flex flex-col items-center justify-center gap-4">
          <div className="h-fit md:w-[50%] w-[90%] flex flex-col items-center  gap-2">
            <h1 className="text-palette-background text-[30px] line-clamp-2  font-semibold md:text-[40px]">
              Themes
            </h1>
            <div className="bg-palette-text h-[3px] w-full"></div>
          </div>
          <div className="w-[95%] h-[345px] border-[3px] border-black shadow-button flex flex-col items-center justify-center bg-palette-background relative">
            <div className="absolute left-0 w-[50px] h-[48px]  border-black border-[3px] rounded-tr-2xl rounded-br-2xl border-l-0 flex flex-col items-center justify-center">
              <ChevronLeft className="w-[40px] h-[40px]  text-black" />
            </div>
            <div className="w-full md:h-[50%] h-[55%] flex flex-col items-center justify-end">
              <p className="text-black text-4xl font-bold">
                {playlistData.theme.toUpperCase()}
              </p>
            </div>
            <div className="w-full md:h-[50%] h-[45%] flex flex-row items-center justify-center flex-wrap gap-3 ">
              <button className=" w-[120px] md:w-[150px] h-[50px] hover:shadow-buttonHover transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background font-semibold border-black border-[3px] shadow-button ">
                <p className="text-black text-base md:text-xl">View</p>
              </button>
              <button className=" w-[120px] md:w-[150px] h-[50px] hover:shadow-buttonHover transition-all bg-opacity-70 ease-in-out duration-300 bg-palette-success text-palette-background font-semibold border-black border-[3px] shadow-button ">
                <p className="text-black text-base md:text-xl">Save</p>
              </button>
            </div>

            <div className="absolute right-0 w-[50px] h-[48px]  border-black border-[3px] rounded-tl-2xl rounded-bl-2xl border-r-0 flex flex-col items-center justify-center">
              <ChevronRight className="w-[40px] h-[40px]  text-black" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
