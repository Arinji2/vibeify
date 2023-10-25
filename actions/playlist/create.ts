"use server";

import { getModel } from "@/utils/getModel";
import getSpotify from "@/utils/getSpotify";
import { SongType, SyncType } from "@/utils/validations/playlists/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Pocketbase from "pocketbase";

export async function CreatePlaylistAction(
  initialState: any,
  formData: FormData
) {
  const userData = await getModel();
  const rawCookie = cookies().get("pb_auth")!.value;
  const token = JSON.parse(rawCookie).token;

  let playlistFormData = {
    spotify_link: formData.get("spotifyLink") as string,
    name: formData.get("privateName") as string,
    link: formData.get("displayLink") as string,
    display_name: formData.get("displayName") as string,
    public: formData.get("publicPlaylist") as string,
    image: formData.get("displayPicture"),
    created_by: userData.id,
  };

  let syncData = {
    displayLinkSync: formData.get("displayLinkSync") === "1" ? true : false,
    displayNameSync: formData.get("displayNameSync") === "1" ? true : false,
    displayPictureSync:
      formData.get("displayPictureSync") === "1" ? true : false,
    weeklySync: formData.get("weeklySync") === "1" ? true : false,
    playlist: "",
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

    const fileData = await fetch(data.images[0].url).then((res) => res.blob());
    const blob = new Blob([fileData], { type: "image/png" });

    formData.append("image", blob, `${data.id}.png`);
    playlistFormData.image = formData.get("image");
  }

  if (!playlistFormData.image)
    return { message: "Image is required", status: 400 };
  if (!playlistFormData.link)
    return { message: "Link is required", status: 400 };
  if (!playlistFormData.display_name)
    return { message: "Name is required", status: 400 };
  if (!playlistFormData.name)
    return { message: "Private Name is required", status: 400 };
  if (!playlistFormData.spotify_link)
    return { message: "Spotify Link is required", status: 400 };

  const pb = new Pocketbase(process.env.NEXT_PUBLIC_POCKETBASE_URL);
  pb.authStore.save(token);

  try {
    const res = await pb.collection("playlists").create(playlistFormData);
    syncData.playlist = res.id;

    await pb.collection("sync").create(syncData);
    revalidatePath("/dashboard");
    return { message: "Playlist Created", status: 200 };
  } catch (e) {
    return { message: "Could not create", status: 400 };
  }
}