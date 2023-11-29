import { dateToReadable } from "@/utils/getDate";
import getSpotify from "@/utils/getSpotify";
import { SyncSchema, ViewsSchema } from "@/utils/validations/playlists/schema";
import {
  PlaylistType,
  SyncType,
  ViewType,
} from "@/utils/validations/playlists/types";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import { DeleteButton, SyncButton, Visibility, WeeklySync } from "./components";
import Link from "next/link";
import { getSync, getViews } from "@/utils/getUserData";
import { CheckSquare, XSquare } from "lucide-react";

export default async function Stats({
  token,
  playlistID,
  playlistData,
}: {
  token: string;
  playlistID: string;
  playlistData: PlaylistType;
}) {
  let syncData = await getSync(token, playlistID);
  const viewData = await getViews(token, playlistID);

  const api = await getSpotify();
  const spotifyData = await api.playlists.getPlaylist(
    playlistData.spotify_link.split("/")[4]
  );
  return (
    <>
      <div className="w-full xl:w-[60%] h-full flex flex-col items-start justify-center gap-4">
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Songs:
          </p>
          <p className="text-palette-accent font-medium truncate text-xl">
            {spotifyData.tracks.total}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Likes:
          </p>
          <p className="text-palette-accent font-medium truncate text-xl">
            {spotifyData.followers.total}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Views:
          </p>
          <p className="text-palette-accent font-medium truncate text-xl">
            {viewData.length}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Last Synced:
          </p>
          <p className="text-palette-accent font-medium truncate text-xl">
            {dateToReadable(syncData.updated)}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Link:
          </p>
          <p className="text-palette-accent font-medium truncate text-xl">
            {playlistData.link}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-4 py-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Display <br /> Picture:
          </p>
          <div className="w-[150px] h-[80px] relative overflow-hidden">
            {/*eslint-disable-next-line @next/next/no-img-element*/}
            <img
              src={`https://db-listify.arinji.com/api/files/playlists/${playlistData.id}/${playlistData.image}`}
              alt={playlistData.name}
              className="  object-contain   border-[3px] border-black  max-w-full max-h-full"
            />
          </div>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Weekly Sync:
          </p>
          {syncData.weeklySync ? (
            <CheckSquare className="w-[30px] h-[30px] text-palette-accent" />
          ) : (
            <XSquare className="w-[30px] h-[30px] text-palette-error" />
          )}
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Public:
          </p>
          {playlistData.public ? (
            <CheckSquare className="w-[30px] h-[30px] text-palette-accent" />
          ) : (
            <XSquare className="w-[30px] h-[30px] text-palette-error" />
          )}
        </div>
      </div>
      <div className="w-full xl:w-[40%] h-full flex flex-col items-center justify-center gap-5">
        <SyncButton id={playlistID} />
        <Link
          href={`/dashboard/playlists/${playlistID}/edit`}
          className="w-full xl:w-[150px] h-[50px] hover:shadow-buttonHover flex flex-col items-center justify-center transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background font-semibold border-black border-[3px] shadow-button "
        >
          <p className="text-black text-xl">Edit</p>
        </Link>
        <Link
          href={`/${playlistData.link}`}
          className="w-full xl:w-[150px] h-[50px] hover:shadow-buttonHover flex flex-col items-center justify-center transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background font-semibold border-black border-[3px] shadow-button "
        >
          <p className="text-black text-xl">View</p>
        </Link>
        <DeleteButton id={playlistID} name={playlistData.name} />
      </div>
    </>
  );
}
