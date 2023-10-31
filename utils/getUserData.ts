import Pocketbase from "pocketbase";
import {
  PlaylistSchema,
  SyncSchema,
  ViewsSchema,
} from "./validations/playlists/schema";
import { notFound } from "next/navigation";
import {
  PlaylistType,
  SyncType,
  ViewType,
} from "./validations/playlists/types";
export async function getPlaylist(token: string, playlistID: string) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  let playlistData = null as PlaylistType | null;

  try {
    let playlistRecord = await pb
      .collection("playlists")
      .getFirstListItem(`id = "${playlistID}"`);
    let parsedPlaylist = PlaylistSchema.safeParse(playlistRecord);
    if (!parsedPlaylist.success) notFound();

    playlistData = parsedPlaylist.data as PlaylistType;
  } catch (e) {
    notFound();
  }

  return playlistData;
}

export async function getSync(token: string, playlistID: string) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  let syncData = null as SyncType | null;

  try {
    let syncRecord = await pb
      .collection("sync")
      .getFirstListItem(`playlist = "${playlistID}"`);
    let parsedSyncData = SyncSchema.safeParse(syncRecord);
    if (!parsedSyncData.success) notFound();

    syncData = parsedSyncData.data as SyncType;
  } catch (e) {
    notFound();
  }

  return syncData;
}
export async function getViews(token: string, playlistID: string) {
  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);
  await pb.collection("users").authRefresh();

  let viewData = null as ViewType[] | null;
  try {
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

  return viewData;
}
