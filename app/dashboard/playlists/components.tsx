import { dateToReadable } from "@/utils/getDate";
import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import { SyncSchema, ViewsSchema } from "@/utils/validations/playlists/schema";
import { PlaylistType } from "@/utils/validations/playlists/types";
import Link from "next/link";
import Pocketbase from "pocketbase";

export async function PlaylistSmall({ playlist }: { playlist: PlaylistType }) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();

  pb.authStore.save(token);
  const ipRecords = await pb.collection("views").getFullList({
    sort: "-created",
    filter: `playlist_id = "${playlist.id}"`,
  });

  const parsedIpRecords = ViewsSchema.safeParse(ipRecords);

  if (!parsedIpRecords.success) throw new Error("Invalid Ip Data");

  const spotify = await getSpotify();
  const spotifySongs = await spotify.playlists.getPlaylistItems(
    playlist.spotify_link.split("/")[4]
  );

  const syncRecords = await pb
    .collection("sync")
    .getFirstListItem(`playlist = "${playlist.id}"`);

  const parsedSyncRecords = SyncSchema.safeParse(syncRecords);
  if (!parsedSyncRecords.success) throw new Error("Invalid Sync Data");

  return (
    <div className="md:w-[300px] flex flex-col items-start justify-start p-4 hover:scale95 transition-all ease-in-out duration-300 will-change-transform w-full gap-4 h-[500px] border-[4px] border-black shadow-button hover:shadow-buttonHover bg-palette-background">
      <div className="w-full h-[171px] flex flex-col items-start justify-center gap-2">
        <h1 className="line-clamp-2 text-black font-bold text-[40px] text-left">
          {playlist.name}
        </h1>
        <h2 className="text-black text-[20px] font-bold text-opacity-40 truncate text-left">
          {playlist.display_name}
        </h2>
        <div className="w-full h-[5px] bg-palette-accent"></div>
      </div>
      <div className="w-full h-fit flex flex-col items-start justify-center gap-2">
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2 truncate">
          <p className="text-black text-[20px] font-medium shrink-0">Songs:</p>
          <p className="text-palette-accent text-[20px] font-medium truncate">
            {
              //@ts-expect-error
              spotifySongs.tracks.total
            }
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2 ">
          <p className="text-black text-[20px] font-medium shrink-0">Views:</p>
          <p className="text-palette-accent text-[20px] font-medium  truncate">
            {parsedIpRecords.data.length}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2 ">
          <p className="text-black text-[20px] font-medium shrink-0 ">
            Last Synced:
          </p>
          <p className="text-palette-accent text-[20px] font-medium truncate">
            {dateToReadable(parsedSyncRecords.data.updated)}
          </p>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-start gap-2 ">
          <p className="text-black text-[20px] font-medium shrink-0 ">Link:</p>
          <p className="text-palette-accent text-[20px] font-medium truncate">
            {playlist.link}
          </p>
        </div>
      </div>
      <div className="w-full h-fit flex flex-row items-center justify-center gap-5 flex-wrap pt-4">
        <Link
          href="/"
          className="w-[100px] h-[35px] bg-palette-tertiary border-[3px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
        >
          <p className="text-black text-[20px] font-medium">View</p>
        </Link>
        <button className="w-[100px] h-[35px] bg-palette-tertiary border-[3px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center ">
          <p className="text-black text-[20px] font-medium">Sync</p>
        </button>
        <Link
          href="/"
          className="w-[100px] h-[35px] bg-palette-tertiary border-[3px] border-black shadow-button hover:shadow-buttonHover transition-all ease-in-out duration-300 will-change-transform hover:scale-95 flex flex-col items-center justify-center "
        >
          <p className="text-black text-[20px] font-medium">Delete</p>
        </Link>
      </div>
    </div>
  );
}