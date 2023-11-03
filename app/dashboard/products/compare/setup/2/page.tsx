import Link from "next/link";
import Animation from "./animation";
import { ModeSelector, NewPlaylist, OldPlaylistClient } from "./modes";
import { getToken } from "@/utils/getToken";
import Pocketbase from "pocketbase";
import { PlaylistsSchema } from "@/utils/validations/playlists/schema";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  let showSelector = "selector";
  if (!searchParams["mode"]) showSelector = "selector";
  if (searchParams["mode"] === "new") showSelector = "new";
  if (searchParams["mode"] === "old") showSelector = "old";

  return (
    <div className="w-full md:min-h-excludeNav min-h-excludeMobNav h-full flex flex-col items-center justify-center">
      <div className="h-full w-full flex flex-col xl:flex-row items-center justify-center flex-nowrap">
        <div className="md:w-[60%] shrink-0 w-full h-fit p-4 md:h-full flex flex-col items-center justify-start gap-6">
          <h1 className="font-bold text-5xl md:text-6xl pt-3 text-palette-background  text-center">
            Setup Playlist 2
          </h1>
          <div className="min-h-[620px] md:min-h-[450px]  w-full flex flex-col items-center justify-start">
            {showSelector === "selector" && <ModeSelector />}
            {showSelector === "new" && (
              <>
                <NewPlaylist />
                <Link
                  href="/dashboard/products/compare/setup/2"
                  className="text-palette-text text-[20px] my-3 border-b-2 border-black font-medium"
                >
                  Go Back
                </Link>
              </>
            )}
            {showSelector === "old" && (
              <>
                <OldPlaylist />
                <Link
                  href="/dashboard/products/compare/setup/2"
                  className="text-palette-text text-[20px] my-3 border-b-2 border-black font-medium"
                >
                  Go Back
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="xl:w-[4px] bg-black h-[4px] xl:h-[500px] w-[90%]  shrink-0"></div>
        <Animation />
      </div>
    </div>
  );
}

async function OldPlaylist() {
  const token = await getToken();
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  const user = await pb.collection("users").authRefresh();
  const playlists = await pb.collection("playlists").getFullList({
    sort: "-created",
    filter: `created_by = "${user.record.id}"`,
  });

  const validatedPlaylists = PlaylistsSchema.safeParse(playlists);
  if (!validatedPlaylists.success)
    redirect("/dashboard/products/compare/setup");

  const playlistData = [...validatedPlaylists.data];

  return <OldPlaylistClient playlists={playlistData} />;
}
