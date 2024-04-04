"use server";

import { getModel } from "@/utils/getModel";
import getSpotify from "@/utils/getSpotify";
import { getToken } from "@/utils/getToken";
import {
  PlaylistSchema,
  SyncSchema,
} from "@/utils/validations/playlists/schema";
import { SyncType } from "@/utils/validations/playlists/types";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import Pocketbase from "pocketbase";

export async function EditPlaylistAction(
  initialState: any,
  formData: FormData
) {
  try {
    const token = await getToken();
    const userData = await getModel();
    const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
    const playlistID = formData.get("playlistID") as string;

    let playlistFormData = {
      spotify_link: formData.get("spotifyLink") as string,
      name: formData.get("privateName") as string,
      link: formData.get("displayLink") as string,
      display_name: formData.get("displayName") as string,
      public: formData.get("publicPlaylist") === "1" ? true : false,

      created_by: userData.id,
    };

    const imageUpdated =
      formData.get("displayPictureUpdated") === "1" ? true : false;
    let image = null as File | null;

    if (imageUpdated) {
      image = formData.get("displayPicture") as File;
    }

    let syncData = {
      displayLinkSync: formData.get("displayLinkSync") === "1" ? true : false,
      displayNameSync: formData.get("displayNameSync") === "1" ? true : false,
      displayPictureSync:
        formData.get("displayPictureSync") === "1" ? true : false,
      weeklySync: formData.get("weeklySync") === "1" ? true : false,
      playlist: playlistID,
    } as SyncType;

    const playlist_id = playlistFormData.spotify_link.split("/")[4];
    const spotify = await getSpotify();
    let data;
    try {
      data = await spotify.playlists.getPlaylist(playlist_id);
    } catch (e) {
      return { message: "Invalid Spotify Link", status: 400 };
    }

    if (syncData.displayLinkSync)
      playlistFormData.link = data.external_urls.spotify.split("/")[4];
    if (syncData.displayNameSync) playlistFormData.display_name = data.name;
    if (syncData.displayPictureSync) {
      const formData = new FormData();

      const fileData = await fetch(data.images[0].url, {
        headers: {
          "Content-Type": "image/png",
        },
      }).then((res) => res.blob());
      const blob = new Blob([fileData], { type: "image/png" });

      formData.append("image", blob, `${data.id}.png`);
      image = formData.get("image") as File;
    }

    pb.authStore.save(token);
    await pb.collection("users").authRefresh();

    let prevSyncData: SyncType;

    try {
      let playlistRecord = await pb
        .collection("sync")
        .getFirstListItem(`playlist = "${playlistID}"`);
      let parsedPlaylist = SyncSchema.safeParse(playlistRecord);
      if (!parsedPlaylist.success) notFound();

      prevSyncData = parsedPlaylist.data as SyncType;
    } catch (e) {
      notFound();
    }

    const res = await pb
      .collection("playlists")
      .update(playlistID, playlistFormData);
    const parsedRes = PlaylistSchema.safeParse(res);
    if (!parsedRes.success)
      return { message: "Something went wrong", status: 500 };
    await pb.collection("sync").update(prevSyncData.id!, syncData);
    if (imageUpdated) {
      await pb.collection("playlists").update(playlistID, {
        image: image,
      });
    }

    revalidatePath("/dashboard/playlists");
    revalidatePath(`/dashboard/playlists/${playlistID}`);
    revalidatePath(`/dashboard/playlists/${playlistID}/edit`);
    revalidatePath(`/${parsedRes.data.link}`);

    return { message: "Playlist Updated", status: 200 };
  } catch (e) {
    return {
      message: "Something went wrong",
      status: 500,
    };
  }
}
