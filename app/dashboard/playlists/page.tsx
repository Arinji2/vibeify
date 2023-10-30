import Link from "next/link";
import {
  CreatePlaylist,
  PlaylistSmall,
  PlaylistSmallLoading,
} from "./components";
import Pocketbase from "pocketbase";
import { getToken } from "@/utils/getToken";
import {
  PlaylistSchema,
  PlaylistsSchema,
  ViewsSchema,
} from "@/utils/validations/playlists/schema";
import getSpotify from "@/utils/getSpotify";
import { getModel } from "@/utils/getModel";
import { Suspense } from "react";

export default async function Page() {
  const playlist = {
    name: "Playlist Main Name",
    display_name: "Display Name",
    songs: 10,
    views: 10,
    synced: "10/09/23",
    link: "/name",
    id: 0,
  };
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  const model = await getModel();
  pb.authStore.save(token);

  const playlistRecords = await pb.collection("playlists").getFullList({});

  const parsedPlaylistRecords = PlaylistsSchema.safeParse(playlistRecords);

  if (!parsedPlaylistRecords.success) throw new Error("Invalid Playlist Data");

  return (
    <main className="md:min-h-excludeNav min-h-excludeMobNav bg-palette-accent w-full flex flex-col items-center justify-center p-3 px-1 ">
      {parsedPlaylistRecords.data.length === 0 && (
        <div className="w-full h-fit flex flex-col items-center justify-center">
          <h1 className="text-white font-bold text-[40px] text-center md:text-[50px]">
            Add your first Playlist!
          </h1>
          <Link
            href="/dashboard/playlists/create"
            className="w-[60px] shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:scale-95 transition-all ease-in-out duration-300 will-change-transform border-[3px] border-black h-[60px] bg-palette-background rounded-full flex items-center justify-center"
          >
            <p className="text-[50px] font-bold text-palette-text">+</p>
          </Link>
        </div>
      )}
      <div className="flex flex-row items-center justify-center gap-6 w-full h-full flex-wrap">
        <CreatePlaylist />
        {parsedPlaylistRecords.data.map((playlist) => (
          <Suspense fallback={<PlaylistSmallLoading />} key={playlist.id}>
            <PlaylistSmall playlist={playlist} key={playlist.id} />
          </Suspense>
        ))}
      </div>
    </main>
  );
}
