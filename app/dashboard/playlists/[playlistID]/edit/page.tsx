export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { Form } from "./form";
import Pocketbase from "pocketbase";
import { getToken } from "@/utils/getToken";
import { PlaylistType, SyncType } from "@/utils/validations/playlists/types";
import {
  PlaylistSchema,
  SyncSchema,
} from "@/utils/validations/playlists/schema";

export default async function CreateForm({
  params,
}: {
  params: { playlistID: string | undefined };
}) {
  if (!params.playlistID) notFound();
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  const token = await getToken();
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

  let syncData: SyncType;

  try {
    let playlistRecord = await pb
      .collection("sync")
      .getFirstListItem(`playlist = "${params.playlistID}"`);
    let parsedPlaylist = SyncSchema.safeParse(playlistRecord);
    if (!parsedPlaylist.success) notFound();

    syncData = parsedPlaylist.data as SyncType;
  } catch (e) {
    notFound();
  }

  return (
    <main className="md:min-h-excludeNav min-h-excludeMobNav bg-palette-accent w-full flex flex-col items-center justify-center py-3 ">
      <Form syncData={syncData} playlistData={playlistData} />
    </main>
  );
}
