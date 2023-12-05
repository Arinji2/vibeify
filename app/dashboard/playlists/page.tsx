import { getToken } from "@/utils/getToken";
import { PlaylistsSchema } from "@/utils/validations/playlists/schema";
import Link from "next/link";
import Pocketbase from "pocketbase";
import { Suspense } from "react";
import {
  CreatePlaylist,
  PlaylistSmall,
  PlaylistSmallLoading,
} from "./components";

export default async function Page() {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();

  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  const playlistRecords = await pb.collection("playlists").getFullList({
    filter: `created_by = "${pb.authStore.model!.id}"`,
  });

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
      {parsedPlaylistRecords.data.length > 0 && (
        <div className="flex flex-row items-center justify-center gap-6 w-full h-full flex-wrap">
          <CreatePlaylist />
          {parsedPlaylistRecords.data.map((playlist) => (
            <Suspense fallback={<PlaylistSmallLoading />} key={playlist.id}>
              <PlaylistSmall playlist={playlist} key={playlist.id} />
            </Suspense>
          ))}
        </div>
      )}
    </main>
  );
}
