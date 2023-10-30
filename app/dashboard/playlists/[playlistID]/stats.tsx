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

export default async function Stats({
  pb,
  playlistID,
  playlistData,
}: {
  pb: Pocketbase;
  playlistID: string;
  playlistData: PlaylistType;
}) {
  let syncData: SyncType;
  let viewData: ViewType[];
  try {
    let syncRecord = await pb
      .collection("sync")
      .getFirstListItem(`playlist = "${playlistID}"`);
    let parsedSync = SyncSchema.safeParse(syncRecord);
    if (!parsedSync.success) notFound();

    syncData = parsedSync.data as SyncType;

    let viewRecord = await pb.collection("views").getFullList({
      sort: "-created",
      filter: `playlist_id = "${playlistID}"`,
    });
    let parsedView = ViewsSchema.safeParse(viewRecord);
    if (!parsedView.success) notFound();

    viewData = parsedView.data as ViewType[];
  } catch (e) {
    notFound();
  }

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
          <WeeklySync />
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2">
          <p className="text-palette-text font-medium truncate text-xl">
            Public:
          </p>
          <Visibility />
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
        <button className="w-full xl:w-[150px] h-[50px] hover:shadow-buttonHover flex flex-col items-center justify-center transition-all ease-in-out duration-300 bg-palette-tertiary text-palette-background font-semibold border-black border-[3px] shadow-button ">
          <p className="text-black text-xl">View</p>
        </button>
        <DeleteButton id={playlistID} name={playlistData.name} />
      </div>
    </>
  );
}
