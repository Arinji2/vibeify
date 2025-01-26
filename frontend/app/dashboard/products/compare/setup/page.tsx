import { getToken } from "@/utils/getToken";
import {
  PlaylistSchema,
  PlaylistsSchema,
} from "@/utils/validations/playlists/schema";
import Link from "next/link";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";
import { ComparePlaylistButton, PlaylistImage } from "./playlist-card.client";

export default async function Page({
  searchParams,
}: {
  searchParams: {
    firstID: string | string[] | undefined;
  };
}) {
  let hasSelectedFirst = false;

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  try {
    if (searchParams.firstID && !Array.isArray(searchParams.firstID)) {
      const selectedPlaylist = await pb
        .collection("playlists")
        .getOne(searchParams.firstID);

      const parsedPlaylist = PlaylistSchema.safeParse(selectedPlaylist);
      if (
        parsedPlaylist.success &&
        parsedPlaylist.data.created_by === pb.authStore.model!.id
      ) {
        hasSelectedFirst = true;
      }
    }
  } catch (e) {}

  const playlists = await pb.collection("playlists").getFullList({
    filter: `created_by = "${pb.authStore.model!.id}"`,
  });

  const parsedPlaylists = PlaylistsSchema.safeParse(playlists);
  if (!parsedPlaylists.success) notFound();

  return (
    <div className="w-full md:min-h-excludeNav min-h-excludeMobNav h-full flex flex-col items-center justify-start py-6 gap-14">
      <h1 className="font-bold text-5xl md:text-6xl pt-3 text-palette-background  text-center">
        Setup Playlist {hasSelectedFirst ? "2" : "1"}
      </h1>
      <Link
        href="/dashboard/products/compare"
        className="px-4 md:px-6 rounded-lg py-2 text-xs md:text-lg font-medium shadow-buttonHover border-[3px] bg-palette-background text-black border-black  flex flex-row gap-2 items-center justify-center"
      >
        Go To Compare Dashboard
      </Link>
      <div className="w-full h-fit grid grid-cols-1 md:grid-cols-2 gap-4">
        {parsedPlaylists.data.map((playlist) => {
          if (hasSelectedFirst && playlist.id === searchParams.firstID) return;
          return (
            <div
              key={playlist.id}
              className="w-full max-w-[600px] gap-4 px-4 py-4 border-[3px] bg-palette-background rounded-lg flex flex-row items-center justify-between border-black shadow-button h-[150px]"
            >
              <PlaylistImage image={playlist.image} recordID={playlist.id!} />
              <div className="w-fit h-fit flex flex-col items-end justify-center gap-5">
                <h2 className="text-xl md:text-3xl font-medium text-palette-text line-clamp-1">
                  {playlist.name}
                </h2>
                <div className="w-fit h-fit flex flex-row items-center justify-end gap-4">
                  {hasSelectedFirst ? (
                    <ComparePlaylistButton
                      playlist1={searchParams.firstID! as string}
                      playlist2={playlist.id!}
                    />
                  ) : (
                    <Link
                      href={`/dashboard/products/compare/setup?firstID=${playlist.id}`}
                      className="px-4 md:px-6 w-[73px] md:w-[95px] rounded-lg py-2 text-xs md:text-sm shadow-buttonHover border-[3px] bg-blue-500 border-black  flex flex-row gap-2 items-center justify-center"
                    >
                      Select
                    </Link>
                  )}

                  <Link
                    href={playlist.spotify_link}
                    target="_blank"
                    className="px-4 md:px-6 whitespace-nowrap rounded-lg py-2 text-xs md:text-sm shadow-buttonHover border-[3px] bg-palette-accent border-black  flex flex-row gap-2 items-center justify-center"
                  >
                    View In Spotify
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
